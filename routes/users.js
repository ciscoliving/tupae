const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
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

// Configure multer for profile image uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'), false);
    }
  }
});

// @route   GET /api/users/profile
// @desc    Get user profile
// @access  Private
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('socialMediaAccounts');
    
    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Server error.' });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', [
  auth,
  body('firstName').optional().trim().notEmpty(),
  body('lastName').optional().trim().notEmpty(),
  body('company').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { firstName, lastName, company } = req.body;
    const user = await User.findById(req.user._id);

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (company !== undefined) user.company = company;

    await user.save();

    res.json({
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: user.fullName,
      company: user.company,
      role: user.role,
      subscription: user.subscription,
      isVerified: user.isVerified
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Server error.' });
  }
});

// @route   POST /api/users/profile-image
// @desc    Upload profile image
// @access  Private
router.post('/profile-image', [auth, upload.single('image')], async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image file provided.' });
    }

    const user = await User.findById(req.user._id);

    // Delete old profile image if exists
    if (user.profileImage) {
      const publicId = user.profileImage.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(publicId);
    }

    // Upload new image to Cloudinary
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'tupae-profiles',
          public_id: `profile_${user._id}_${Date.now()}`,
          transformation: [
            { width: 400, height: 400, crop: 'fill' },
            { quality: 'auto' }
          ]
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      uploadStream.end(req.file.buffer);
    });

    user.profileImage = result.secure_url;
    await user.save();

    res.json({ profileImage: result.secure_url });
  } catch (error) {
    console.error('Upload profile image error:', error);
    res.status(500).json({ error: 'Server error.' });
  }
});

// @route   PUT /api/users/preferences
// @desc    Update user preferences
// @access  Private
router.put('/preferences', [
  auth,
  body('timezone').optional().isString(),
  body('language').optional().isIn(['en', 'es', 'fr', 'de']),
  body('notifications.email').optional().isBoolean(),
  body('notifications.push').optional().isBoolean(),
  body('notifications.sms').optional().isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { timezone, language, notifications } = req.body;
    const user = await User.findById(req.user._id);

    if (timezone) user.preferences.timezone = timezone;
    if (language) user.preferences.language = language;
    if (notifications) {
      user.preferences.notifications = {
        ...user.preferences.notifications,
        ...notifications
      };
    }

    await user.save();

    res.json(user.preferences);
  } catch (error) {
    console.error('Update preferences error:', error);
    res.status(500).json({ error: 'Server error.' });
  }
});

// @route   POST /api/users/social-media/connect
// @desc    Connect social media account
// @access  Private
router.post('/social-media/connect', [
  auth,
  body('platform').isIn(['facebook', 'instagram', 'twitter', 'linkedin', 'youtube', 'tiktok']),
  body('accountId').notEmpty(),
  body('accountName').notEmpty(),
  body('accessToken').notEmpty()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { platform, accountId, accountName, accessToken, refreshToken } = req.body;
    const user = await User.findById(req.user._id);

    // Check if account already exists
    const existingAccount = user.socialMediaAccounts.find(
      account => account.platform === platform && account.accountId === accountId
    );

    if (existingAccount) {
      // Update existing account
      existingAccount.accountName = accountName;
      existingAccount.accessToken = accessToken;
      if (refreshToken) existingAccount.refreshToken = refreshToken;
      existingAccount.isConnected = true;
      existingAccount.lastSync = new Date();
    } else {
      // Add new account
      user.socialMediaAccounts.push({
        platform,
        accountId,
        accountName,
        accessToken,
        refreshToken,
        isConnected: true,
        lastSync: new Date()
      });
    }

    await user.save();

    res.json(user.socialMediaAccounts);
  } catch (error) {
    console.error('Connect social media error:', error);
    res.status(500).json({ error: 'Server error.' });
  }
});

// @route   DELETE /api/users/social-media/:platform/:accountId
// @desc    Disconnect social media account
// @access  Private
router.delete('/social-media/:platform/:accountId', auth, async (req, res) => {
  try {
    const { platform, accountId } = req.params;
    const user = await User.findById(req.user._id);

    user.socialMediaAccounts = user.socialMediaAccounts.filter(
      account => !(account.platform === platform && account.accountId === accountId)
    );

    await user.save();

    res.json({ message: 'Social media account disconnected successfully.' });
  } catch (error) {
    console.error('Disconnect social media error:', error);
    res.status(500).json({ error: 'Server error.' });
  }
});

// @route   GET /api/users/social-media
// @desc    Get user's social media accounts
// @access  Private
router.get('/social-media', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    res.json(user.socialMediaAccounts);
  } catch (error) {
    console.error('Get social media accounts error:', error);
    res.status(500).json({ error: 'Server error.' });
  }
});

// @route   POST /api/users/subscription/upgrade
// @desc    Upgrade user subscription
// @access  Private
router.post('/subscription/upgrade', [
  auth,
  body('plan').isIn(['basic', 'pro', 'enterprise']),
  body('features').optional().isArray()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { plan, features } = req.body;
    const user = await User.findById(req.user._id);

    user.subscription.plan = plan;
    user.subscription.startDate = new Date();
    user.subscription.endDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days
    if (features) user.subscription.features = features;

    await user.save();

    res.json(user.subscription);
  } catch (error) {
    console.error('Upgrade subscription error:', error);
    res.status(500).json({ error: 'Server error.' });
  }
});

// @route   GET /api/users/stats
// @desc    Get user statistics
// @access  Private
router.get('/stats', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    // Get post statistics
    const Post = require('../models/Post');
    const totalPosts = await Post.countDocuments({ user: user._id });
    const publishedPosts = await Post.countDocuments({ user: user._id, status: 'published' });
    const scheduledPosts = await Post.countDocuments({ user: user._id, status: 'scheduled' });
    const draftPosts = await Post.countDocuments({ user: user._id, status: 'draft' });

    // Get connected social media accounts
    const connectedAccounts = user.socialMediaAccounts.filter(account => account.isConnected);

    const stats = {
      totalPosts,
      publishedPosts,
      scheduledPosts,
      draftPosts,
      connectedAccounts: connectedAccounts.length,
      totalAccounts: user.socialMediaAccounts.length,
      subscription: user.subscription,
      memberSince: user.createdAt
    };

    res.json(stats);
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({ error: 'Server error.' });
  }
});

// @route   DELETE /api/users/account
// @desc    Delete user account
// @access  Private
router.delete('/account', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    // Delete user's posts and media
    const Post = require('../models/Post');
    const userPosts = await Post.find({ user: user._id });

    // Delete media from Cloudinary
    for (const post of userPosts) {
      if (post.media && post.media.length > 0) {
        for (const media of post.media) {
          if (media.url) {
            const publicId = media.url.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(publicId);
          }
        }
      }
    }

    // Delete posts
    await Post.deleteMany({ user: user._id });

    // Delete user
    await user.remove();

    res.json({ message: 'Account deleted successfully.' });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({ error: 'Server error.' });
  }
});

module.exports = router; 