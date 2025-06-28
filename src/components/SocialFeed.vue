<template>
  <section class="social-feed">
    <div class="feed-background">
      <div class="feed-particles"></div>
    </div>
    <div class="feed-content">
      <h2 class="section-title animate-on-scroll">Community Feed</h2>
      <p class="section-description animate-on-scroll">
        Share your projects, discover amazing creations, and connect with fellow developers.
      </p>
      
      <!-- Community Stats -->
      <div class="community-stats animate-on-scroll">
        <div class="stat-item">
          <span class="stat-number">{{ stats.total_posts || 0 }}</span>
          <span class="stat-label">Posts</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">{{ stats.total_likes || 0 }}</span>
          <span class="stat-label">Likes</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">{{ stats.total_comments || 0 }}</span>
          <span class="stat-label">Comments</span>
        </div>
      </div>
      
      <!-- Post Creation Form -->
      <div class="post-form animate-on-scroll">
        <div class="form-header">
          <img 
            :src="userAvatar || 'https://c.animaapp.com/bX3QfjDJ/img/logo.svg'" 
            :alt="userName || 'User'" 
            class="user-avatar"
          />
          <div class="form-info">
            <h3>{{ userName || 'Share Your Project' }}</h3>
            <p>What are you working on?</p>
          </div>
        </div>
        <div class="form-content">
          <textarea 
            v-model="newPost.content" 
            placeholder="Describe your project, share your progress, or ask for feedback..."
            class="post-textarea"
            rows="4"
          ></textarea>
          
          <!-- Post Type Selection -->
          <div class="post-type-selector">
            <label>Post Type:</label>
            <div class="type-options">
              <button 
                v-for="type in postTypes" 
                :key="type.value"
                @click="newPost.post_type = type.value"
                class="type-btn"
                :class="{ 'active': newPost.post_type === type.value }"
              >
                {{ type.label }}
              </button>
            </div>
          </div>
          
          <!-- GitHub Repository Selection -->
          <div v-if="isGitHubConnected && userRepositories.length > 0" class="github-repo-selector">
            <label>Link GitHub Repository (Optional):</label>
            <select v-model="selectedRepoId" class="repo-select">
              <option value="">No repository</option>
              <option 
                v-for="repo in userRepositories" 
                :key="repo.name"
                :value="repo.name"
              >
                {{ repo.name }} ({{ repo.language }})
              </option>
            </select>
          </div>
          
          <div class="form-actions">
            <div class="github-integration">
              <button 
                @click="connectGitHub" 
                class="github-btn"
                :class="{ 'connected': isGitHubConnected }"
              >
                <svg class="github-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                {{ isGitHubConnected ? 'Connected' : 'Connect GitHub' }}
              </button>
            </div>
            <button 
              @click="createPost" 
              class="post-btn"
              :disabled="!newPost.content.trim() || creating"
            >
              <span v-if="!creating">Share Project</span>
              <span v-else>Creating...</span>
              <div class="btn-glow"></div>
            </button>
          </div>
        </div>
      </div>

      <!-- Feed Filters -->
      <div class="feed-filters animate-on-scroll">
        <button 
          v-for="filter in filters" 
          :key="filter.id"
          @click="setActiveFilter(filter.id)"
          class="filter-btn"
          :class="{ 'active': activeFilter === filter.id }"
        >
          {{ filter.name }}
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <span>Loading community posts...</span>
      </div>

      <!-- Posts Feed -->
      <div v-else class="posts-container">
        <div 
          v-for="post in filteredPosts" 
          :key="post.id" 
          class="post-card animate-on-scroll"
        >
          <div class="post-header">
            <img :src="post.user_avatar" :alt="post.user_name" class="post-avatar" />
            <div class="post-meta">
              <h4 class="post-author">{{ post.user_name }}</h4>
              <span class="post-time">{{ formatTime(post.created_at) }}</span>
              <span class="post-type">{{ getPostTypeLabel(post.post_type) }}</span>
            </div>
            <div class="post-actions">
              <button @click="likePost(post.id)" class="action-btn" :class="{ 'liked': post.is_liked }">
                <span class="action-icon">❤️</span>
                <span class="action-count">{{ post.likes_count }}</span>
              </button>
              <button @click="sharePost(post.id)" class="action-btn">
                <span class="action-icon">📤</span>
              </button>
            </div>
          </div>
          
          <div class="post-content">
            <p class="post-text">{{ post.content }}</p>
            
            <!-- GitHub Repository Link -->
            <div v-if="post.github_repo" class="github-repo">
              <div class="repo-info">
                <h5>{{ post.github_repo.name }}</h5>
                <p>{{ post.github_repo.description }}</p>
                <div class="repo-stats">
                  <span>⭐ {{ post.github_repo.stars }}</span>
                  <span>🔄 {{ post.github_repo.forks }}</span>
                  <span class="repo-language">{{ post.github_repo.language }}</span>
                </div>
                <div v-if="post.github_repo.topics && post.github_repo.topics.length" class="repo-topics">
                  <span 
                    v-for="topic in post.github_repo.topics.slice(0, 3)" 
                    :key="topic" 
                    class="topic-tag"
                  >
                    {{ topic }}
                  </span>
                </div>
              </div>
              <a 
                :href="post.github_repo.url" 
                target="_blank" 
                class="repo-link"
              >
                View on GitHub
              </a>
            </div>
            
            <!-- Project Tags -->
            <div v-if="post.tags && post.tags.length" class="post-tags">
              <span 
                v-for="tag in post.tags" 
                :key="tag" 
                class="tag"
                @click="filterByTag(tag)"
              >
                #{{ tag }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Load More Button -->
      <div v-if="hasMorePosts" class="load-more">
        <button @click="loadMorePosts" class="load-more-btn" :disabled="loadingMore">
          <span v-if="!loadingMore">Load More Posts</span>
          <span v-else>Loading...</span>
        </button>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { communityService, type CommunityPost, type GitHubRepo, type CreatePostData } from "@/services/communityService";
