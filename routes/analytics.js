const express = require('express');
const Analytics = require('../models/Analytics');
const Post = require('../models/Post');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/analytics/overview
// @desc    Get analytics overview for user
// @access  Private
router.get('/overview', auth, async (req, res) => {
  try {
    const { startDate, endDate, platform } = req.query;
    
    const query = { user: req.user._id };
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    if (platform) {
      query.platform = platform;
    }

    // Get aggregated analytics
    const analytics = await Analytics.getAggregatedAnalytics(
      req.user._id,
      platform || 'all',
      startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Last 30 days
      endDate ? new Date(endDate) : new Date()
    );

    // Get top performing posts
    const topPosts = await Analytics.getTopPosts(req.user._id, platform, 5);

    // Get platform-specific data
    const platforms = ['facebook', 'instagram', 'twitter', 'linkedin', 'youtube', 'tiktok'];
    const platformData = {};

    for (const plat of platforms) {
      const platformAnalytics = await Analytics.findOne({
        user: req.user._id,
        platform: plat,
        date: {
          $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // Last 7 days
        }
      }).sort({ date: -1 });

      if (platformAnalytics) {
        platformData[plat] = {
          followers: platformAnalytics.audienceGrowth.followers,
          engagement: platformAnalytics.metrics.engagement,
          reach: platformAnalytics.metrics.reach,
          impressions: platformAnalytics.metrics.impressions
        };
      }
    }

    res.json({
      analytics,
      topPosts,
      platformData
    });
  } catch (error) {
    console.error('Get analytics overview error:', error);
    res.status(500).json({ error: 'Server error.' });
  }
});

// @route   GET /api/analytics/platform/:platform
// @desc    Get analytics for specific platform
// @access  Private
router.get('/platform/:platform', auth, async (req, res) => {
  try {
    const { platform } = req.params;
    const { startDate, endDate } = req.query;

    const query = {
      user: req.user._id,
      platform
    };

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const analytics = await Analytics.find(query).sort({ date: 1 });

    // Get demographics for the platform
    const latestAnalytics = await Analytics.findOne({
      user: req.user._id,
      platform
    }).sort({ date: -1 });

    res.json({
      analytics,
      demographics: latestAnalytics?.demographics || {},
      bestTimes: latestAnalytics?.bestTimes || []
    });
  } catch (error) {
    console.error('Get platform analytics error:', error);
    res.status(500).json({ error: 'Server error.' });
  }
});

