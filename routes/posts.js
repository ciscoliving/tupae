const express = require('express');
const { body, validationResult } = require('express-validator');
const Post = require('../models/Post');
const { auth } = require('../middleware/auth');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;

const router = express.Router();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image and video files are allowed'), false);
    }
  }
});

// @route   POST /api/posts
// @desc    Create a new post
// @access  Private
router.post('/', [
  auth,
  body('content').notEmpty().withMessage('Content is required'),
  body('platforms').isArray().withMessage('Platforms must be an array'),
  body('platforms.*.platform').isIn(['facebook', 'instagram', 'twitter', 'linkedin', 'youtube', 'tiktok'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      title,
      content,
      platforms,
      tags,
      category,
      isStory,
      scheduledFor,
      settings
    } = req.body;

    // Determine status based on scheduling
    let status = 'draft';
    if (scheduledFor) {
      const scheduledDate = new Date(scheduledFor);
      if (scheduledDate > new Date()) {
        status = 'scheduled';
      } else {
        return res.status(400).json({ error: 'Scheduled time must be in the future.' });
      }
    }

    const post = new Post({
      user: req.user._id,
      title,
      content,
      platforms: platforms.map(platform => ({
        platform: platform.platform,
        accountId: platform.accountId,
        accountName: platform.accountName,
        status: status === 'scheduled' ? 'scheduled' : 'pending'
      })),
      tags,
      category,
      isStory,
      scheduledFor,
      status,
      settings
    });

    await post.save();

    res.status(201).json(post);
  } catch (error) {
    console.error('Create post error:', error);
    res.status(500).json({ error: 'Server error.' });
  }
});

// @route   POST /api/posts/:id/media
// @desc    Upload media for a post
// @access  Private
router.post('/:id/media', [auth, upload.array('media', 10)], async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found.' });
    }

    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized.' });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No media files provided.' });
    }

    const uploadedMedia = [];

    for (let i = 0; i < req.files.length; i++) {
      const file = req.files[i];
      
      // Upload to Cloudinary
      const result = await new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            resource_type: file.mimetype.startsWith('video/') ? 'video' : 'image',
            folder: 'tupae-posts',
            public_id: `${post._id}_${Date.now()}_${i}`
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        );

        uploadStream.end(file.buffer);
      });

      uploadedMedia.push({
        type: file.mimetype.startsWith('video/') ? 'video' : 'image',
        url: result.secure_url,
        thumbnail: result.thumbnail_url || result.secure_url,
        altText: req.body.altText?.[i] || '',
        order: i
      });
    }

    post.media = uploadedMedia;
    await post.save();

    res.json(post);
  } catch (error) {
    console.error('Upload media error:', error);
    res.status(500).json({ error: 'Server error.' });
  }
});

// @route   GET /api/posts
// @desc    Get all posts for user
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { status, platform, page = 1, limit = 10, search } = req.query;
    
    const query = { user: req.user._id };
    
    if (status) {
      query.status = status;
    }
    
    if (platform) {
      query['platforms.platform'] = platform;
    }
    
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    const posts = await Post.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('user', 'firstName lastName email');

    const total = await Post.countDocuments(query);

    res.json({
      posts,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    console.error('Get posts error:', error);
    res.status(500).json({ error: 'Server error.' });
  }
});

// @route   GET /api/posts/:id
// @desc    Get post by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('user', 'firstName lastName email');

    if (!post) {
      return res.status(404).json({ error: 'Post not found.' });
    }

    if (post.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized.' });
    }

    res.json(post);
  } catch (error) {
    console.error('Get post error:', error);
    res.status(500).json({ error: 'Server error.' });
  }
});