import { supabase } from "@/lib/supabase";
import "./SocialFeed.css";

interface Filter {
  id: string;
  name: string;
}

interface PostType {
  value: string;
  label: string;
}

export default defineComponent({
  name: "SocialFeed",
  data() {
    return {
      loading: false,
      loadingMore: false,
      creating: false,
      isGitHubConnected: false,
      userName: "",
      userAvatar: "",
      userRepositories: [] as GitHubRepo[],
      selectedRepoId: "",
              newPost: {
          content: "",
          post_type: "showcase" as CreatePostData['post_type'],
          tags: [] as string[],
          github_repo: null as GitHubRepo | null
        },
      posts: [] as CommunityPost[],
      activeFilter: "all",
      page: 1,
      hasMorePosts: true,
      stats: {
        total_posts: 0,
        total_likes: 0,
        total_comments: 0
      },
      filters: [
        { id: "all", name: "All Posts" },
        { id: "showcase", name: "Showcase" },
        { id: "question", name: "Questions" },
        { id: "discussion", name: "Discussions" }
      ],
      postTypes: [
        { value: "showcase", label: "Showcase" },
        { value: "question", label: "Question" },
        { value: "discussion", label: "Discussion" }
      ]
    };
  },
  computed: {
    filteredPosts(): CommunityPost[] {
      if (this.activeFilter === "all") {
        return this.posts;
      }
      return this.posts.filter(post => post.post_type === this.activeFilter);
    }
  },
  async mounted() {
    await this.loadPosts();
    await this.loadStats();
    await this.checkGitHubConnection();
  },
  methods: {
    async connectGitHub() {
      if (this.isGitHubConnected) return;
      
      this.loading = true;
      
      try {
        // For MVP, we'll use a demo GitHub connection
        // In production, this would use GitHub OAuth
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        this.isGitHubConnected = true;
        this.userName = "Cheesecastv20053";
        this.userAvatar = "https://c.animaapp.com/bX3QfjDJ/img/logo.svg";
        
        // Load user's repositories
        await this.loadUserRepositories();
      } catch (error) {
        console.error('Error connecting to GitHub:', error);
      } finally {
        this.loading = false;
      }
    },
    
    async loadUserRepositories() {
      try {
        const result = await communityService.getGitHubRepos('orangopus');
        if (result.success && result.repos) {
          this.userRepositories = result.repos;
        }
      } catch (error) {
        console.error('Error loading repositories:', error);
      }
    },
    
    async createPost() {
      if (!this.newPost.content.trim()) return;
      
      this.creating = true;
      
      try {
        // Extract tags from content
        const tags = this.extractTags(this.newPost.content);
        
        // Get selected GitHub repo
        let githubRepo = null;
        if (this.selectedRepoId && this.userRepositories.length > 0) {
          githubRepo = this.userRepositories.find(repo => repo.name === this.selectedRepoId) || null;
        }
        
        const postData = {
          content: this.newPost.content,
          post_type: this.newPost.post_type,
          tags,
          github_repo: githubRepo || undefined
        };

        const result = await communityService.createPost(postData);

        if (result.success && result.post) {
          // Add the new post to the local state
          this.posts.unshift(result.post);
          
          // Clear form
          this.newPost.content = "";
          this.newPost.post_type = "showcase";
          this.selectedRepoId = "";
          
          // Refresh stats
          await this.loadStats();
        } else {
          console.error('Error creating post:', result.error);
          // Show error to user
          alert('Failed to create post. Please try again.');
        }
      } catch (error) {
        console.error('Error creating post:', error);
        // Show error to user
        alert('Failed to create post. Please try again.');
      } finally {
        this.creating = false;
      }
    },

    createLocalPost() {
      const post: CommunityPost = {
        id: Date.now().toString(),
        user_id: "local-user",
        user_name: this.userName,
        user_avatar: this.userAvatar,
        content: this.newPost.content,
        post_type: this.newPost.post_type,
        tags: this.extractTags(this.newPost.content),
        likes_count: 0,
        comments_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        github_repo: this.newPost.github_repo || undefined
      };
      
      this.posts.unshift(post);
      console.log('Post created locally:', post);
    },
    
    extractTags(content: string): string[] {
      const hashtags = content.match(/#\w+/g);
      return hashtags ? hashtags.map(tag => tag.slice(1)) : [];
    },
    
    async loadPosts() {
      this.loading = true;
      
      try {
        const result = await communityService.getPosts({
          limit: 10,
          offset: (this.page - 1) * 10
        });

        if (result.success && result.posts) {
          if (this.page === 1) {
            this.posts = result.posts;
          } else {
            this.posts.push(...result.posts);
          }
          
          this.hasMorePosts = result.posts.length === 10;
        } else {
          console.error('Error loading posts:', result.error);
          this.posts = [];
        }
      } catch (error) {
        console.error('Error loading posts:', error);
        this.posts = [];
      } finally {
        this.loading = false;
      }
    },

    async loadStats() {
      try {
        const result = await communityService.getPostStats();
        if (result.success && result.stats) {
          this.stats = result.stats;
        }
      } catch (error) {
        console.error('Error loading stats:', error);
      }
    },

    loadMockPosts() {
      // This method is no longer needed as we're using real data
      this.posts = [];
    },
    
    async loadMorePosts() {
      this.loadingMore = true;
      this.page++;
      
      try {
        await this.loadPosts();
      } finally {
        this.loadingMore = false;
      }
    },
    
    setActiveFilter(filterId: string) {
      this.activeFilter = filterId;
    },
    
    filterByTag(tag: string) {
      // For now, just highlight the tag
      // In a full implementation, this would filter posts
      console.log('Filtering by tag:', tag);
    },
    
    async likePost(postId: string) {
      try {
        const result = await communityService.likePost(postId);
        
        if (result.success) {
          // Update local state
          const post = this.posts.find(p => p.id === postId);
          if (post) {
            post.is_liked = !post.is_liked;
            post.likes_count += post.is_liked ? 1 : -1;
          }
        } else {
          console.error('Error liking post:', result.error);
        }
      } catch (error) {
        console.error('Error liking post:', error);
      }
    },
    
    sharePost(postId: string) {
      // Implement share functionality
      const post = this.posts.find(p => p.id === postId);
      if (post) {
        const url = `${window.location.origin}/community/post/${postId}`;
        navigator.clipboard.writeText(url);
        // Show notification
        console.log('Post URL copied to clipboard');
      }
    },
    
    formatTime(dateString: string): string {
      const date = new Date(dateString);
      const now = new Date();
      const diff = now.getTime() - date.getTime();
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const days = Math.floor(hours / 24);
      
      if (days > 0) {
        return `${days} day${days > 1 ? 's' : ''} ago`;
      } else if (hours > 0) {
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
      } else {
        return 'Just now';
      }
    },
    
    getPostTypeLabel(type: string): string {
      const postType = this.postTypes.find(t => t.value === type);
      return postType ? postType.label : type;
    },
    
    async checkGitHubConnection() {
      // Check if user is already connected to GitHub
      // This would typically check localStorage or a backend session
      this.isGitHubConnected = false;
    }
  }
});
</script>

<style scoped>
.social-feed {
  padding: 120px 40px;
  position: relative;
  overflow: hidden;
  min-height: 100vh;
}

.feed-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
}

