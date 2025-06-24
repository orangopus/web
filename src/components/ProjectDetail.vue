<template>
  <div class="project-detail">
    <div class="project-detail-header">
      <button @click="$router.go(-1)" class="back-button">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M19 12H5M12 19l-7-7 7-7"/>
        </svg>
        Back
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-state">
      <div class="loading-spinner"></div>
      <span>Loading project...</span>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="error-state">
      <div class="error-icon">⚠️</div>
      <h2>Project Not Found</h2>
      <p>{{ error }}</p>
      <button @click="$router.push('/')" class="home-button">
        Go to Home
      </button>
    </div>

    <!-- Project Content -->
    <div v-else-if="project" class="project-content">
      <div class="project-hero">
        <div class="project-image">
          <img :src="project.image_url || '/default-project.jpg'" :alt="project.title" />
        </div>
        
        <div class="project-hero-info">
          <div class="project-meta">
            <span class="project-category">{{ getCategoryName(project.category) }}</span>
            <span class="project-difficulty" :class="project.difficulty_level">
              {{ getDifficultyName(project.difficulty_level) }}
            </span>
          </div>
          
          <h1 class="project-title">{{ project.title }}</h1>
          <p class="project-description">{{ project.description }}</p>
          
          <div class="project-author">
            <img :src="project.user_avatar || '/default-avatar.jpg'" :alt="project.user_name" />
            <div class="author-info">
              <span class="author-name">{{ project.user_name || 'Anonymous' }}</span>
              <span class="project-date">{{ formatDate(project.created_at) }}</span>
            </div>
          </div>
          
          <div class="project-stats">
            <div class="stat">
              <span class="stat-icon">👁️</span>
              <span class="stat-value">{{ project.views_count || 0 }}</span>
              <span class="stat-label">Views</span>
            </div>
            <div class="stat">
              <span class="stat-icon">❤️</span>
              <span class="stat-value">{{ project.likes_count || 0 }}</span>
              <span class="stat-label">Likes</span>
            </div>
          </div>
          
          <div class="project-actions">
            <button @click="likeProject" class="like-button" :class="{ 'liked': isLiked }">
              <span>❤️</span>
              {{ isLiked ? 'Liked' : 'Like' }}
            </button>
            <a 
              v-if="project.github_url" 
              :href="project.github_url" 
              target="_blank" 
              class="github-button"
            >
              <svg class="github-icon" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              View on GitHub
            </a>
            <a 
              v-if="project.live_url" 
              :href="project.live_url" 
              target="_blank" 
              class="live-button"
            >
              <span>🚀</span>
              Live Demo
            </a>
          </div>
        </div>
      </div>
      
      <div class="project-details">
        <div class="project-technologies">
          <h3>Technologies Used</h3>
          <div class="tech-tags">
            <span 
              v-for="tech in project.technologies" 
              :key="tech" 
              class="tech-tag"
            >
              {{ tech }}
            </span>
          </div>
        </div>
        
        <div class="project-status">
          <h3>Project Status</h3>
          <span class="status-badge" :class="project.status">
            {{ getStatusName(project.status) }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { projectService, type Project } from '@/services/projectService'

export default defineComponent({
  name: 'ProjectDetail',
  props: {
    slug: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      project: null as Project | null,
      loading: true,
      error: '',
      isLiked: false
    }
  },
  mounted() {
    this.loadProject()
  },
  methods: {
    async loadProject() {
      this.loading = true
      this.error = ''
      
      try {
        const result = await projectService.getProjectBySlug(this.slug)
        
        if (result.success && result.project) {
          this.project = result.project
          // Check if user has liked this project
          await this.checkLikeStatus()
        } else {
          this.error = result.error || 'Project not found'
        }
      } catch (error) {
        console.error('Error loading project:', error)
        this.error = 'Failed to load project'
      } finally {
        this.loading = false
      }
    },
    
    async likeProject() {
      if (!this.project) return
      
      try {
        const result = await projectService.likeProject(this.project.id)
        if (result.success) {
          this.isLiked = !this.isLiked
          if (this.project) {
            this.project.likes_count = (this.project.likes_count || 0) + (this.isLiked ? 1 : -1)
          }
        }
      } catch (error) {
        console.error('Error liking project:', error)
      }
    },
    
    async checkLikeStatus() {
      if (!this.project) return
      
      try {
        const result = await projectService.checkProjectLike(this.project.id)
        if (result.success) {
          this.isLiked = result.liked || false
        }
      } catch (error) {
        console.error('Error checking like status:', error)
      }
    },
    
    getCategoryName(category: string): string {
      const categoryMap: { [key: string]: string } = {
        'web-development': 'Web Development',
        'mobile-app': 'Mobile App',
        'ai-ml': 'AI/ML',
        'game': 'Game',
        'other': 'Other'
      }
      return categoryMap[category] || category
    },
    
    getDifficultyName(difficulty: string): string {
      const difficultyMap: { [key: string]: string } = {
        'beginner': 'Beginner',
        'intermediate': 'Intermediate',
        'advanced': 'Advanced'
      }
      return difficultyMap[difficulty] || difficulty
    },
    
    getStatusName(status: string): string {
      const statusMap: { [key: string]: string } = {
        'draft': 'Draft',
        'published': 'Published',
        'archived': 'Archived'
      }
      return statusMap[status] || status
    },
    
    formatDate(dateString: string): string {
      if (!dateString) return 'Unknown date'
      try {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      } catch (error) {
        return 'Invalid date'
      }
    }
  }
})
</script>

