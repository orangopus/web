<template>
  <section class="project-showcase">
    <div class="background-wrapper">
      <div class="cosmic-background">
        <div class="nebula-layer"></div>
        <div class="star-field"></div>
        <div class="energy-particles"></div>
      </div>
    </div>
    <div class="content-wrapper">
      <h2 class="section-title animate-on-scroll">Experimental Starships in the Open-Source Universe</h2>
      <p class="section-description animate-on-scroll">
        Dive into our hands-on experiments and open-source explorations.
      </p>
      <div v-if="loading" class="loading">
        <div class="loading-spinner"></div>
        <span>Loading projects...</span>
      </div>
      <div v-else-if="error" class="error">
        <span>{{ error }}</span>
        <button @click="fetchProjects" class="retry-button">Retry</button>
      </div>
      <div v-else class="projects-container">
        <ProjectCard 
          v-for="(project, index) in projects" 
          :key="project.id" 
          :project="project" 
          :style="{ animationDelay: `${index * 0.2}s` }"
          class="project-card-animate"
        />
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import ProjectCard from "./ProjectCard.vue";

interface Project {
  id: number
  language: string | null
  name: string
  description: string | null
  stars: number
  forks: number
  repoUrl: string
}

export default defineComponent({
  name: "ProjectShowcase",
  components: {
    ProjectCard,
  },
  data() {
    return {
      loading: false,
      error: null as string | null,
      projects: [] as Project[]
    }
  },
  async mounted() {
    await this.fetchProjects()
    this.observeElements();
  },
  methods: {
    async fetchProjects() {
      try {
        this.loading = true
        this.error = null
        
        // Try to fetch from GitHub API
        const response = await fetch('https://api.github.com/users/orangopus/repos?sort=updated&per_page=6')
        
        if (!response.ok) {
          throw new Error(`GitHub API error: ${response.status}`)
        }
        
        const data = await response.json()
        
        if (data.length === 0) {
          throw new Error('No repositories found')
        }
        
        this.projects = data.map((repo: any) => ({
          id: repo.id,
          language: repo.language || "Unknown",
          name: repo.name,
          description: repo.description || "No description available",
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          repoUrl: repo.html_url
        }))
      } catch (error) {
        console.error('Error fetching projects:', error)
        this.error = 'Unable to load projects from GitHub. Showing sample projects.'
        
        // Enhanced fallback data
        this.projects = [
          {
            id: 1,
            language: "JavaScript",
            name: "dynamix-toolbox",
            description: "A self-hosted sandbox for creators, freelancers, designers & you.",
            stars: 15,
            forks: 3,
            repoUrl: "https://github.com/orangopus/dynamix-toolbox"
          },
          {
            id: 2,
            language: "TypeScript",
            name: "vue-portfolio",
            description: "A modern portfolio website built with Vue 3 and TypeScript.",
            stars: 8,
            forks: 2,
            repoUrl: "https://github.com/orangopus/vue-portfolio"
          },
          {
            id: 3,
            language: "Python",
            name: "data-analyzer",
            description: "A powerful data analysis tool for processing large datasets.",
            stars: 23,
            forks: 7,
            repoUrl: "https://github.com/orangopus/data-analyzer"
          },
          {
            id: 4,
            language: "Vue",
            name: "orangopus-webapp",
            description: "The official Orangopus web application showcasing our community.",
            stars: 12,
            forks: 4,
            repoUrl: "https://github.com/orangopus/orangopus-webapp"
          },
          {
            id: 5,
            language: "React",
            name: "creative-hub",
            description: "A collaborative platform for creative projects and ideas.",
            stars: 19,
            forks: 6,
            repoUrl: "https://github.com/orangopus/creative-hub"
          },
          {
            id: 6,
            language: "Node.js",
            name: "api-gateway",
            description: "A scalable API gateway for microservices architecture.",
            stars: 31,
            forks: 9,
            repoUrl: "https://github.com/orangopus/api-gateway"
          }
        ]
      } finally {
        this.loading = false
      }
    },
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
    }
  }
})
</script>

<style scoped>
.project-showcase {
  width: 100%;
  overflow: hidden;
  position: relative;
  min-height: 100vh;
}

.background-wrapper {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
}

.cosmic-background {
  position: relative;
  width: 100%;
  height: 100%;
}