.feed-particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: 
    radial-gradient(1px 1px at 20% 30%, rgba(255, 85, 0, 0.2), transparent),
    radial-gradient(1px 1px at 60% 70%, rgba(255, 255, 255, 0.1), transparent),
    radial-gradient(2px 2px at 80% 20%, rgba(255, 85, 0, 0.15), transparent);
  background-size: 300px 300px, 200px 200px, 400px 400px;
  animation: feed-float 25s ease-in-out infinite;
}

@keyframes feed-float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  33% { transform: translateY(-15px) rotate(0.5deg); }
  66% { transform: translateY(10px) rotate(-0.5deg); }
}

.feed-content {
  position: relative;
  z-index: 1;
  max-width: 800px;
  margin: 0 auto;
}

.section-title {
  color: #ffffff;
  font-family: "Manrope", Helvetica;
  font-size: clamp(48px, 6vw, 72px);
  font-weight: 700;
  letter-spacing: -2px;
  line-height: 1.3;
  text-align: center;
  margin: 0 0 20px 0;
  background: linear-gradient(135deg, #ffffff 0%, #ff5500 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s ease;
}

.section-title.animate-in {
  opacity: 1;
  transform: translateY(0);
}

.section-description {
  color: rgba(255, 255, 255, 0.7);
  font-family: "Manrope", Helvetica;
  font-size: clamp(18px, 2.5vw, 24px);
  font-weight: 400;
  text-align: center;
  margin: 0 0 60px 0;
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s ease 0.2s;
}

.section-description.animate-in {
  opacity: 1;
  transform: translateY(0);
}

.post-form {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 30px;
  margin-bottom: 40px;
  backdrop-filter: blur(20px);
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s ease 0.4s;
}

.post-form.animate-in {
  opacity: 1;
  transform: translateY(0);
}

.form-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
}

