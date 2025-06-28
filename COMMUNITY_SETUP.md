# Community Feed Setup Guide

This guide will help you set up the dynamic community feed with GitHub integration and real-time functionality.

## 🚀 Quick Start

### 1. Database Setup

First, set up the community database schema in Supabase:

```bash
# Make the setup script executable
chmod +x setup-community-db.sh

# Run the database setup
./setup-community-db.sh
```

### 2. Test Database Connection

Verify that everything is working:

```bash
# Test the database connection
node test-community-connection.js
```

### 3. Start Development Server

```bash
npm run dev
```

## 📋 What's Included

### Database Tables
- **community_posts**: Stores all community posts with GitHub repo links
- **post_likes**: Tracks user likes for posts
- **post_comments**: Stores comments on posts (ready for future use)

### Features
- ✅ Real-time post creation and display
- ✅ GitHub repository integration
- ✅ Post types (showcase, question, discussion)
- ✅ Like/unlike functionality
- ✅ Community statistics
- ✅ Tag-based filtering
- ✅ Responsive design
- ✅ Light/dark theme support

### API Endpoints
- `GET /community_posts` - Get posts with filtering and pagination
- `POST /community_posts` - Create new posts
- `POST /post_likes` - Like/unlike posts
- `GET /post_stats` - Get community statistics

## 🔧 Configuration

### Environment Variables

Make sure your `.env` file includes:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### GitHub Integration

The community feed includes GitHub repository integration:

1. **Connect GitHub**: Users can connect their GitHub account
2. **Repository Selection**: When creating posts, users can link GitHub repos
3. **Repository Display**: Posts show repo info including stars, forks, and topics

## 🎯 Usage

### Creating Posts

1. Navigate to the community feed
2. Fill in the post content
3. Select post type (showcase, question, discussion)
4. Optionally connect GitHub and select a repository
5. Click "Share Project"

### Interacting with Posts

- **Like/Unlike**: Click the heart icon
- **Share**: Click the share icon to copy post URL
- **Filter**: Use the filter buttons to view specific post types
- **Tags**: Click on tags to filter by topic

### Community Stats

The feed displays real-time statistics:
- Total posts
- Total likes
- Total comments

## 🐛 Troubleshooting

### Database Connection Issues

If you see database errors:

1. **Check environment variables**:
   ```bash
   echo $VITE_SUPABASE_URL
   echo $VITE_SUPABASE_ANON_KEY
   ```

2. **Verify database setup**:
   ```bash
   node test-community-connection.js
   ```

3. **Re-run database setup**:
   ```bash
   ./setup-community-db.sh
   ```

### GitHub API Issues

If GitHub integration isn't working:

1. Check browser console for CORS errors
2. Verify GitHub API rate limits
3. Ensure the GitHub username is correct

### Post Creation Issues

If posts aren't being created:

1. Check user authentication
2. Verify RLS policies are correct
3. Check browser console for errors

## 🔮 Future Enhancements

The community system is designed to be extensible:

- **Comments**: Full comment system with threading
- **Notifications**: Real-time notifications for likes and comments
- **User Profiles**: Enhanced user profiles with activity history
- **Moderation**: Admin tools for content moderation
- **Analytics**: Detailed community analytics and insights

## 📚 API Reference

### CommunityService Methods

```typescript
// Create a new post
await communityService.createPost({
  content: "Post content",
  post_type: "showcase",
  tags: ["vue", "typescript"],
  github_repo: { /* repo data */ }
});

// Get posts with filters
await communityService.getPosts({
  post_type: "showcase",
  limit: 10,
  offset: 0
});

// Like/unlike a post
await communityService.likePost(postId);

// Get GitHub repositories
await communityService.getGitHubRepos(username);

// Get community statistics
await communityService.getPostStats();
```

## 🎨 Customization

### Styling

The community feed uses a separate CSS file (`SocialFeed.css`) for easy customization:

- Modify colors in the CSS variables
- Adjust spacing and typography
- Add custom animations

### Components

The main components are:
- `SocialFeed.vue` - Main community feed component
- `communityService.ts` - API service layer
- `SocialFeed.css` - Styling

## 📞 Support

If you encounter issues:

1. Check the browser console for errors
2. Verify database connectivity
3. Test with the provided test script
4. Check Supabase logs for backend errors

---

**Happy coding! 🚀** 