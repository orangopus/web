<template>
  <section class="project-showcase">
    <div class="showcase-background">
      <div class="showcase-particles"></div>
    </div>
    <div class="showcase-content">
      <h2 class="section-title animate-on-scroll">Project Showcase</h2>
      <p class="section-description animate-on-scroll">
        Discover amazing projects from our community and share your own creations.
      </p>
      
      <!-- Project Creation -->
      <div class="project-creation animate-on-scroll">
        <div class="creation-header">
          <h3>Share Your Project</h3>
          <p>Showcase your work to the community</p>
        </div>
        <div class="creation-form">
          <div class="form-row">
            <input 
              v-model="newProject.title" 
              placeholder="Project Title"
              class="form-input"
            />
            <select v-model="newProject.category" class="form-select">
              <option value="">Select Category</option>
              <option value="web">Web Development</option>
              <option value="mobile">Mobile App</option>
              <option value="ai">AI/ML</option>
              <option value="game">Game Development</option>
              <option value="other">Other</option>
            </select>
          </div>
          <textarea 
            v-model="newProject.description" 
            placeholder="Describe your project..."
            class="form-textarea"
            rows="4"
          ></textarea>
          <div class="form-row">
            <input 
              v-model="newProject.githubUrl" 
              placeholder="GitHub Repository URL (optional)"
              class="form-input"
            />
            <input 
              v-model="newProject.liveUrl" 
              placeholder="Live Demo URL (optional)"
              class="form-input"
            />
          </div>
          <div class="form-actions">
            <button @click="createProject" class="create-btn" :disabled="!isFormValid">
              <span>Share Project</span>
              <div class="btn-glow"></div>
            </button>
          </div>
        </div>
      </div>
      
      <!-- Project Filters -->
      <div class="project-filters animate-on-scroll">
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
          class="project-card animate-on-scroll"
        >
          <div class="project-image">
            <img :src="project.image" :alt="project.title" />
            <div class="project-overlay">
              <div class="overlay-actions">
                <button @click="viewProject(project)" class="overlay-btn">
                  <span>👁️</span>
                  View
                </button>
                <button @click="likeProject(project.id)" class="overlay-btn">
                  <span>❤️</span>
                  {{ project.likes }}
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
                <img :src="project.author.avatar" :alt="project.author.name" />
                <span>{{ project.author.name }}</span>
              </div>
              <span class="project-date">{{ formatDate(project.createdAt) }}</span>
            </div>
            
            <div class="project-links">
              <a 
                v-if="project.githubUrl" 
                :href="project.githubUrl" 
                target="_blank" 
                class="project-link github-link"
              >
                <svg class="github-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                GitHub
              </a>
              <a 
                v-if="project.liveUrl" 
                :href="project.liveUrl" 
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
  </section>
</template>

<script lang="ts">
import { defineComponent } from "vue";

interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  githubUrl?: string;
  liveUrl?: string;
  likes: number;
  createdAt: Date;
  author: {
    name: string;
    avatar: string;
  };
}

interface Filter {
  id: string;
  name: string;
}