.user-avatar {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 2px solid rgba(255, 85, 0, 0.3);
}

.form-info h3 {
  color: #ffffff;
  font-family: "Manrope", Helvetica;
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}

.form-info p {
  color: rgba(255, 255, 255, 0.6);
  font-family: "Manrope", Helvetica;
  font-size: 14px;
  margin: 0;
}

.post-textarea {
  width: 100%;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 20px;
  color: #ffffff;
  font-family: "Manrope", Helvetica;
  font-size: 16px;
  resize: vertical;
  margin-bottom: 20px;
  transition: all 0.3s ease;
}

.post-textarea:focus {
  outline: none;
  border-color: rgba(255, 85, 0, 0.5);
  background: rgba(255, 255, 255, 0.15);
}

.post-textarea::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.form-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.github-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 12px 20px;
  color: #ffffff;
  font-family: "Manrope", Helvetica;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.github-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
}

.github-btn.connected {
  background: rgba(255, 85, 0, 0.2);
  border-color: rgba(255, 85, 0, 0.4);
  color: #ff5500;
}

.github-icon {
  width: 16px;
  height: 16px;
}

.post-btn {
  position: relative;
  background: linear-gradient(135deg, #ff5500 0%, #ff7a00 100%);
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  color: #ffffff;
  font-family: "Manrope", Helvetica;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;
}

.post-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.post-btn:not(:disabled):hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(255, 85, 0, 0.3);
}