// @route   PUT /api/posts/:id
// @desc    Update post
// @access  Private
router.put('/:id', [
  auth,
  body('content').notEmpty().withMessage('Content is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found.' });
    }

    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized.' });
    }

    // Don't allow updates to published posts
    if (post.status === 'published') {
      return res.status(400).json({ error: 'Cannot update published posts.' });
    }

    const {
      title,
      content,
      platforms,
      tags,
      category,
      isStory,
      scheduledFor,
      settings
    } = req.body;

    // Update fields
    post.title = title;
    post.content = content;
    post.tags = tags;
    post.category = category;
    post.isStory = isStory;
    post.settings = settings;

    // Update platforms if provided
    if (platforms) {
      post.platforms = platforms.map(platform => ({
        platform: platform.platform,
        accountId: platform.accountId,
        accountName: platform.accountName,
        status: platform.status || 'pending'
      }));
    }

    // Update scheduling
    if (scheduledFor) {
      const scheduledDate = new Date(scheduledFor);
      if (scheduledDate > new Date()) {
        post.scheduledFor = scheduledDate;
        post.status = 'scheduled';
      } else {
        return res.status(400).json({ error: 'Scheduled time must be in the future.' });
      }
    }

    await post.save();

    res.json(post);
  } catch (error) {
    console.error('Update post error:', error);
    res.status(500).json({ error: 'Server error.' });
  }
});

// @route   DELETE /api/posts/:id
// @desc    Delete post
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found.' });
    }

    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized.' });
    }

    // Delete media from Cloudinary
    if (post.media && post.media.length > 0) {
      for (const media of post.media) {
        if (media.url) {
          const publicId = media.url.split('/').pop().split('.')[0];
          await cloudinary.uploader.destroy(publicId);
        }
      }
    }

    await post.remove();

    res.json({ message: 'Post deleted successfully.' });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ error: 'Server error.' });
  }
});

// @route   POST /api/posts/:id/publish
// @desc    Publish post immediately
// @access  Private
router.post('/:id/publish', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found.' });
    }

    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized.' });
    }

    if (post.status === 'published') {
      return res.status(400).json({ error: 'Post is already published.' });
    }

    // Here you would integrate with social media APIs to actually publish
    // For now, we'll just mark it as published
    post.status = 'published';
    post.publishedAt = new Date();
    post.platforms.forEach(platform => {
      platform.status = 'published';
      platform.publishedAt = new Date();
    });

    await post.save();

    res.json(post);
  } catch (error) {
    console.error('Publish post error:', error);
    res.status(500).json({ error: 'Server error.' });
  }
});

// @route   POST /api/posts/:id/schedule
// @desc    Schedule post
// @access  Private
router.post('/:id/schedule', [
  auth,
  body('scheduledFor').isISO8601().withMessage('Valid date required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ error: 'Post not found.' });
    }

    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: 'Not authorized.' });
    }

    const { scheduledFor } = req.body;
    const scheduledDate = new Date(scheduledFor);

    if (scheduledDate <= new Date()) {
      return res.status(400).json({ error: 'Scheduled time must be in the future.' });
    }

    post.scheduledFor = scheduledDate;
    post.status = 'scheduled';
    post.platforms.forEach(platform => {
      platform.status = 'scheduled';
    });

    await post.save();

    res.json(post);
  } catch (error) {
    console.error('Schedule post error:', error);
    res.status(500).json({ error: 'Server error.' });
  }
});

// @route   GET /api/posts/stats/overview
// @desc    Get post statistics overview
// @access  Private
router.get('/stats/overview', auth, async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    const query = { user: req.user._id };
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const stats = await Post.aggregate([
      { $match: query },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalEngagement: { $sum: '$analytics.engagement' },
          totalReach: { $sum: '$analytics.reach' },
          totalImpressions: { $sum: '$analytics.impressions' }
        }
      }
    ]);

    const totalPosts = await Post.countDocuments(query);
    const publishedPosts = await Post.countDocuments({ ...query, status: 'published' });
    const scheduledPosts = await Post.countDocuments({ ...query, status: 'scheduled' });
    const draftPosts = await Post.countDocuments({ ...query, status: 'draft' });

    res.json({
      totalPosts,
      publishedPosts,
      scheduledPosts,
      draftPosts,
      stats
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Server error.' });
  }
});

module.exports = router; 