// @route   GET /api/analytics/posts
// @desc    Get analytics for posts
// @access  Private
router.get('/posts', auth, async (req, res) => {
  try {
    const { startDate, endDate, platform, limit = 10 } = req.query;

    const query = { user: req.user._id };
    if (startDate && endDate) {
      query.publishedAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    if (platform) {
      query['platforms.platform'] = platform;
    }

    const posts = await Post.find(query)
      .sort({ 'analytics.engagement': -1 })
      .limit(parseInt(limit))
      .select('title content media analytics platforms publishedAt');

    res.json(posts);
  } catch (error) {
    console.error('Get posts analytics error:', error);
    res.status(500).json({ error: 'Server error.' });
  }
});

// @route   GET /api/analytics/engagement
// @desc    Get engagement analytics
// @access  Private
router.get('/engagement', auth, async (req, res) => {
  try {
    const { startDate, endDate, platform } = req.query;

    const query = { user: req.user._id };
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    if (platform) {
      query.platform = platform;
    }

    const engagementData = await Analytics.aggregate([
      { $match: query },
      {
        $group: {
          _id: {
            $dateToString: { format: "%Y-%m-%d", date: "$date" }
          },
          totalLikes: { $sum: "$metrics.likes" },
          totalComments: { $sum: "$metrics.comments" },
          totalShares: { $sum: "$metrics.shares" },
          totalEngagement: { $sum: "$metrics.engagement" },
          totalReach: { $sum: "$metrics.reach" },
          engagementRate: {
            $avg: {
              $cond: [
                { $eq: ["$metrics.reach", 0] },
                0,
                { $divide: ["$metrics.engagement", "$metrics.reach"] }
              ]
            }
          }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json(engagementData);
  } catch (error) {
    console.error('Get engagement analytics error:', error);
    res.status(500).json({ error: 'Server error.' });
  }
});

// @route   GET /api/analytics/demographics
// @desc    Get demographics analytics
// @access  Private
router.get('/demographics', auth, async (req, res) => {
  try {
    const { platform } = req.query;

    const query = { user: req.user._id };
    if (platform) {
      query.platform = platform;
    }

    const demographics = await Analytics.findOne(query)
      .sort({ date: -1 })
      .select('demographics');

    res.json(demographics?.demographics || {});
  } catch (error) {
    console.error('Get demographics error:', error);
    res.status(500).json({ error: 'Server error.' });
  }
});

// @route   GET /api/analytics/best-times
// @desc    Get best posting times
// @access  Private
router.get('/best-times', auth, async (req, res) => {
  try {
    const { platform } = req.query;

    const query = { user: req.user._id };
    if (platform) {
      query.platform = platform;
    }

    const bestTimes = await Analytics.findOne(query)
      .sort({ date: -1 })
      .select('bestTimes');

    res.json(bestTimes?.bestTimes || []);
  } catch (error) {
    console.error('Get best times error:', error);
    res.status(500).json({ error: 'Server error.' });
  }
});

// @route   GET /api/analytics/hashtags
// @desc    Get hashtag performance
// @access  Private
router.get('/hashtags', auth, async (req, res) => {
  try {
    const { platform, limit = 10 } = req.query;

    const query = { user: req.user._id };
    if (platform) {
      query.platform = platform;
    }

    const hashtagData = await Analytics.aggregate([
      { $match: query },
      { $unwind: "$hashtagPerformance" },
      {
        $group: {
          _id: "$hashtagPerformance.hashtag",
          totalImpressions: { $sum: "$hashtagPerformance.impressions" },
          totalReach: { $sum: "$hashtagPerformance.reach" },
          totalEngagement: { $sum: "$hashtagPerformance.engagement" },
          usageCount: { $sum: 1 }
        }
      },
      {
        $project: {
          hashtag: "$_id",
          totalImpressions: 1,
          totalReach: 1,
          totalEngagement: 1,
          usageCount: 1,
          avgEngagementRate: {
            $cond: [
              { $eq: ["$totalReach", 0] },
              0,
              { $divide: ["$totalEngagement", "$totalReach"] }
            ]
          }
        }
      },
      { $sort: { totalEngagement: -1 } },
      { $limit: parseInt(limit) }
    ]);

    res.json(hashtagData);
  } catch (error) {
    console.error('Get hashtag analytics error:', error);
    res.status(500).json({ error: 'Server error.' });
  }
});

// @route   POST /api/analytics/sync
// @desc    Sync analytics data from social media platforms
// @access  Private
router.post('/sync', auth, async (req, res) => {
  try {
    const { platform, accountId } = req.body;

    // This would integrate with social media APIs to fetch real analytics
    // For now, we'll create mock data
    const mockAnalytics = {
      user: req.user._id,
      platform,
      accountId,
      date: new Date(),
      metrics: {
        impressions: Math.floor(Math.random() * 1000) + 100,
        reach: Math.floor(Math.random() * 800) + 50,
        engagement: Math.floor(Math.random() * 200) + 10,
        clicks: Math.floor(Math.random() * 50) + 5,
        shares: Math.floor(Math.random() * 30) + 2,
        comments: Math.floor(Math.random() * 20) + 1,
        likes: Math.floor(Math.random() * 100) + 5
      },
      demographics: {
        age: {
          '13-17': Math.floor(Math.random() * 50),
          '18-24': Math.floor(Math.random() * 200),
          '25-34': Math.floor(Math.random() * 300),
          '35-44': Math.floor(Math.random() * 150),
          '45-54': Math.floor(Math.random() * 100),
          '55-64': Math.floor(Math.random() * 50),
          '65+': Math.floor(Math.random() * 25)
        },
        gender: {
          male: Math.floor(Math.random() * 400),
          female: Math.floor(Math.random() * 400),
          other: Math.floor(Math.random() * 50)
        }
      },
      audienceGrowth: {
        followers: Math.floor(Math.random() * 1000) + 500,
        newFollowers: Math.floor(Math.random() * 50) + 5,
        unfollowers: Math.floor(Math.random() * 10),
        netGrowth: Math.floor(Math.random() * 40) + 5
      }
    };

    const analytics = new Analytics(mockAnalytics);
    await analytics.save();

    res.json({ message: 'Analytics synced successfully', analytics });
  } catch (error) {
    console.error('Sync analytics error:', error);
    res.status(500).json({ error: 'Server error.' });
  }
});

// @route   GET /api/analytics/export
// @desc    Export analytics data
// @access  Private
router.get('/export', auth, async (req, res) => {
  try {
    const { startDate, endDate, platform, format = 'json' } = req.query;

    const query = { user: req.user._id };
    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }
    if (platform) {
      query.platform = platform;
    }

    const analytics = await Analytics.find(query).sort({ date: 1 });

    if (format === 'csv') {
      // Convert to CSV format
      const csvData = analytics.map(record => ({
        date: record.date,
        platform: record.platform,
        impressions: record.metrics.impressions,
        reach: record.metrics.reach,
        engagement: record.metrics.engagement,
        clicks: record.metrics.clicks,
        shares: record.metrics.shares,
        comments: record.metrics.comments,
        likes: record.metrics.likes
      }));

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=analytics.csv');
      
      // Simple CSV conversion
      const csv = [
        Object.keys(csvData[0]).join(','),
        ...csvData.map(row => Object.values(row).join(','))
      ].join('\n');

      res.send(csv);
    } else {
      res.json(analytics);
    }
  } catch (error) {
    console.error('Export analytics error:', error);
    res.status(500).json({ error: 'Server error.' });
  }
});

module.exports = router; 