<template>
  <section class="project-showcase">
    <div class="showcase-background">
      <div class="showcase-particles"></div>
    </div>
    <div class="showcase-content">
      <h2 class="section-title">Project Showcase</h2>
      <p class="section-description">
        Discover amazing projects from our community and share your own creations.
      </p>
      
      <!-- Project Creation -->
      <div class="project-creation">
        <div class="creation-header">
          <h3>Share Your Project</h3>
          <p>Showcase your work to the community</p>
        </div>
        <div class="creation-actions">
          <button @click="showCreateProject = true" class="create-project-btn">
            <span>➕</span>
            Create New Project
          </button>
        </div>
      </div>
      
      <!-- Project Filters -->
      <div class="project-filters">
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
        <span>Loading projects...</span>
      </div>
      
      <!-- Projects Grid -->
      <div v-else class="projects-grid">
        <div 
          v-for="project in filteredProjects" 
          :key="project.id" 
          class="project-card"
        >
          <div class="project-image">
            <img :src="project.image_url || '/default-project.jpg'" :alt="project.title" />
            <div class="project-overlay">
              <div class="overlay-actions">
                <button @click="viewProject(project)" class="overlay-btn">
                  <span>👁️</span>
                  View
                </button>
                <button @click="likeProject(project.id)" class="overlay-btn">
                  <span>❤️</span>
                  {{ project.likes_count || 0 }}
                </button>
              </div>
            </div>
          </div>
          
          <div class="project-info">
            <div class="project-header">
              <h3 class="project-title">{{ project.title }}</h3>
              <span class="project-category">{{ getCategoryName(project.category) }}</span>
            </div>
            
            <p class="project-description">{{ project.description }}</p>
            
            <div class="project-meta">
              <div class="project-author">
                <img :src="authorAvatarUrl(project)" :alt="project.user_name" @error="onAvatarError(project.id)" />
                <span>{{ project.user_name || 'Anonymous' }}</span>
              </div>
              <span class="project-date">{{ formatDate(project.created_at || '') }}</span>
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
            
            <div class="project-links">
              <a 
                v-if="project.github_url" 
                :href="project.github_url" 
                target="_blank" 
                class="project-link github-link"
              >
                <svg class="github-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                GitHub
              </a>
              <a 
                v-if="project.live_url" 
                :href="project.live_url" 
                target="_blank" 
                class="project-link live-link"
              >
                <span>🚀</span>
                Live Demo
              </a>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Load More -->
      <div v-if="hasMoreProjects" class="load-more">
        <button @click="loadMoreProjects" class="load-more-btn">
          Load More Projects
        </button>
      </div>
    </div>

    <!-- Create Project Modal -->
    <div v-if="showCreateProject" class="modal-overlay" @click="showCreateProject = false">
      <div class="modal" @click.stop>
        <ProjectForm 
          @close="showCreateProject = false"
          @success="handleProjectCreated"
        />
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { projectService, type Project } from "@/services/projectService";
import ProjectForm from "@/components/ProjectForm.vue";

interface Filter {
  id: string;
  name: string;
}

