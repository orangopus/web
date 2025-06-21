<template>
  <section class="github-integration">
    <div class="integration-background">
      <div class="integration-particles"></div>
    </div>
    <div class="integration-content">
      <h2 class="section-title animate-on-scroll">GitHub Integration</h2>
      <p class="section-description animate-on-scroll">
        Connect your GitHub account to showcase your projects and contribute to the community.
      </p>
      
      <!-- Connection Status -->
      <div class="connection-status animate-on-scroll">
        <div class="status-card" :class="{ 'connected': isConnected }">
          <div class="status-icon">
            <svg v-if="isConnected" class="check-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
            </svg>
            <svg v-else class="github-icon" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
            </svg>
          </div>
          <div class="status-info">
            <h3>{{ isConnected ? 'Connected to GitHub' : 'Connect Your GitHub Account' }}</h3>
            <p>{{ isConnected ? `Welcome, ${userName}!` : 'Showcase your projects and contribute to the community.' }}</p>
          </div>
          <button 
            @click="toggleConnection" 
            class="connect-btn"
            :class="{ 'connected': isConnected }"
          >
            {{ isConnected ? 'Disconnect' : 'Connect GitHub' }}
          </button>
        </div>
      </div>
      
      <!-- User Stats -->
      <div v-if="isConnected" class="user-stats animate-on-scroll">
        <div class="stat-card">
          <div class="stat-icon">📊</div>
          <div class="stat-info">
            <h4>{{ userStats.publicRepos }}</h4>
            <p>Public Repositories</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">⭐</div>
          <div class="stat-info">
            <h4>{{ userStats.totalStars }}</h4>
            <p>Total Stars</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">🔄</div>
          <div class="stat-info">
            <h4>{{ userStats.totalForks }}</h4>
            <p>Total Forks</p>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon">👥</div>
          <div class="stat-info">
            <h4>{{ userStats.followers }}</h4>
            <p>Followers</p>
          </div>
        </div>
      </div>
      
      <!-- Repository Showcase -->
      <div v-if="isConnected" class="repository-showcase animate-on-scroll">
        <div class="showcase-header">
          <h3>Your Top Repositories</h3>
          <div class="showcase-filters">
            <button 
              v-for="filter in repoFilters" 
              :key="filter.id"
              @click="setRepoFilter(filter.id)"
              class="filter-btn"
              :class="{ 'active': activeRepoFilter === filter.id }"
            >
              {{ filter.name }}
            </button>
          </div>
        </div>
        
        <div class="repositories-grid">
          <div 
            v-for="repo in filteredRepositories" 
            :key="repo.id" 
            class="repo-card"
            @click="selectRepository(repo)"
          >
            <div class="repo-header">
              <div class="repo-name">
                <h4>{{ repo.name }}</h4>
                <span class="repo-visibility" :class="repo.private ? 'private' : 'public'">
                  {{ repo.private ? 'Private' : 'Public' }}
                </span>
              </div>
              <div class="repo-stats">
                <span class="stat">⭐ {{ repo.stargazers_count }}</span>
                <span class="stat">🔄 {{ repo.forks_count }}</span>
              </div>
            </div>
            
            <p class="repo-description">{{ repo.description || 'No description available' }}</p>
            
            <div class="repo-footer">
              <span class="repo-language" v-if="repo.language">{{ repo.language }}</span>
              <span class="repo-updated">Updated {{ formatTime(repo.updated_at) }}</span>
            </div>
            
            <div class="repo-actions">
              <button @click.stop="viewRepository(repo)" class="action-btn view-btn">
                View
              </button>
              <button @click.stop="shareRepository(repo)" class="action-btn share-btn">
                Share
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Repository Selection Modal -->
      <div v-if="showRepoModal" class="modal-overlay" @click="closeRepoModal">
        <div class="modal-content" @click.stop>
          <div class="modal-header">
            <h3>Share Repository</h3>
            <button @click="closeRepoModal" class="close-btn">×</button>
          </div>
          <div class="modal-body">
            <div class="selected-repo">
              <h4>{{ selectedRepo?.name }}</h4>
              <p>{{ selectedRepo?.description }}</p>
            </div>
            <div class="share-options">
              <button @click="shareToFeed" class="share-option">
                <span class="option-icon">📝</span>
                <span>Share to Community Feed</span>
              </button>
              <button @click="copyRepoLink" class="share-option">
                <span class="option-icon">🔗</span>
                <span>Copy Repository Link</span>
              </button>
              <button @click="openInGitHub" class="share-option">
                <span class="option-icon">🚀</span>
                <span>Open in GitHub</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent } from "vue";

