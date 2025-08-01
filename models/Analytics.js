const mongoose = require('mongoose');

const analyticsSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post'
  },
  platform: {
    type: String,
    enum: ['facebook', 'instagram', 'twitter', 'linkedin', 'youtube', 'tiktok'],
    required: true
  },
  accountId: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  metrics: {
    impressions: {
      type: Number,
      default: 0
    },
    reach: {
      type: Number,
      default: 0
    },
    engagement: {
      type: Number,
      default: 0
    },
    clicks: {
      type: Number,
      default: 0
    },
    shares: {
      type: Number,
      default: 0
    },
    comments: {
      type: Number,
      default: 0
    },
    likes: {
      type: Number,
      default: 0
    },
    saves: {
      type: Number,
      default: 0
    },
    videoViews: {
      type: Number,
      default: 0
    },
    videoWatchTime: {
      type: Number,
      default: 0
    },
    profileVisits: {
      type: Number,
      default: 0
    },
    follows: {
      type: Number,
      default: 0
    },
    unfollows: {
      type: Number,
      default: 0
    }
  },
  demographics: {
    age: {
      '13-17': { type: Number, default: 0 },
      '18-24': { type: Number, default: 0 },
      '25-34': { type: Number, default: 0 },
      '35-44': { type: Number, default: 0 },
      '45-54': { type: Number, default: 0 },
      '55-64': { type: Number, default: 0 },
      '65+': { type: Number, default: 0 }
    },
    gender: {
      male: { type: Number, default: 0 },
      female: { type: Number, default: 0 },
      other: { type: Number, default: 0 }
    },
    countries: [{
      country: String,
      count: { type: Number, default: 0 }
    }],
    cities: [{
      city: String,
      count: { type: Number, default: 0 }
    }]
  },
  topPosts: [{
    postId: String,
    title: String,
    content: String,
    mediaUrl: String,
    impressions: Number,
    engagement: Number,
    reach: Number
  }],
  hashtagPerformance: [{
    hashtag: String,
    impressions: Number,
    reach: Number,
    engagement: Number
  }],
  bestTimes: [{
    day: {
      type: String,
      enum: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
    },
    hour: Number,
    engagement: Number
  }],
  audienceGrowth: {
    followers: {
      type: Number,
      default: 0
    },
    newFollowers: {
      type: Number,
      default: 0
    },
    unfollowers: {
      type: Number,
      default: 0
    },
    netGrowth: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

// Indexes for better query performance
analyticsSchema.index({ user: 1, platform: 1, date: -1 });
analyticsSchema.index({ post: 1, platform: 1 });
analyticsSchema.index({ accountId: 1, date: -1 });

// Virtual for engagement rate
analyticsSchema.virtual('engagementRate').get(function() {
  const reach = this.metrics.reach || 1;
  return ((this.metrics.engagement / reach) * 100).toFixed(2);
});

// Virtual for total interactions
analyticsSchema.virtual('totalInteractions').get(function() {
  return this.metrics.likes + this.metrics.comments + this.metrics.shares + this.metrics.saves;
});

// Static method to get analytics for a date range
analyticsSchema.statics.getAnalyticsForRange = function(userId, platform, startDate, endDate) {
  return this.find({
    user: userId,
    platform,
    date: {
      $gte: startDate,
      $lte: endDate
    }
  }).sort({ date: 1 });
};

// Static method to get aggregated analytics
analyticsSchema.statics.getAggregatedAnalytics = function(userId, platform, startDate, endDate) {
  return this.aggregate([
    {
      $match: {
        user: mongoose.Types.ObjectId(userId),
        platform,
        date: {
          $gte: startDate,
          $lte: endDate
        }
      }
    },
    {
      $group: {
        _id: {
          $dateToString: { format: "%Y-%m-%d", date: "$date" }
        },
        totalImpressions: { $sum: "$metrics.impressions" },
        totalReach: { $sum: "$metrics.reach" },
        totalEngagement: { $sum: "$metrics.engagement" },
        totalClicks: { $sum: "$metrics.clicks" },
        totalLikes: { $sum: "$metrics.likes" },
        totalComments: { $sum: "$metrics.comments" },
        totalShares: { $sum: "$metrics.shares" },
        totalFollowers: { $sum: "$audienceGrowth.followers" },
        newFollowers: { $sum: "$audienceGrowth.newFollowers" }
      }
    },
    {
      $sort: { _id: 1 }
    }
  ]);
};

// Static method to get top performing posts
analyticsSchema.statics.getTopPosts = function(userId, platform, limit = 10) {
  return this.aggregate([
    {
      $match: {
        user: mongoose.Types.ObjectId(userId),
        platform
      }
    },
    {
      $unwind: "$topPosts"
    },
    {
      $sort: { "topPosts.engagement": -1 }
    },
    {
      $limit: limit
    },
    {
      $project: {
        post: "$topPosts"
      }
    }
  ]);
};

// Instance method to update metrics
analyticsSchema.methods.updateMetrics = function(newMetrics) {
  this.metrics = {
    ...this.metrics,
    ...newMetrics
  };
  return this.save();
};

// Instance method to add demographic data
analyticsSchema.methods.addDemographics = function(demographicData) {
  this.demographics = {
    ...this.demographics,
    ...demographicData
  };
  return this.save();
};

// Ensure virtual fields are serialized
analyticsSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model('Analytics', analyticsSchema); 