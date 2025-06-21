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
              :disabled="!newPost.content.trim()"
            >
              <span>Share Project</span>
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
            <img :src="post.userAvatar" :alt="post.userName" class="post-avatar" />
            <div class="post-meta">
              <h4 class="post-author">{{ post.userName }}</h4>
              <span class="post-time">{{ formatTime(post.createdAt) }}</span>
            </div>
            <div class="post-actions">
              <button @click="likePost(post.id)" class="action-btn">
                <span class="action-icon">❤️</span>
                <span class="action-count">{{ post.likes }}</span>
              </button>
              <button @click="sharePost(post.id)" class="action-btn">
                <span class="action-icon">📤</span>
              </button>
            </div>
          </div>
          
          <div class="post-content">
            <p class="post-text">{{ post.content }}</p>
            
            <!-- GitHub Repository Link -->
            <div v-if="post.githubRepo" class="github-repo">
              <div class="repo-info">
                <h5>{{ post.githubRepo.name }}</h5>
                <p>{{ post.githubRepo.description }}</p>
                <div class="repo-stats">
                  <span>⭐ {{ post.githubRepo.stars }}</span>
                  <span>🔄 {{ post.githubRepo.forks }}</span>
                  <span class="repo-language">{{ post.githubRepo.language }}</span>
                </div>
              </div>
              <a 
                :href="post.githubRepo.url" 
                target="_blank" 
                class="repo-link"
              >
                View on GitHub
              </a>
            </div>
            
            <!-- Project Tags -->
            <div v-if="post.tags.length" class="post-tags">
              <span 
                v-for="tag in post.tags" 
                :key="tag" 
                class="tag"
              >
                #{{ tag }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Load More Button -->
      <div v-if="hasMorePosts" class="load-more">
        <button @click="loadMorePosts" class="load-more-btn">
          Load More Posts
        </button>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from "vue";

interface GitHubRepo {
  name: string;
  description: string;
  url: string;
  stars: number;
  forks: number;
  language: string;
}

interface Post {
  id: string;
  userName: string;
  userAvatar: string;
  content: string;
  createdAt: Date;
  likes: number;
  tags: string[];
  githubRepo?: GitHubRepo;
}

interface Filter {
  id: string;
  name: string;
}

export default defineComponent({
  name: "SocialFeed",
  data() {
    return {
      loading: false,
      isGitHubConnected: false,
      userName: "",
      userAvatar: "",
      userRepositories: [] as GitHubRepo[],
      newPost: {
        content: "",
        tags: [] as string[],
        githubRepo: null as GitHubRepo | null
      },
      posts: [] as Post[],
      activeFilter: "all",
      page: 1,
      hasMorePosts: true,
      filters: [
        { id: "all", name: "All Posts" },
        { id: "projects", name: "Projects" },
        { id: "questions", name: "Questions" },
        { id: "showcase", name: "Showcase" }
      ]
    };
  },
  computed: {
    filteredPosts(): Post[] {
      if (this.activeFilter === "all") {
        return this.posts;
      }
      return this.posts.filter(post => 
        post.tags.includes(this.activeFilter)
      );
    }
  },
  mounted() {
    this.observeElements();
    this.loadPosts();
    this.checkGitHubConnection();
  },
  methods: {
    observeElements() {
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      }, { threshold: 0.1 });

      document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
      });
    },
    
    async connectGitHub() {
      if (this.isGitHubConnected) return;
      
      // Simulate GitHub OAuth flow
      this.loading = true;
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      this.isGitHubConnected = true;
      this.userName = "Cheesecastv20053";
      this.userAvatar = "https://c.animaapp.com/bX3QfjDJ/img/logo.svg";
      this.loading = false;
      
      // Load user's repositories
      this.loadUserRepositories();
    },
    
    async loadUserRepositories() {
      try {
        const response = await fetch('https://api.github.com/users/orangopus/repos?sort=updated&per_page=5');
        const repos = await response.json();
        
        // Store repos for post creation
        this.userRepositories = repos.map((repo: any) => ({
          name: repo.name,
          description: repo.description || "No description",
          url: repo.html_url,
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          language: repo.language || "Unknown"
        }));
      } catch (error) {
        console.error('Error loading repositories:', error);
      }
    },
    
    async createPost() {
      if (!this.newPost.content.trim()) return;
      
      const post: Post = {
        id: Date.now().toString(),
        userName: this.userName,
        userAvatar: this.userAvatar,
        content: this.newPost.content,
        createdAt: new Date(),
        likes: 0,
        tags: this.extractTags(this.newPost.content),
        githubRepo: this.newPost.githubRepo || undefined
      };
      
      this.posts.unshift(post);
      this.newPost.content = "";
      this.newPost.githubRepo = null;
      
      // Simulate API call
      console.log('Post created:', post);
    },
    
    extractTags(content: string): string[] {
      const hashtags = content.match(/#\w+/g);
      return hashtags ? hashtags.map(tag => tag.slice(1)) : [];
    },
    
    async loadPosts() {
      this.loading = true;
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock data
      this.posts = [
        {
          id: "1",
          userName: "Ellie@orangopus",
          userAvatar: "https://c.animaapp.com/bX3QfjDJ/img/logo-1.svg",
          content: "Just finished working on a new Vue.js component library! 🎉 It's designed to make building beautiful UIs easier than ever. Check it out and let me know what you think! #vue #components #ui",
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
          likes: 15,
          tags: ["vue", "components", "ui"],
          githubRepo: {
            name: "vue-component-library",
            description: "A beautiful Vue.js component library for modern web applications",
            url: "https://github.com/orangopus/vue-component-library",
            stars: 23,
            forks: 8,
            language: "Vue"
          }
        },
        {
          id: "2",
          userName: "Jordan@orangopus",
          userAvatar: "https://c.animaapp.com/bX3QfjDJ/img/logo-2.svg",
          content: "Question for the community: What's your favorite way to handle state management in large Vue applications? I'm working on a new project and would love to hear your experiences! #vue #state-management #discussion",
          createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
          likes: 8,
          tags: ["vue", "state-management", "discussion"]
        },
        {
          id: "3",
          userName: "Rim@orangopus",
          userAvatar: "https://c.animaapp.com/bX3QfjDJ/img/logo.svg",
          content: "Showcasing my latest project: A real-time collaboration tool built with WebSockets and Vue 3! Features include live editing, user presence, and conflict resolution. #showcase #websockets #collaboration",
          createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
          likes: 32,
          tags: ["showcase", "websockets", "collaboration"],
          githubRepo: {
            name: "real-time-collab",
            description: "Real-time collaboration tool with WebSocket support",
            url: "https://github.com/orangopus/real-time-collab",
            stars: 45,
            forks: 12,
            language: "JavaScript"
          }
        }
      ];
      
      this.loading = false;
    },
    
    async loadMorePosts() {
      this.page++;
      // Simulate loading more posts
      await new Promise(resolve => setTimeout(resolve, 1000));
      this.hasMorePosts = false;
    },
    
    setActiveFilter(filterId: string) {
      this.activeFilter = filterId;
    },
    
    likePost(postId: string) {
      const post = this.posts.find(p => p.id === postId);
      if (post) {
        post.likes++;
      }
    },
    
    sharePost(postId: string) {
      // Implement share functionality
      console.log('Sharing post:', postId);
    },
    
    formatTime(date: Date): string {
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
    
    checkGitHubConnection() {
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
  line-height: 1.1;
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
</style> 