interface Repository {
  id: number;
  name: string;
  description: string | null;
  private: boolean;
  html_url: string;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  updated_at: string;
}

interface UserStats {
  publicRepos: number;
  totalStars: number;
  totalForks: number;
  followers: number;
}

interface RepoFilter {
  id: string;
  name: string;
}

export default defineComponent({
  name: "GitHubIntegration",
  data() {
    return {
      isConnected: false,
      userName: "",
      userAvatar: "",
      userStats: {
        publicRepos: 0,
        totalStars: 0,
        totalForks: 0,
        followers: 0
      } as UserStats,
      repositories: [] as Repository[],
      activeRepoFilter: "all",
      showRepoModal: false,
      selectedRepo: null as Repository | null,
      repoFilters: [
        { id: "all", name: "All" },
        { id: "public", name: "Public" },
        { id: "private", name: "Private" },
        { id: "starred", name: "Starred" }
      ] as RepoFilter[]
    };
  },
  computed: {
    filteredRepositories(): Repository[] {
      if (this.activeRepoFilter === "all") {
        return this.repositories;
      }
      return this.repositories.filter(repo => {
        if (this.activeRepoFilter === "public") return !repo.private;
        if (this.activeRepoFilter === "private") return repo.private;
        return true;
      });
    }
  },
  mounted() {
    this.observeElements();
    this.checkConnection();
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
    
    async toggleConnection() {
      if (this.isConnected) {
        this.disconnect();
      } else {
        await this.connect();
      }
    },
    
    async connect() {
      // Simulate GitHub OAuth flow
      this.isConnected = true;
      this.userName = "Cheesecastv20053";
      this.userAvatar = "https://c.animaapp.com/bX3QfjDJ/img/logo.svg";
      
      // Load user data
      await this.loadUserData();
      await this.loadRepositories();
    },
    
    disconnect() {
      this.isConnected = false;
      this.userName = "";
      this.userAvatar = "";
      this.userStats = {
        publicRepos: 0,
        totalStars: 0,
        totalForks: 0,
        followers: 0
      };
      this.repositories = [];
    },
    
    async loadUserData() {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        this.userStats = {
          publicRepos: 15,
          totalStars: 234,
          totalForks: 67,
          followers: 89
        };
      } catch (error) {
        console.error('Error loading user data:', error);
      }
    },
    
    async loadRepositories() {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Mock data
        this.repositories = [
          {
            id: 1,
            name: "vue-component-library",
            description: "A beautiful Vue.js component library for modern web applications",
            private: false,
            html_url: "https://github.com/orangopus/vue-component-library",
            stargazers_count: 23,
            forks_count: 8,
            language: "Vue",
            updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: 2,
            name: "real-time-collab",
            description: "Real-time collaboration tool with WebSocket support",
            private: false,
            html_url: "https://github.com/orangopus/real-time-collab",
            stargazers_count: 45,
            forks_count: 12,
            language: "JavaScript",
            updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: 3,
            name: "api-gateway",
            description: "A scalable API gateway for microservices architecture",
            private: false,
            html_url: "https://github.com/orangopus/api-gateway",
            stargazers_count: 31,
            forks_count: 9,
            language: "Node.js",
            updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: 4,
            name: "data-analyzer",
            description: "A powerful data analysis tool for processing large datasets",
            private: false,
            html_url: "https://github.com/orangopus/data-analyzer",
            stargazers_count: 67,
            forks_count: 23,
            language: "Python",
            updated_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: 5,
            name: "creative-hub",
            description: "A collaborative platform for creative projects and ideas",
            private: false,
            html_url: "https://github.com/orangopus/creative-hub",
            stargazers_count: 19,
            forks_count: 6,
            language: "React",
            updated_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: 6,
            name: "secret-project",
            description: "A private project under development",
            private: true,
            html_url: "https://github.com/orangopus/secret-project",
            stargazers_count: 0,
            forks_count: 0,
            language: "TypeScript",
            updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
          }
        ];
      } catch (error) {
        console.error('Error loading repositories:', error);
      }
    },
    
    setRepoFilter(filterId: string) {
      this.activeRepoFilter = filterId;
    },
    
    selectRepository(repo: Repository) {
      this.selectedRepo = repo;
      this.showRepoModal = true;
    },
    
    viewRepository(repo: Repository) {
      window.open(repo.html_url, '_blank');
    },
    
    shareRepository(repo: Repository) {
      this.selectedRepo = repo;
      this.showRepoModal = true;
    },
    
    closeRepoModal() {
      this.showRepoModal = false;
      this.selectedRepo = null;
    },
    
    shareToFeed() {
      // Emit event to parent component
      this.$emit('share-repository', this.selectedRepo);
      this.closeRepoModal();
    },
    
    copyRepoLink() {
      if (this.selectedRepo) {
        navigator.clipboard.writeText(this.selectedRepo.html_url);
        // Show success message
        console.log('Repository link copied to clipboard');
      }
    },
    
    openInGitHub() {
      if (this.selectedRepo) {
        window.open(this.selectedRepo.html_url, '_blank');
      }
    },
    
    formatTime(dateString: string): string {
      const date = new Date(dateString);
      const now = new Date();
      const diff = now.getTime() - date.getTime();
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      
      if (days === 0) return 'today';
      if (days === 1) return 'yesterday';
      if (days < 7) return `${days} days ago`;
      if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
      return `${Math.floor(days / 30)} months ago`;
    },
    
    checkConnection() {
      // Check if user is already connected
      // This would typically check localStorage or a backend session
      this.isConnected = false;
    }
  }
});
</script>