.nebula-layer {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: 
    radial-gradient(ellipse at 20% 50%, rgba(255, 85, 0, 0.1) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 20%, rgba(255, 255, 255, 0.05) 0%, transparent 50%),
    radial-gradient(ellipse at 40% 80%, rgba(255, 85, 0, 0.08) 0%, transparent 50%);
  animation: nebula-drift 30s ease-in-out infinite;
}

.star-field {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(1px 1px at 10% 20%, #fff, transparent),
    radial-gradient(1px 1px at 20% 80%, rgba(255,255,255,0.8), transparent),
    radial-gradient(2px 2px at 40% 40%, #fff, transparent),
    radial-gradient(1px 1px at 60% 60%, rgba(255,255,255,0.6), transparent),
    radial-gradient(2px 2px at 80% 20%, #fff, transparent),
    radial-gradient(1px 1px at 90% 80%, rgba(255,255,255,0.8), transparent);
  background-size: 200px 200px, 300px 300px, 150px 150px, 250px 250px, 180px 180px, 220px 220px;
  animation: star-twinkle 8s ease-in-out infinite;
}

.energy-particles {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-image: 
    radial-gradient(2px 2px at 30% 30%, rgba(255, 85, 0, 0.6), transparent),
    radial-gradient(1px 1px at 70% 70%, rgba(255, 255, 255, 0.4), transparent),
    radial-gradient(3px 3px at 50% 10%, rgba(255, 85, 0, 0.5), transparent);
  background-size: 400px 400px, 500px 500px, 300px 300px;
  animation: energy-flow 20s linear infinite;
}

@keyframes nebula-drift {
  0%, 100% { transform: translateX(0px) translateY(0px); }
  33% { transform: translateX(-20px) translateY(-10px); }
  66% { transform: translateX(10px) translateY(20px); }
}

@keyframes star-twinkle {
  0%, 100% { opacity: 0.3; }
  50% { opacity: 1; }
}

@keyframes energy-flow {
  0% { transform: translateX(-100px) translateY(-100px); }
  100% { transform: translateX(100px) translateY(100px); }
}

.content-wrapper {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 1600px;
  margin: 0 auto;
  padding: 120px 40px;
  gap: 60px;
}

.section-title {
  color: #ffffff;
  font-family: "Manrope", Helvetica;
  font-size: clamp(48px, 6vw, 80px);
  font-weight: 700;
  letter-spacing: -2px;
  line-height: 1.1;
  text-align: center;
  max-width: 1200px;
  margin: 0;
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
  font-size: clamp(20px, 2.5vw, 28px);
  font-weight: 400;
  letter-spacing: -0.5px;
  line-height: 1.4;
  text-align: center;
  max-width: 800px;
  margin: 0;
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s ease 0.2s;
}

.section-description.animate-in {
  opacity: 1;
  transform: translateY(0);
}

.projects-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 40px;
  max-width: 1600px;
  width: 100%;
}

.project-card-animate {
  opacity: 0;
  transform: translateY(50px) scale(0.9);
  animation: projectCardAppear 0.8s ease-out forwards;
}

@keyframes projectCardAppear {
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.loading, .error {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
  color: #ffffff;
  font-family: "Manrope", Helvetica;
  font-size: 24px;
  font-weight: 500;
  text-align: center;
  min-height: 300px;
  justify-content: center;
}

.loading-spinner {
  width: 60px;
  height: 60px;
  border: 4px solid rgba(255, 255, 255, 0.2);
  border-top: 4px solid #ff5500;
  border-radius: 50%;
  animation: spin 1.5s linear infinite;
  box-shadow: 0 0 30px rgba(255, 85, 0, 0.3);
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.retry-button {
  background: linear-gradient(135deg, #ff5500 0%, #ff7a00 100%);
  color: #ffffff;
  border: none;
  border-radius: 12px;
  padding: 16px 32px;
  font-family: "Manrope", Helvetica;
  font-size: 18px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 32px rgba(255, 85, 0, 0.3);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.retry-button:hover {
  background: linear-gradient(135deg, #ff7a00 0%, #ff5500 100%);
  transform: translateY(-2px);
  box-shadow: 0 12px 40px rgba(255, 85, 0, 0.4);
}

@media (max-width: 768px) {
  .content-wrapper {
    padding: 80px 20px;
    gap: 40px;
  }
  
  .projects-container {
    grid-template-columns: 1fr;
    gap: 30px;
  }
  
  .loading, .error {
    font-size: 20px;
    min-height: 200px;
  }
  
  .loading-spinner {
    width: 50px;
    height: 50px;
  }
}
</style>
