# Tupae - Social Media Management Platform

A comprehensive social media management platform built with React frontend and Node.js backend, designed to help businesses and individuals manage their social media presence across multiple platforms.

## Features

### 🚀 Core Features
- **Multi-Platform Management**: Support for Facebook, Instagram, Twitter, LinkedIn, YouTube, and TikTok
- **Content Creation & Scheduling**: Create, edit, and schedule posts across multiple platforms
- **Media Management**: Upload and manage images, videos, and GIFs with Cloudinary integration
- **Analytics Dashboard**: Comprehensive analytics and insights for all connected accounts
- **User Management**: Secure authentication and user profile management
- **Real-time Notifications**: Stay updated with post status and engagement metrics

### 📊 Analytics & Insights
- **Performance Metrics**: Track impressions, reach, engagement, and follower growth
- **Demographics Analysis**: Understand your audience with detailed demographic data
- **Best Posting Times**: AI-powered recommendations for optimal posting schedules
- **Hashtag Performance**: Analyze hashtag effectiveness and trends
- **Export Capabilities**: Export analytics data in multiple formats

### 🔐 Security & Authentication
- **JWT Authentication**: Secure token-based authentication
- **Password Security**: Bcrypt hashing with account lockout protection
- **Rate Limiting**: API protection against abuse
- **CORS Configuration**: Secure cross-origin resource sharing

## Tech Stack

### Frontend
- **React 18** with Vite
- **Tailwind CSS** for styling
- **React Router** for navigation
- **Chart.js** for analytics visualization
- **React Icons** for UI icons
- **React Dropzone** for file uploads

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Cloudinary** for media storage
- **Multer** for file uploads
- **Express Validator** for input validation
- **Helmet** for security headers

## Prerequisites

Before running this application, make sure you have the following installed:

- **Node.js** (v16 or higher)
- **MongoDB** (v4.4 or higher)
- **npm** or **yarn**

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd tupae
```

### 2. Install Backend Dependencies

```bash
npm install
```

### 3. Install Frontend Dependencies

```bash
cd client
npm install
cd ..
```

### 4. Environment Configuration

Create a `.env` file in the root directory:

```bash
cp env.example .env
```

Update the `.env` file with your configuration:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database Configuration
MONGODB_URI=mongodb://localhost:27017/tupae

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Cloudinary Configuration (for media uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Social Media Platform API Keys (optional for development)
FACEBOOK_CLIENT_ID=your-facebook-client-id
FACEBOOK_CLIENT_SECRET=your-facebook-client-secret

INSTAGRAM_CLIENT_ID=your-instagram-client-id
INSTAGRAM_CLIENT_SECRET=your-instagram-client-secret

TWITTER_CLIENT_ID=your-twitter-client-id
TWITTER_CLIENT_SECRET=your-twitter-client-secret

LINKEDIN_CLIENT_ID=your-linkedin-client-id
LINKEDIN_CLIENT_SECRET=your-linkedin-client-secret

YOUTUBE_CLIENT_ID=your-youtube-client-id
YOUTUBE_CLIENT_SECRET=your-youtube-client-secret

TIKTOK_CLIENT_ID=your-tiktok-client-id
TIKTOK_CLIENT_SECRET=your-tiktok-client-secret

# Email Configuration (optional for development)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-email-password

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### 5. Start MongoDB

Make sure MongoDB is running on your system:

```bash
# On macOS with Homebrew
brew services start mongodb-community

# On Ubuntu/Debian
sudo systemctl start mongod

# On Windows
net start MongoDB
```

### 6. Run the Application

#### Development Mode

Start the backend server:
```bash
npm run dev
```

In a new terminal, start the frontend:
```bash
cd client
npm run dev
```

#### Production Mode

Build the frontend:
```bash
cd client
npm run build
cd ..
```

Start the production server:
```bash
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password

### Users
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `POST /api/users/profile-image` - Upload profile image
- `PUT /api/users/preferences` - Update user preferences
- `GET /api/users/stats` - Get user statistics

### Posts
- `POST /api/posts` - Create a new post
- `GET /api/posts` - Get all posts
- `GET /api/posts/:id` - Get specific post
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post
- `POST /api/posts/:id/publish` - Publish post
- `POST /api/posts/:id/schedule` - Schedule post
- `POST /api/posts/:id/media` - Upload media for post

### Analytics
- `GET /api/analytics/overview` - Get analytics overview
- `GET /api/analytics/platform/:platform` - Get platform-specific analytics
- `GET /api/analytics/posts` - Get post analytics
- `GET /api/analytics/engagement` - Get engagement analytics
- `GET /api/analytics/demographics` - Get demographics data
- `GET /api/analytics/best-times` - Get best posting times
- `GET /api/analytics/hashtags` - Get hashtag performance
- `POST /api/analytics/sync` - Sync analytics data

### Social Media
- `GET /api/social-media/platforms` - Get available platforms
- `GET /api/social-media/accounts` - Get connected accounts
- `POST /api/social-media/connect/:platform` - Connect platform
- `GET /api/social-media/:platform/analytics` - Get platform analytics
- `GET /api/social-media/:platform/insights` - Get platform insights

## Database Schema

### User Model
- Basic info (name, email, password)
- Social media accounts
- Preferences and settings
- Subscription details
- Security settings

### Post Model
- Content and media
- Platform targeting
- Scheduling information
- Analytics data
- Status tracking

### Analytics Model
- Platform-specific metrics
- Demographics data
- Engagement tracking
- Historical data

## Deployment

### Backend Deployment

1. **Environment Variables**: Set all required environment variables
2. **Database**: Set up MongoDB connection
3. **Media Storage**: Configure Cloudinary
4. **Domain**: Update CORS settings with your domain

### Frontend Deployment

1. **Build**: Run `npm run build` in the client directory
2. **Static Hosting**: Deploy the `dist` folder to your hosting service
3. **Environment**: Set `VITE_API_URL` to your backend URL

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the development team or create an issue in the repository.

## Roadmap

- [ ] Real-time social media API integrations
- [ ] Advanced analytics and reporting
- [ ] Team collaboration features
- [ ] Mobile application
- [ ] AI-powered content suggestions
- [ ] Advanced scheduling algorithms
- [ ] White-label solutions
- [ ] API rate limit management
- [ ] Bulk content operations
- [ ] Advanced media editing tools