<style scoped>
.github-integration {
  padding: 120px 40px;
  position: relative;
  overflow: hidden;
  min-height: 100vh;
}

.integration-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: -1;
}

.integration-particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: 
    radial-gradient(1px 1px at 30% 40%, rgba(255, 85, 0, 0.2), transparent),
    radial-gradient(1px 1px at 70% 60%, rgba(255, 255, 255, 0.1), transparent),
    radial-gradient(2px 2px at 50% 20%, rgba(255, 85, 0, 0.15), transparent);
  background-size: 350px 350px, 250px 250px, 400px 400px;
  animation: integration-float 30s ease-in-out infinite;
}

@keyframes integration-float {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  33% { transform: translateY(-20px) rotate(1deg); }
  66% { transform: translateY(15px) rotate(-1deg); }
}

.integration-content {
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

.connection-status {
  margin-bottom: 60px;
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s ease 0.4s;
}

.connection-status.animate-in {
  opacity: 1;
  transform: translateY(0);
}

.status-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 30px;
  display: flex;
  align-items: center;
  gap: 20px;
  backdrop-filter: blur(20px);
  transition: all 0.3s ease;
}

.status-card.connected {
  border-color: rgba(255, 85, 0, 0.3);
  background: rgba(255, 85, 0, 0.05);
}

.status-icon {
  width: 60px;
  height: 60px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 24px;
}

.status-card.connected .status-icon {
  background: rgba(255, 85, 0, 0.2);
  color: #ff5500;
}

.check-icon, .github-icon {
  width: 30px;
  height: 30px;
}

.status-info {
  flex: 1;
}

.status-info h3 {
  color: #ffffff;
  font-family: "Manrope", Helvetica;
  font-size: 20px;
  font-weight: 600;
  margin: 0 0 8px 0;
}

.status-info p {
  color: rgba(255, 255, 255, 0.7);
  font-family: "Manrope", Helvetica;
  font-size: 16px;
  margin: 0;
}

.connect-btn {
  background: linear-gradient(135deg, #ff5500 0%, #ff7a00 100%);
  border: none;
  border-radius: 12px;
  padding: 15px 30px;
  color: #ffffff;
  font-family: "Manrope", Helvetica;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.connect-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(255, 85, 0, 0.3);
}

.connect-btn.connected {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.user-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 60px;
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s ease 0.6s;
}

.user-stats.animate-in {
  opacity: 1;
  transform: translateY(0);
}

.stat-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 25px;
  display: flex;
  align-items: center;
  gap: 15px;
  backdrop-filter: blur(20px);
  transition: all 0.3s ease;
}

.stat-card:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 85, 0, 0.2);
  transform: translateY(-2px);
}