export default defineComponent({
  name: "ProjectShowcase",
  components: {
    ProjectForm
  },
  data() {
    return {
      loading: false,
      projects: [] as Project[],
      activeFilter: "all",
      page: 1,
      hasMoreProjects: true,
      showCreateProject: false,
      filters: [
        { id: "all", name: "All Projects" },
        { id: "web-development", name: "Web Development" },
        { id: "mobile-app", name: "Mobile Apps" },
        { id: "ai-ml", name: "AI/ML" },
        { id: "game", name: "Games" },
        { id: "other", name: "Other" }
      ] as Filter[],
      fallbackAvatars: {} as Record<string, string>
    };
  },
  computed: {
    filteredProjects(): Project[] {
      if (this.activeFilter === "all") {
        return this.projects;
      }
      return this.projects.filter(project => project.category === this.activeFilter);
    },
    authorAvatarUrl() {
      return (project: Project) => this.fallbackAvatars[project.id] || project.user_avatar || '/default-avatar.svg';
    }
  },
  mounted() {
    this.loadProjects();
  },
  methods: {
    async loadProjects() {
      this.loading = true;
      
      try {
        const result = await projectService.getProjects({ 
          status: 'published',
          limit: 10 
        });
        
        if (result.success && result.projects) {
          this.projects = result.projects;
        } else {
          console.error('Error loading projects:', result.error);
        }
      } catch (error) {
        console.error('Error loading projects:', error);
      } finally {
        this.loading = false;
      }
    },

    async likeProject(projectId: string) {
      try {
        const result = await projectService.likeProject(projectId);
        if (result.success) {
          // Refresh the project data
          await this.loadProjects();
        }
      } catch (error) {
        console.error('Error liking project:', error);
      }
    },

    viewProject(project: Project) {
      // Navigate to project detail page using slug or ID as fallback
      if (project.slug) {
        this.$router.push(`/project/${project.slug as string}`);
      } else {
        // Fallback to using project ID if slug doesn't exist
        this.$router.push(`/project/${project.id}`);
      }
    },

    setActiveFilter(filterId: string) {
      this.activeFilter = filterId;
    },

    loadMoreProjects() {
      // Implement pagination
      console.log('Load more projects');
    },

    getCategoryName(category?: string): string {
      if (!category) return 'Uncategorized';
      const categoryMap: { [key: string]: string } = {
        'web-development': 'Web Development',
        'mobile-app': 'Mobile App',
        'ai-ml': 'AI/ML',
        'game': 'Game',
        'other': 'Other'
      };
      return categoryMap[category] || category;
    },

    formatDate(dateString: any): string {
      if (!dateString) return 'Unknown date';
      try {
        const date = new Date(dateString);
        return date.toLocaleDateString();
      } catch (error) {
        return 'Invalid date';
      }
    },

    handleProjectCreated(project: Project) {
      // Handle project creation success
      this.showCreateProject = false;
      this.loadProjects();
      this.$emit('project-created', project);
    },

    onAvatarError(projectId: string) {
      this.fallbackAvatars[projectId] = '/default-avatar.svg';
    }
  }
});
</script>

<style scoped>
.project-showcase {
  padding: 120px 40px;
  position: relative;
  overflow: hidden;
  min-height: 100vh;
}

.showcase-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
}

.showcase-particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: 
    radial-gradient(1px 1px at 25% 35%, rgba(255, 85, 0, 0.2), transparent),
    radial-gradient(1px 1px at 65% 75%, rgba(255, 255, 255, 0.1), transparent),
    radial-gradient(2px 2px at 85% 25%, rgba(255, 85, 0, 0.15), transparent);
  background-size: 320px 320px, 220px 220px, 380px 380px;
  animation: showcase-float 28s ease-in-out infinite;
}

@keyframes showcase-float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  33% { transform: translateY(-18px) rotate(0.7deg); }
  66% { transform: translateY(12px) rotate(-0.7deg); }
}

.showcase-content {
  position: relative;
  z-index: 1;
  max-width: 1200px;
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

.project-creation {
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

.project-creation.animate-in {
  opacity: 1;
  transform: translateY(0);
}

.creation-header {
  margin-bottom: 25px;
}

.creation-header h3 {
  color: #ffffff;
  font-family: "Manrope", Helvetica;
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 8px 0;
}

.creation-header p {
  color: rgba(255, 255, 255, 0.7);
  font-family: "Manrope", Helvetica;
  font-size: 16px;
  margin: 0;
}

.creation-actions {
  display: flex;
  justify-content: center;
}

.create-project-btn {
  position: relative;
  background: linear-gradient(135deg, #ff5500 0%, #ff7a00 100%);
  border: none;
  border-radius: 12px;
  padding: 15px 40px;
  color: #ffffff;
  font-family: "Manrope", Helvetica;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;
}

.create-project-btn:hover {
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

.create-project-btn:hover .btn-glow {
  left: 100%;
}

.project-filters {
  display: flex;
  gap: 15px;
  margin-bottom: 40px;
  flex-wrap: wrap;
  justify-content: center;
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s ease 0.6s;
}

.project-filters.animate-in {
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

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 30px;
  margin-bottom: 40px;
}

.project-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  overflow: hidden;
  backdrop-filter: blur(20px);
  transition: all 0.3s ease;
  opacity: 0;
  transform: translateY(30px);
  animation: projectAppear 0.6s ease-out forwards;
}

.project-card:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 85, 0, 0.2);
  transform: translateY(-5px);
  box-shadow: 0 15px 40px rgba(255, 85, 0, 0.15);
}

@keyframes projectAppear {
  to {
    opacity: 1;
    transform: translateY(0);
  }
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
  transition: transform 0.3s ease;
}

.project-card:hover .project-image img {
  transform: scale(1.05);
}

.project-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.project-card:hover .project-overlay {
  opacity: 1;
}

.overlay-actions {
  display: flex;
  gap: 15px;
}

.overlay-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(255, 255, 255, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  padding: 10px 15px;
  color: #ffffff;
  font-family: "Manrope", Helvetica;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.overlay-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.project-info {
  padding: 25px;
}

.project-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
}

.project-title {
  color: #ffffff;
  font-family: "Manrope", Helvetica;
  font-size: 18px;
  font-weight: 600;
  margin: 0;
  line-height: 1.3;
}

.project-category {
  background: rgba(255, 85, 0, 0.2);
  color: #ff5500;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  white-space: nowrap;
}

.project-description {
  color: rgba(255, 255, 255, 0.8);
  font-family: "Manrope", Helvetica;
  font-size: 14px;
  line-height: 1.5;
  margin: 0 0 20px 0;
}

.project-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.project-author {
  display: flex;
  align-items: center;
  gap: 8px;
}

.project-author img {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 1px solid rgba(255, 85, 0, 0.3);
}

.project-author span {
  color: rgba(255, 255, 255, 0.7);
  font-size: 14px;
}

.project-date {
  color: rgba(255, 255, 255, 0.5);
  font-size: 12px;
}

.project-technologies {
  margin-bottom: 20px;
}

.tech-tag {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
  margin-right: 8px;
}

.tech-tag.more {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.5);
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.project-links {
  display: flex;
  gap: 10px;
}

.project-link {
  display: flex;
  align-items: center;
  gap: 6px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 8px 12px;
  color: #ffffff;
  text-decoration: none;
  font-family: "Manrope", Helvetica;
  font-size: 12px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.project-link:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-1px);
}