.btn-glow {
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
  transition: left 0.5s ease;
}

.post-btn:hover .btn-glow {
  left: 100%;
}

.feed-filters {
  display: flex;
  gap: 15px;
  margin-bottom: 40px;
  flex-wrap: wrap;
  justify-content: center;
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s ease 0.6s;
}

.feed-filters.animate-in {
  opacity: 1;
  transform: translateY(0);
}

.filter-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 25px;
  padding: 10px 20px;
  color: rgba(255, 255, 255, 0.7);
  font-family: "Manrope", Helvetica;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  color: #ffffff;
}

.filter-btn.active {
  background: rgba(255, 85, 0, 0.2);
  border-color: rgba(255, 85, 0, 0.4);
  color: #ff5500;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  color: rgba(255, 255, 255, 0.7);
  font-family: "Manrope", Helvetica;
  font-size: 16px;
  padding: 60px 0;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 255, 255, 0.2);
  border-top: 3px solid #ff5500;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.posts-container {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.post-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 25px;
  backdrop-filter: blur(20px);
  transition: all 0.3s ease;
  opacity: 0;
  transform: translateY(30px);
  animation: postAppear 0.6s ease-out forwards;
}

.post-card:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 85, 0, 0.2);
  transform: translateY(-2px);
  box-shadow: 0 10px 30px rgba(255, 85, 0, 0.1);
}