<style scoped>
.project-detail {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
  min-height: 100vh;
}

.project-detail-header {
  margin-bottom: 40px;
}

.back-button {
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #ffffff;
  padding: 12px 20px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: "Manrope", Helvetica;
  font-size: 16px;
}

.back-button:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.3);
}

.loading-state,
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 400px;
  text-align: center;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-top: 3px solid #ff5500;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-icon {
  font-size: 48px;
  margin-bottom: 20px;
}

.error-state h2 {
  font-family: "Manrope", Helvetica;
  font-size: 24px;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 10px;
}

.error-state p {
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 30px;
}

.home-button {
  background: #ff5500;
  color: #ffffff;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  cursor: pointer;
  font-family: "Manrope", Helvetica;
  font-size: 16px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.home-button:hover {
  background: #e64a00;
}

.project-content {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.project-hero {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  align-items: start;
}

.project-image img {
  width: 100%;
  height: 400px;
  object-fit: cover;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.project-hero-info {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.project-meta {
  display: flex;
  gap: 12px;
}

.project-category,
.project-difficulty {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
}

.project-category {
  background: rgba(255, 85, 0, 0.2);
  color: #ff5500;
  border: 1px solid rgba(255, 85, 0, 0.3);
}

.project-difficulty {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.project-difficulty.beginner {
  background: rgba(76, 175, 80, 0.2);
  color: #4caf50;
  border-color: rgba(76, 175, 80, 0.3);
}

.project-difficulty.intermediate {
  background: rgba(255, 152, 0, 0.2);
  color: #ff9800;
  border-color: rgba(255, 152, 0, 0.3);
}

.project-difficulty.advanced {
  background: rgba(244, 67, 54, 0.2);
  color: #f44336;
  border-color: rgba(244, 67, 54, 0.3);
}

.project-title {
  font-family: "Manrope", Helvetica;
  font-size: 36px;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
  line-height: 1.2;
}

.project-description {
  font-family: "Manrope", Helvetica;
  font-size: 18px;
  color: rgba(255, 255, 255, 0.8);
  line-height: 1.6;
  margin: 0;
}

.project-author {
  display: flex;
  align-items: center;
  gap: 12px;
}

.project-author img {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}

.author-info {
  display: flex;
  flex-direction: column;
}

.author-name {
  font-family: "Manrope", Helvetica;
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
}

.project-date {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
}

.project-stats {
  display: flex;
  gap: 20px;
}

.stat {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.05);
  padding: 12px 16px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.stat-icon {
  font-size: 18px;
}

.stat-value {
  font-family: "Manrope", Helvetica;
  font-size: 18px;
  font-weight: 600;
  color: #ffffff;
}

.stat-label {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
}

.project-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.like-button,
.github-button,
.live-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border-radius: 8px;
  font-family: "Manrope", Helvetica;
  font-size: 16px;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s ease;
  border: 1px solid;
}

.like-button {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  border-color: rgba(255, 255, 255, 0.2);
}

.like-button:hover,
.like-button.liked {
  background: rgba(255, 85, 0, 0.2);
  color: #ff5500;
  border-color: rgba(255, 85, 0, 0.3);
}

.github-button {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  border-color: rgba(255, 255, 255, 0.2);
}

.github-button:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
}

.github-icon {
  width: 20px;
  height: 20px;
}

.live-button {
  background: #ff5500;
  color: #ffffff;
  border-color: #ff5500;
}

.live-button:hover {
  background: #e64a00;
  border-color: #e64a00;
}

.project-details {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
}

.project-technologies h3,
.project-status h3 {
  font-family: "Manrope", Helvetica;
  font-size: 20px;
  font-weight: 600;
  color: #ffffff;
  margin-bottom: 16px;
}

.tech-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tech-tag {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.status-badge {
  display: inline-block;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
}

.status-badge.draft {
  background: rgba(255, 152, 0, 0.2);
  color: #ff9800;
  border: 1px solid rgba(255, 152, 0, 0.3);
}

.status-badge.published {
  background: rgba(76, 175, 80, 0.2);
  color: #4caf50;
  border: 1px solid rgba(76, 175, 80, 0.3);
}

.status-badge.archived {
  background: rgba(158, 158, 158, 0.2);
  color: #9e9e9e;
  border: 1px solid rgba(158, 158, 158, 0.3);
}

@media (max-width: 768px) {
  .project-hero {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  
  .project-details {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  
  .project-title {
    font-size: 28px;
  }
  
  .project-actions {
    flex-direction: column;
  }
  
  .project-stats {
    flex-direction: column;
    gap: 12px;
  }
}
</style> 