.github-link:hover {
  background: rgba(255, 85, 0, 0.2);
  border-color: rgba(255, 85, 0, 0.4);
}

.live-link:hover {
  background: rgba(0, 255, 0, 0.2);
  border-color: rgba(0, 255, 0, 0.4);
}

.github-icon {
  width: 14px;
  height: 14px;
}

.load-more {
  display: flex;
  justify-content: center;
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
  .project-showcase {
    padding: 80px 20px;
  }
  
  .project-creation {
    padding: 20px;
  }
  
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .projects-grid {
    grid-template-columns: 1fr;
  }
  
  .project-header {
    flex-direction: column;
    gap: 10px;
  }
  
  .project-meta {
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
  }
  
  .project-links {
    flex-direction: column;
  }
}

/* Light theme styles */
.light-theme .project-showcase {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 50%, #f8f9fa 100%);
  color: #212529;
}

.light-theme .section-title {
  color: #212529;
}

.light-theme .section-description {
  color: rgba(0, 0, 0, 0.7);
}

.light-theme .project-creation {
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
}

.light-theme .creation-header h3 {
  color: #212529;
}

.light-theme .creation-header p {
  color: rgba(0, 0, 0, 0.7);
}

.light-theme .create-project-btn {
  background: #ff5500;
  color: #ffffff;
  border-color: #ff5500;
}

.light-theme .create-project-btn:hover {
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

.light-theme .project-card {
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.light-theme .project-card:hover {
  background: rgba(255, 255, 255, 1);
  border-color: rgba(255, 85, 0, 0.3);
  box-shadow: 0 8px 30px rgba(255, 85, 0, 0.2);
}

.light-theme .project-title {
  color: #212529;
}

.light-theme .project-category {
  color: rgba(0, 0, 0, 0.7);
}

.light-theme .project-description {
  color: #212529;
}

.light-theme .project-author span {
  color: #212529;
}

.light-theme .project-date {
  color: rgba(0, 0, 0, 0.6);
}

.light-theme .tech-tag {
  background: rgba(255, 85, 0, 0.1);
  color: #ff5500;
  border: 1px solid rgba(255, 85, 0, 0.2);
}

.light-theme .project-link {
  background: rgba(255, 255, 255, 0.8);
  color: #212529;
  border: 1px solid rgba(0, 0, 0, 0.1);
}

.light-theme .project-link:hover {
  background: rgba(255, 255, 255, 1);
  border-color: rgba(255, 85, 0, 0.3);
}

.light-theme .github-link {
  background: #ff5500;
  color: #ffffff;
  border-color: #ff5500;
}

.light-theme .github-link:hover {
  background: #e64a00;
  border-color: #e64a00;
}

.light-theme .live-link {
  background: #28a745;
  color: #ffffff;
  border-color: #28a745;
}

.light-theme .live-link:hover {
  background: #218838;
  border-color: #218838;
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