@keyframes postAppear {
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.post-header {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-bottom: 20px;
}

.post-avatar {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  border: 2px solid rgba(255, 85, 0, 0.3);
}

.post-meta {
  flex: 1;
}

.post-author {
  color: #ffffff;
  font-family: "Manrope", Helvetica;
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 5px 0;
}

.post-time {
  color: rgba(255, 255, 255, 0.5);
  font-family: "Manrope", Helvetica;
  font-size: 14px;
}

.post-actions {
  display: flex;
  gap: 15px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 5px;
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  font-family: "Manrope", Helvetica;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  padding: 8px 12px;
  border-radius: 8px;
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
}

.action-icon {
  font-size: 16px;
}

.post-content {
  color: rgba(255, 255, 255, 0.9);
  font-family: "Manrope", Helvetica;
  font-size: 16px;
  line-height: 1.6;
}

.post-text {
  margin: 0 0 20px 0;
}

.github-repo {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}

.repo-info h5 {
  color: #ffffff;
  font-family: "Manrope", Helvetica;
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 8px 0;
}

.repo-info p {
  color: rgba(255, 255, 255, 0.7);
  font-family: "Manrope", Helvetica;
  font-size: 14px;
  margin: 0 0 12px 0;
  line-height: 1.4;
}

.repo-stats {
  display: flex;
  gap: 15px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
}

.repo-language {
  background: rgba(255, 85, 0, 0.2);
  color: #ff5500;
  padding: 2px 8px;
  border-radius: 4px;
  font-weight: 500;
}

.repo-link {
  background: linear-gradient(135deg, #ff5500 0%, #ff7a00 100%);
  color: #ffffff;
  text-decoration: none;
  padding: 10px 20px;
  border-radius: 8px;
  font-family: "Manrope", Helvetica;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
  white-space: nowrap;
}

.repo-link:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(255, 85, 0, 0.3);
}

.post-tags {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.tag {
  background: rgba(255, 85, 0, 0.2);
  color: #ff5500;
  padding: 4px 12px;
  border-radius: 15px;
  font-family: "Manrope", Helvetica;
  font-size: 12px;
  font-weight: 500;
}

.load-more {
  display: flex;
  justify-content: center;
  margin-top: 40px;
}

.load-more-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 15px 30px;
  color: #ffffff;
  font-family: "Manrope", Helvetica;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.load-more-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .social-feed {
    padding: 80px 20px;
  }
  
  .post-form {
    padding: 20px;
  }
  
  .form-actions {
    flex-direction: column;
    gap: 15px;
    align-items: stretch;
  }
  
  .github-repo {
    flex-direction: column;
    align-items: stretch;
  }
  
  .repo-link {
    text-align: center;
  }
  
  .post-actions {
    gap: 10px;
  }
  
  .action-btn {
    padding: 6px 10px;
  }
}

/* Light theme styles */
.light-theme .social-feed {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 50%, #f8f9fa 100%);
  color: #212529;
}

.light-theme .section-title {
  color: #212529;
}

.light-theme .section-description {
  color: rgba(0, 0, 0, 0.7);
}

.light-theme .post-form {
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
}

.light-theme .form-info h3 {
  color: #212529;
}

.light-theme .form-info p {
  color: rgba(0, 0, 0, 0.7);
}

.light-theme .post-textarea {
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(0, 0, 0, 0.2);
  color: #212529;
}

.light-theme .post-textarea:focus {
  background: rgba(255, 255, 255, 1);
  border-color: #ff5500;
}

.light-theme .post-textarea::placeholder {
  color: rgba(0, 0, 0, 0.5);
}

.light-theme .github-btn {
  background: rgba(0, 0, 0, 0.1);
  color: #212529;
  border: 1px solid rgba(0, 0, 0, 0.2);
}

.light-theme .github-btn:hover {
  background: rgba(0, 0, 0, 0.2);
}

.light-theme .github-btn.connected {
  background: #ff5500;
  color: #ffffff;
  border-color: #ff5500;
}

.light-theme .post-btn {
  background: #ff5500;
  color: #ffffff;
  border-color: #ff5500;
}

.light-theme .post-btn:hover {
  background: #e64a00;
  border-color: #e64a00;
}

.light-theme .filter-btn {
  background: rgba(255, 255, 255, 0.8);
  color: #212529;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.light-theme .filter-btn:hover {
  background: rgba(255, 255, 255, 1);
  border-color: rgba(255, 85, 0, 0.3);
}

.light-theme .filter-btn.active {
  background: #ff5500;
  color: #ffffff;
  border-color: #ff5500;
}

.light-theme .post-card {
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.light-theme .post-card:hover {
  background: rgba(255, 255, 255, 1);
  border-color: rgba(255, 85, 0, 0.3);
  box-shadow: 0 8px 30px rgba(255, 85, 0, 0.2);
}

.light-theme .post-author {
  color: #212529;
}

.light-theme .post-time {
  color: rgba(0, 0, 0, 0.6);
}

.light-theme .post-text {
  color: #212529;
}

.light-theme .github-repo {
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.light-theme .github-repo h5 {
  color: #212529;
}

.light-theme .github-repo p {
  color: rgba(0, 0, 0, 0.7);
}

.light-theme .repo-stats span {
  color: rgba(0, 0, 0, 0.7);
}

.light-theme .repo-language {
  color: #ff5500;
}

.light-theme .repo-link {
  background: #ff5500;
  color: #ffffff;
  border-color: #ff5500;
}

.light-theme .repo-link:hover {
  background: #e64a00;
  border-color: #e64a00;
}

.light-theme .tag {
  background: rgba(255, 85, 0, 0.1);
  color: #ff5500;
  border: 1px solid rgba(255, 85, 0, 0.2);
}

.light-theme .load-more-btn {
  background: rgba(255, 255, 255, 0.8);
  color: #212529;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.light-theme .load-more-btn:hover {
  background: rgba(255, 255, 255, 1);
  border-color: rgba(255, 85, 0, 0.3);
}
</style> 