export default defineComponent({
  name: "ProjectShowcase",
  data() {
    return {
      loading: false,
      newProject: {
        title: "",
        description: "",
        category: "",
        githubUrl: "",
        liveUrl: ""
      },
      projects: [] as Project[],
      activeFilter: "all",
      page: 1,
      hasMoreProjects: true,
      filters: [
        { id: "all", name: "All Projects" },
        { id: "web", name: "Web Development" },
        { id: "mobile", name: "Mobile Apps" },
        { id: "ai", name: "AI/ML" },
        { id: "game", name: "Games" },
        { id: "other", name: "Other" }
      ] as Filter[]
    };
  },
  computed: {
    filteredProjects(): Project[] {
      if (this.activeFilter === "all") {
        return this.projects;
      }
      return this.projects.filter(project => project.category === this.activeFilter);
    },
    isFormValid(): boolean {
      return this.newProject.title.trim() !== "" && 
             this.newProject.description.trim() !== "" && 
             this.newProject.category !== "";
    }
  },
  mounted() {
    this.observeElements();
    this.loadProjects();
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
    
    async createProject() {
      if (!this.isFormValid) return;
      
      const project: Project = {
        id: Date.now().toString(),
        title: this.newProject.title,
        description: this.newProject.description,
        category: this.newProject.category,
        image: this.getRandomProjectImage(),
        githubUrl: this.newProject.githubUrl || undefined,
        liveUrl: this.newProject.liveUrl || undefined,
        likes: 0,
        createdAt: new Date(),
        author: {
          name: "Cheesecastv20053",
          avatar: "https://c.animaapp.com/bX3QfjDJ/img/logo.svg"
        }
      };
      
      this.projects.unshift(project);
      
      // Reset form
      this.newProject = {
        title: "",
        description: "",
        category: "",
        githubUrl: "",
        liveUrl: ""
      };
      
      // Emit event to parent for social feed integration
      this.$emit('project-created', project);
      
      console.log('Project created:', project);
    },
    
    getRandomProjectImage(): string {
      const images = [
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop",
        "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=400&h=300&fit=crop"
      ];
      return images[Math.floor(Math.random() * images.length)];
    },
    
    async loadProjects() {
      this.loading = true;
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock data
      this.projects = [
        {
          id: "1",
          title: "Vue Component Library",
          description: "A beautiful and modern Vue.js component library with 50+ components, built with TypeScript and featuring dark mode support.",
          category: "web",
          image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop",
          githubUrl: "https://github.com/orangopus/vue-component-library",
          liveUrl: "https://vue-components-demo.vercel.app",
          likes: 23,
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          author: {
            name: "Ellie@orangopus",
            avatar: "https://c.animaapp.com/bX3QfjDJ/img/logo-1.svg"
          }
        },
        {
          id: "2",
          title: "Real-time Chat App",
          description: "A real-time chat application built with WebSockets, featuring user authentication, file sharing, and message encryption.",
          category: "web",
          image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=400&h=300&fit=crop",
          githubUrl: "https://github.com/orangopus/chat-app",
          liveUrl: "https://chat-app-demo.vercel.app",
          likes: 45,
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          author: {
            name: "Jordan@orangopus",
            avatar: "https://c.animaapp.com/bX3QfjDJ/img/logo-2.svg"
          }
        },
        {
          id: "3",
          title: "AI Image Generator",
          description: "An AI-powered image generation tool using stable diffusion, with custom model training and style transfer capabilities.",
          category: "ai",
          image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=300&fit=crop",
          githubUrl: "https://github.com/orangopus/ai-image-gen",
          likes: 67,
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          author: {
            name: "Rim@orangopus",
            avatar: "https://c.animaapp.com/bX3QfjDJ/img/logo.svg"
          }
        },
        {
          id: "4",
          title: "Mobile Task Manager",
          description: "A cross-platform mobile app for task management with offline support, push notifications, and team collaboration features.",
          category: "mobile",
          image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop",
          githubUrl: "https://github.com/orangopus/task-manager",
          liveUrl: "https://task-manager-app.vercel.app",
          likes: 34,
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          author: {
            name: "Alex@orangopus",
            avatar: "https://c.animaapp.com/bX3QfjDJ/img/logo-1.svg"
          }
        },
        {
          id: "5",
          title: "Space Shooter Game",
          description: "A retro-style space shooter game built with HTML5 Canvas and JavaScript, featuring particle effects and progressive difficulty.",
          category: "game",
          image: "https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=400&h=300&fit=crop",
          githubUrl: "https://github.com/orangopus/space-shooter",
          liveUrl: "https://space-shooter-game.vercel.app",
          likes: 28,
          createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          author: {
            name: "Sam@orangopus",
            avatar: "https://c.animaapp.com/bX3QfjDJ/img/logo-2.svg"
          }
        }
      ];
      
      this.loading = false;
    },
    
    async loadMoreProjects() {
      this.page++;
      // Simulate loading more projects
      await new Promise(resolve => setTimeout(resolve, 1000));
      this.hasMoreProjects = false;
    },
    
    setActiveFilter(filterId: string) {
      this.activeFilter = filterId;
    },
    
    viewProject(project: Project) {
      // Implement project view functionality
      console.log('Viewing project:', project);
    },
    
    likeProject(projectId: string) {
      const project = this.projects.find(p => p.id === projectId);
      if (project) {
        project.likes++;
      }
    },
    
    getCategoryName(category: string): string {
      const categoryMap: { [key: string]: string } = {
        web: "Web Development",
        mobile: "Mobile App",
        ai: "AI/ML",
        game: "Game Development",
        other: "Other"
      };
      return categoryMap[category] || category;
    },
    
    formatDate(date: Date): string {
      const now = new Date();
      const diff = now.getTime() - date.getTime();
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      
      if (days === 0) return 'Today';
      if (days === 1) return 'Yesterday';
      if (days < 7) return `${days} days ago`;
      if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
      return `${Math.floor(days / 30)} months ago`;
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

.creation-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.form-input, .form-select, .form-textarea {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 15px 20px;
  color: #ffffff;
  font-family: "Manrope", Helvetica;
  font-size: 16px;
  transition: all 0.3s ease;
}

.form-input:focus, .form-select:focus, .form-textarea:focus {
  outline: none;
  border-color: rgba(255, 85, 0, 0.5);
  background: rgba(255, 255, 255, 0.15);
}

.form-input::placeholder, .form-textarea::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.form-select option {
  background: #1a1a1a;
  color: #ffffff;
}

.form-actions {
  display: flex;
  justify-content: center;
}

.create-btn {
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

.create-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.create-btn:not(:disabled):hover {
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

.create-btn:hover .btn-glow {
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
</style>
