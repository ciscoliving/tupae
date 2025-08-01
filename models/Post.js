const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    trim: true
  },
  content: {
    type: String,
    required: true,
    trim: true
  },
  media: [{
    type: {
      type: String,
      enum: ['image', 'video', 'gif']
    },
    url: String,
    thumbnail: String,
    altText: String,
    order: Number
  }],
  platforms: [{
    platform: {
      type: String,
      enum: ['facebook', 'instagram', 'twitter', 'linkedin', 'youtube', 'tiktok']
    },
    accountId: String,
    accountName: String,
    postId: String, // ID from the social media platform
    status: {
      type: String,
      enum: ['pending', 'scheduled', 'published', 'failed', 'draft'],
      default: 'pending'
    },
    publishedAt: Date,
    error: String
  }],
  status: {
    type: String,
    enum: ['draft', 'scheduled', 'published', 'failed'],
    default: 'draft'
  },
  scheduledFor: {
    type: Date
  },
  publishedAt: {
    type: Date
  },
  tags: [{
    type: String,
    trim: true
  }],
  category: {
    type: String,
    trim: true
  },
  isStory: {
    type: Boolean,
    default: false
  },
  analytics: {
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
    lastUpdated: {
      type: Date,
      default: Date.now
    }
  },
  settings: {
    firstComment: String,
    watermark: {
      enabled: {
        type: Boolean,
        default: false
      },
      text: String,
      position: {
        type: String,
        enum: ['top-left', 'top-right', 'bottom-left', 'bottom-right'],
        default: 'bottom-right'
      }
    },
    crossPost: {
      type: Boolean,
      default: true
    }
  },
  metadata: {
    characterCount: Number,
    hashtagCount: Number,
    mentionCount: Number,
    linkCount: Number
  }
}, {
  timestamps: true
});

// Indexes for better query performance
postSchema.index({ user: 1, status: 1 });
postSchema.index({ scheduledFor: 1, status: 1 });
postSchema.index({ 'platforms.platform': 1 });
postSchema.index({ publishedAt: -1 });
postSchema.index({ tags: 1 });

// Virtual for total engagement
postSchema.virtual('totalEngagement').get(function() {
  const analytics = this.analytics;
  return (analytics.likes || 0) + (analytics.comments || 0) + (analytics.shares || 0);
});

// Virtual for engagement rate
postSchema.virtual('engagementRate').get(function() {
  const analytics = this.analytics;
  const reach = analytics.reach || 1;
  return ((this.totalEngagement / reach) * 100).toFixed(2);
});

// Pre-save middleware to update metadata
postSchema.pre('save', function(next) {
  // Update character count
  this.metadata.characterCount = this.content.length;
  
  // Count hashtags
  const hashtagMatches = this.content.match(/#\w+/g);
  this.metadata.hashtagCount = hashtagMatches ? hashtagMatches.length : 0;
  
  // Count mentions
  const mentionMatches = this.content.match(/@\w+/g);
  this.metadata.mentionCount = mentionMatches ? mentionMatches.length : 0;
  
  // Count links
  const linkMatches = this.content.match(/https?:\/\/[^\s]+/g);
  this.metadata.linkCount = linkMatches ? linkMatches.length : 0;
  
  next();
});

// Static method to get posts by status
postSchema.statics.getByStatus = function(userId, status) {
  return this.find({ user: userId, status }).sort({ createdAt: -1 });
};

// Static method to get scheduled posts
postSchema.statics.getScheduledPosts = function() {
  return this.find({
    status: 'scheduled',
    scheduledFor: { $lte: new Date() }
  }).populate('user');
};

// Instance method to update analytics
postSchema.methods.updateAnalytics = function(platform, analyticsData) {
  const platformIndex = this.platforms.findIndex(p => p.platform === platform);
  
  if (platformIndex !== -1) {
    // Update platform-specific analytics
    this.platforms[platformIndex].analytics = {
      ...this.platforms[platformIndex].analytics,
      ...analyticsData
    };
  }
  
  // Update overall analytics
  this.analytics = {
    ...this.analytics,
    ...analyticsData,
    lastUpdated: new Date()
  };
  
  return this.save();
};

// Instance method to mark as published
postSchema.methods.markAsPublished = function(platform, postId) {
  const platformIndex = this.platforms.findIndex(p => p.platform === platform);
  
  if (platformIndex !== -1) {
    this.platforms[platformIndex].status = 'published';
    this.platforms[platformIndex].postId = postId;
    this.platforms[platformIndex].publishedAt = new Date();
  }
  
  // Check if all platforms are published
  const allPublished = this.platforms.every(p => p.status === 'published');
  if (allPublished) {
    this.status = 'published';
    this.publishedAt = new Date();
  }
  
  return this.save();
};

// Ensure virtual fields are serialized
postSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    delete ret.__v;
    return ret;
  }
});

module.exports = mongoose.model('Post', postSchema); 