.stat-icon {
  font-size: 24px;
  width: 50px;
  height: 50px;
  background: rgba(255, 85, 0, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-info h4 {
  color: #ffffff;
  font-family: "Manrope", Helvetica;
  font-size: 24px;
  font-weight: 700;
  margin: 0 0 5px 0;
}

.stat-info p {
  color: rgba(255, 255, 255, 0.7);
  font-family: "Manrope", Helvetica;
  font-size: 14px;
  margin: 0;
}

.repository-showcase {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.8s ease 0.8s;
}

.repository-showcase.animate-in {
  opacity: 1;
  transform: translateY(0);
}

.showcase-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  flex-wrap: wrap;
  gap: 20px;
}

.showcase-header h3 {
  color: #ffffff;
  font-family: "Manrope", Helvetica;
  font-size: 24px;
  font-weight: 600;
  margin: 0;
}

.showcase-filters {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.filter-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  padding: 8px 16px;
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

.repositories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 25px;
}

.repo-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 25px;
  backdrop-filter: blur(20px);
  transition: all 0.3s ease;
  cursor: pointer;
}

.repo-card:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 85, 0, 0.2);
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(255, 85, 0, 0.1);
}

.repo-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 15px;
}

.repo-name h4 {
  color: #ffffff;
  font-family: "Manrope", Helvetica;
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 8px 0;
}

.repo-visibility {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 10px;
  font-weight: 500;
}

.repo-visibility.public {
  background: rgba(0, 255, 0, 0.2);
  color: #00ff00;
}

.repo-visibility.private {
  background: rgba(255, 0, 0, 0.2);
  color: #ff6666;
}

.repo-stats {
  display: flex;
  gap: 10px;
}

.stat {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
}

.repo-description {
  color: rgba(255, 255, 255, 0.8);
  font-family: "Manrope", Helvetica;
  font-size: 14px;
  line-height: 1.5;
  margin: 0 0 20px 0;
}

.repo-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.repo-language {
  background: rgba(255, 85, 0, 0.2);
  color: #ff5500;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.repo-updated {
  color: rgba(255, 255, 255, 0.5);
  font-size: 12px;
}

.repo-actions {
  display: flex;
  gap: 10px;
}

.action-btn {
  flex: 1;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  padding: 10px 15px;
  color: #ffffff;
  font-family: "Manrope", Helvetica;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.action-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
}

.view-btn:hover {
  background: rgba(255, 85, 0, 0.2);
  border-color: rgba(255, 85, 0, 0.4);
}

.share-btn:hover {
  background: rgba(0, 255, 0, 0.2);
  border-color: rgba(0, 255, 0, 0.4);
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
  backdrop-filter: blur(10px);
}

.modal-content {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 30px;
  max-width: 500px;
  width: 90%;
  backdrop-filter: blur(20px);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
}

.modal-header h3 {
  color: #ffffff;
  font-family: "Manrope", Helvetica;
  font-size: 20px;
  font-weight: 600;
  margin: 0;
}

.close-btn {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  font-size: 24px;
  cursor: pointer;
  transition: color 0.3s ease;
}

.close-btn:hover {
  color: #ffffff;
}

.selected-repo {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 25px;
}

.selected-repo h4 {
  color: #ffffff;
  font-family: "Manrope", Helvetica;
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 10px 0;
}

.selected-repo p {
  color: rgba(255, 255, 255, 0.7);
  font-family: "Manrope", Helvetica;
  font-size: 14px;
  margin: 0;
  line-height: 1.5;
}

.share-options {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.share-option {
  display: flex;
  align-items: center;
  gap: 15px;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 15px 20px;
  color: #ffffff;
  font-family: "Manrope", Helvetica;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.share-option:hover {
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.option-icon {
  font-size: 20px;
}

@media (max-width: 768px) {
  .github-integration {
    padding: 80px 20px;
  }
  
  .status-card {
    flex-direction: column;
    text-align: center;
    gap: 15px;
  }
  
  .user-stats {
    grid-template-columns: repeat(2, 1fr);
  }
  
  .showcase-header {
    flex-direction: column;
    align-items: stretch;
  }
  
  .repositories-grid {
    grid-template-columns: 1fr;
  }
  
  .repo-header {
    flex-direction: column;
    gap: 10px;
  }
  
  .repo-footer {
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
  }
  
  .modal-content {
    margin: 20px;
    padding: 20px;
  }
}
</style> 