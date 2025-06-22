<template>
  <div class="dashboard">
    <div class="dashboard-header">
      <h1>Dashboard</h1>
      <p>Welcome back, {{ user?.name || 'Developer' }}! Here's what's happening with your projects.</p>
    </div>

    <!-- Stats Overview -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">📊</div>
        <div class="stat-content">
          <div class="stat-number">{{ stats.totalProjects }}</div>
          <div class="stat-label">Total Projects</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">🚀</div>
        <div class="stat-content">
          <div class="stat-number">{{ stats.publishedProjects }}</div>
          <div class="stat-label">Published</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">👁️</div>
        <div class="stat-content">
          <div class="stat-number">{{ stats.totalViews }}</div>
          <div class="stat-label">Total Views</div>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-icon">❤️</div>
        <div class="stat-content">
          <div class="stat-number">{{ stats.totalLikes }}</div>
          <div class="stat-label">Total Likes</div>
        </div>
      </div>
    </div>

    <!-- Quick Actions -->
    <div class="quick-actions">
      <h2>Quick Actions</h2>
      <div class="actions-grid">
        <button @click="showCreateProject = true" class="action-card">
          <div class="action-icon">➕</div>
          <h3>Create New Project</h3>
          <p>Start building something amazing</p>
        </button>
        
        <button @click="showImportProject = true" class="action-card">
          <div class="action-icon">📥</div>
          <h3>Import from GitHub</h3>
          <p>Connect your existing repositories</p>
        </button>
        
        <button @click="navigateToProfile" class="action-card">
          <div class="action-icon">👤</div>
          <h3>Edit Profile</h3>
          <p>Update your information</p>
        </button>
        
        <button @click="navigateToCommunity" class="action-card">
          <div class="action-icon">🤝</div>
          <h3>Join Community</h3>
          <p>Connect with other developers</p>
        </button>
      </div>
    </div>

    <!-- Recent Projects -->
    <div class="recent-projects">
      <div class="section-header">
        <h2>Recent Projects</h2>
        <button @click="navigateToProjects" class="view-all-button">
          View All
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M5 12h14M12 5l7 7-7 7"/>
          </svg>
        </button>
      </div>
      
      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>Loading your projects...</p>
      </div>
      
      <div v-else-if="projects.length === 0" class="empty-state">
        <div class="empty-icon">📁</div>
        <h3>No projects yet</h3>
        <p>Start by creating your first project</p>
        <button @click="showCreateProject = true" class="create-button">
          Create Your First Project
        </button>
      </div>
      
      <div v-else class="projects-grid">
        <div 
          v-for="project in projects.slice(0, 6)" 
          :key="project.id" 
          class="project-card"
          @click="viewProject(project.id)"
        >
          <div class="project-image">
            <img :src="project.image_url" :alt="project.title" />
            <div class="project-status" :class="project.status">
              {{ project.status }}
            </div>
          </div>
          
          <div class="project-info">
            <h3>{{ project.title }}</h3>
            <p>{{ project.description }}</p>
            
            <div class="project-meta">
              <div class="project-stats">
                <span class="stat">👁️ {{ project.views }}</span>
                <span class="stat">❤️ {{ project.likes }}</span>
              </div>
              <div class="project-category">{{ project.category }}</div>
            </div>
            
            <div class="project-technologies">
              <span 
                v-for="tech in (project.technologies || []).slice(0, 3)" 
                :key="tech" 
                class="tech-tag"
              >
                {{ tech }}
              </span>
              <span v-if="(project.technologies || []).length > 3" class="tech-tag more">
                +{{ (project.technologies || []).length - 3 }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Activity Feed -->
    <div class="activity-feed">
      <h2>Recent Activity</h2>
      
      <div v-if="activities.length === 0" class="empty-activity">
        <p>No recent activity</p>
      </div>
      
      <div v-else class="activity-list">
        <div 
          v-for="activity in activities" 
          :key="activity.id" 
          class="activity-item"
        >
          <div class="activity-icon" :class="activity.type">
            {{ getActivityIcon(activity.type) }}
          </div>
          <div class="activity-content">
            <p>{{ activity.message }}</p>
            <span class="activity-time">{{ formatTime(activity.created_at) }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Create Project Modal -->
    <div v-if="showCreateProject" class="modal-overlay" @click="showCreateProject = false">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3>Create New Project</h3>
          <button @click="showCreateProject = false" class="close-button">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>
        
        <form @submit.prevent="createProject" class="project-form">
          <div class="form-group">
            <label for="title">Project Title</label>
            <input
              id="title"
              v-model="newProject.title"
              type="text"
              required
              placeholder="Enter project title"
            />
          </div>
          
          <div class="form-group">
            <label for="description">Description</label>
            <textarea
              id="description"
              v-model="newProject.description"
              required
              placeholder="Describe your project..."
              rows="3"
            ></textarea>
          </div>
          
          <div class="form-group">
            <label for="category">Category</label>
            <select id="category" v-model="newProject.category" required>
              <option value="">Select category</option>
              <option v-for="category in categories" :key="category" :value="category">
                {{ category }}
              </option>
            </select>
          </div>
          
          <div class="form-group">
            <label for="technologies">Technologies (comma-separated)</label>
            <input
              id="technologies"
              v-model="technologiesInput"
              type="text"
              placeholder="React, TypeScript, Node.js"
            />
          </div>
          
          <div class="form-group">
            <label for="image_url">Project Image URL</label>
            <input
              id="image_url"
              v-model="newProject.image_url"
              type="url"
              placeholder="https://example.com/image.jpg"
            />
          </div>
          
          <div class="form-group">
            <label for="github_url">GitHub URL (optional)</label>
            <input
              id="github_url"
              v-model="newProject.github_url"
              type="url"
              placeholder="https://github.com/username/repo"
            />
          </div>
          
          <div class="form-group">
            <label for="live_url">Live Demo URL (optional)</label>
            <input
              id="live_url"
              v-model="newProject.live_url"
              type="url"
              placeholder="https://your-app.com"
            />
          </div>
          
          <div class="form-actions">
            <button type="button" @click="showCreateProject = false" class="cancel-button">
              Cancel
            </button>
            <button type="submit" class="create-button" :disabled="creating">
              <span v-if="creating" class="loading-spinner"></span>
              {{ creating ? 'Creating...' : 'Create Project' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { authService, AuthState, User } from "@/services/authService";
import { projectService, Project } from "@/services/projectService";

interface DashboardStats {
  totalProjects: number;
  publishedProjects: number;
  totalViews: number;
  totalLikes: number;
}

interface Activity {
  id: string;
  type: 'project_created' | 'project_updated' | 'project_published' | 'project_liked';
  message: string;
  created_at: string;
}

interface NewProject {
  title: string;
  description: string;
  category: string;
  technologies: string[];
  image_url: string;
  github_url?: string;
  live_url?: string;
}

export default defineComponent({
  name: "Dashboard",
  data() {
    return {
      authState: {
        user: null,
        loading: false,
        error: null
      } as AuthState,
      projects: [] as Project[],
      activities: [] as Activity[],
      stats: {
        totalProjects: 0,
        publishedProjects: 0,
        totalViews: 0,
        totalLikes: 0
      } as DashboardStats,
      loading: false,
      showCreateProject: false,
      showImportProject: false,
      creating: false,
      newProject: {
        title: '',
        description: '',
        category: '',
        technologies: [],
        image_url: '',
        github_url: '',
        live_url: ''
      } as NewProject,
      technologiesInput: '',
      unsubscribe: () => {}
    };
  },
  computed: {
    user(): User | null {
      return this.authState.user;
    },
    categories(): string[] {
      return projectService.getProjectCategories();
    }
  },
  mounted() {
    this.unsubscribe = authService.subscribe((state) => {
      this.authState = state;
      if (state.user) {
        this.loadDashboardData();
      }
    });
  },
  beforeUnmount() {
    this.unsubscribe();
  },
  methods: {
    async loadDashboardData() {
      this.loading = true;
      
      try {
        // Load user projects
        const projectsResult = await projectService.getUserProjects();
        if (projectsResult.success && projectsResult.projects) {
          this.projects = projectsResult.projects;
          this.calculateStats();
        }
        
        // Load activities (mock data for now)
        this.loadActivities();
      } catch (error) {
        console.error('Error loading dashboard data:', error);
      } finally {
        this.loading = false;
      }
    },
    
    calculateStats() {
      this.stats = {
        totalProjects: this.projects.length,
        publishedProjects: this.projects.filter(p => p.status === 'published').length,
        totalViews: this.projects.reduce((sum, p) => sum + (p.views || 0), 0),
        totalLikes: this.projects.reduce((sum, p) => sum + (p.likes || 0), 0)
      };
    },
    
    loadActivities() {
      // Mock activities - in a real app, this would come from the database
      this.activities = [
        {
          id: '1',
          type: 'project_created',
          message: 'Created new project "Amazing Web App"',
          created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '2',
          type: 'project_published',
          message: 'Published project "Mobile Game"',
          created_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
        },
        {
          id: '3',
          type: 'project_liked',
          message: 'Your project "AI Chatbot" received 5 new likes',
          created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
        }
      ];
    },
    
    async createProject() {
      this.creating = true;
      
      try {
        // Parse technologies
        const technologies = this.technologiesInput
          .split(',')
          .map(tech => tech.trim())
          .filter(tech => tech.length > 0);
        
        const projectData = {
          ...this.newProject,
          technologies
        };
        
        const result = await projectService.createProject(projectData);
        
        if (result.success) {
          this.showCreateProject = false;
          this.resetNewProject();
          await this.loadDashboardData();
          this.$emit('project-created', result.project);
        } else {
          console.error('Error creating project:', result.error);
        }
      } catch (error) {
        console.error('Error creating project:', error);
      } finally {
        this.creating = false;
      }
    },
    
    resetNewProject() {
      this.newProject = {
        title: '',
        description: '',
        category: '',
        technologies: [],
        image_url: '',
        github_url: '',
        live_url: ''
      };
      this.technologiesInput = '';
    },
    
    viewProject(projectId: string) {
      // Navigate to project detail page
      console.log('View project:', projectId);
    },
    
    navigateToProjects() {
      // Navigate to projects page
      console.log('Navigate to projects');
    },
    
    navigateToProfile() {
      // Navigate to profile page
      console.log('Navigate to profile');
    },
    
    navigateToCommunity() {
      // Navigate to community page
      console.log('Navigate to community');
    },
    
    getActivityIcon(type: string): string {
      const icons: { [key: string]: string } = {
        project_created: '➕',
        project_updated: '✏️',
        project_published: '🚀',
        project_liked: '❤️'
      };
      return icons[type] || '📝';
    },
    
    formatTime(dateString: string): string {
      const date = new Date(dateString);
      const now = new Date();
      const diff = now.getTime() - date.getTime();
      
      const minutes = Math.floor(diff / (1000 * 60));
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      
      if (minutes < 60) {
        return `${minutes}m ago`;
      } else if (hours < 24) {
        return `${hours}h ago`;
      } else {
        return `${days}d ago`;
      }
    }
  }
});
</script>

<style scoped>
.dashboard {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}

.dashboard-header {
  margin-bottom: 40px;
}

.dashboard-header h1 {
  font-family: "Manrope", Helvetica;
  font-size: 36px;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 8px 0;
}

.dashboard-header p {
  font-family: "Manrope", Helvetica;
  font-size: 16px;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 24px;
  margin-bottom: 40px;
}

.stat-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 24px;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: all 0.3s ease;
}

.stat-card:hover {
  border-color: rgba(255, 85, 0, 0.3);
  transform: translateY(-2px);
}

.stat-icon {
  font-size: 32px;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #ff5500 0%, #ff7a00 100%);
  border-radius: 12px;
}

.stat-content {
  flex: 1;
}

.stat-number {
  font-family: "Manrope", Helvetica;
  font-size: 32px;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 4px 0;
}

.stat-label {
  font-family: "Manrope", Helvetica;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
}

.quick-actions {
  margin-bottom: 40px;
}

.quick-actions h2 {
  font-family: "Manrope", Helvetica;
  font-size: 24px;
  font-weight: 600;
  color: #ffffff;
  margin: 0 0 24px 0;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
}

.action-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 24px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  border: none;
  color: inherit;
}

.action-card:hover {
  border-color: rgba(255, 85, 0, 0.3);
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.3);
}

.action-icon {
  font-size: 32px;
  margin-bottom: 16px;
}

.action-card h3 {
  font-family: "Manrope", Helvetica;
  font-size: 18px;
  font-weight: 600;
  color: #ffffff;
  margin: 0 0 8px 0;
}

.action-card p {
  font-family: "Manrope", Helvetica;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
}

.recent-projects {
  margin-bottom: 40px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.section-header h2 {
  font-family: "Manrope", Helvetica;
  font-size: 24px;
  font-weight: 600;
  color: #ffffff;
  margin: 0;
}

.view-all-button {
  background: none;
  border: none;
  color: #ff5500;
  font-family: "Manrope", Helvetica;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: color 0.3s ease;
}

.view-all-button:hover {
  color: #ff7a00;
}

.view-all-button svg {
  width: 16px;
  height: 16px;
}

.loading-state {
  text-align: center;
  padding: 60px 20px;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top: 3px solid #ff5500;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 16px;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.empty-state h3 {
  font-family: "Manrope", Helvetica;
  font-size: 20px;
  font-weight: 600;
  color: #ffffff;
  margin: 0 0 8px 0;
}

.empty-state p {
  font-family: "Manrope", Helvetica;
  font-size: 16px;
  color: rgba(255, 255, 255, 0.7);
  margin: 0 0 24px 0;
}

.create-button {
  background: linear-gradient(135deg, #ff5500 0%, #ff7a00 100%);
  color: #ffffff;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-family: "Manrope", Helvetica;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.create-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(255, 85, 0, 0.3);
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

.project-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.3s ease;
}

.project-card:hover {
  border-color: rgba(255, 85, 0, 0.3);
  transform: translateY(-4px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.3);
}

.project-image {
  position: relative;
  height: 200px;
  overflow: hidden;
}

.project-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.project-status {
  position: absolute;
  top: 12px;
  right: 12px;
  padding: 4px 8px;
  border-radius: 12px;
  font-family: "Manrope", Helvetica;
  font-size: 12px;
  font-weight: 500;
  text-transform: capitalize;
}

.project-status.draft {
  background: rgba(255, 193, 7, 0.2);
  color: #ffc107;
}

.project-status.published {
  background: rgba(76, 175, 80, 0.2);
  color: #4caf50;
}

.project-status.archived {
  background: rgba(158, 158, 158, 0.2);
  color: #9e9e9e;
}

.project-info {
  padding: 20px;
}

.project-info h3 {
  font-family: "Manrope", Helvetica;
  font-size: 18px;
  font-weight: 600;
  color: #ffffff;
  margin: 0 0 8px 0;
}

.project-info p {
  font-family: "Manrope", Helvetica;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  margin: 0 0 16px 0;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.project-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.project-stats {
  display: flex;
  gap: 12px;
}

.stat {
  font-family: "Manrope", Helvetica;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
}

.project-category {
  font-family: "Manrope", Helvetica;
  font-size: 12px;
  color: #ff5500;
  font-weight: 500;
}

.project-technologies {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.tech-tag {
  background: rgba(255, 85, 0, 0.1);
  color: #ff5500;
  padding: 4px 8px;
  border-radius: 12px;
  font-family: "Manrope", Helvetica;
  font-size: 11px;
  font-weight: 500;
}

.tech-tag.more {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.6);
}

.activity-feed {
  margin-bottom: 40px;
}

.activity-feed h2 {
  font-family: "Manrope", Helvetica;
  font-size: 24px;
  font-weight: 600;
  color: #ffffff;
  margin: 0 0 24px 0;
}

.empty-activity {
  text-align: center;
  padding: 40px 20px;
  color: rgba(255, 255, 255, 0.5);
}

.activity-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.activity-item {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 16px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
}

.activity-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(255, 85, 0, 0.1);
  border-radius: 50%;
  font-size: 18px;
  flex-shrink: 0;
}

.activity-content {
  flex: 1;
}

.activity-content p {
  font-family: "Manrope", Helvetica;
  font-size: 14px;
  color: #ffffff;
  margin: 0 0 4px 0;
}

.activity-time {
  font-family: "Manrope", Helvetica;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(8px);
}

.modal {
  background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 32px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.modal-header h3 {
  font-family: "Manrope", Helvetica;
  font-size: 24px;
  font-weight: 700;
  color: #ffffff;
  margin: 0;
}

.close-button {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.close-button:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
}

.close-button svg {
  width: 20px;
  height: 20px;
}

.project-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-family: "Manrope", Helvetica;
  font-size: 14px;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
}

.form-group input,
.form-group textarea,
.form-group select {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 12px 16px;
  color: #ffffff;
  font-family: "Manrope", Helvetica;
  font-size: 14px;
  transition: all 0.3s ease;
  resize: vertical;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: #ff5500;
  background: rgba(255, 85, 0, 0.05);
}

.form-group input::placeholder,
.form-group textarea::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.form-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 20px;
}

.cancel-button {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 12px 24px;
  font-family: "Manrope", Helvetica;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cancel-button:hover {
  background: rgba(255, 255, 255, 0.2);
}

@media (max-width: 768px) {
  .dashboard {
    padding: 20px;
  }
  
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 16px;
  }
  
  .actions-grid {
    grid-template-columns: 1fr;
  }
  
  .projects-grid {
    grid-template-columns: 1fr;
  }
  
  .modal {
    margin: 20px;
    padding: 24px;
  }
  
  .form-actions {
    flex-direction: column;
  }
}
</style> 