<template>
  <div class="github-import">
    <div v-if="!isConnected" class="connect-section">
      <div class="connect-header">
        <h3>Connect Your GitHub Account</h3>
        <p>Import your existing repositories as Orangopus projects</p>
      </div>
      
      <button @click="connectGitHub" class="connect-btn" :disabled="loading">
        <span v-if="loading" class="loading-spinner"></span>
        {{ loading ? 'Connecting...' : 'Connect GitHub' }}
      </button>
      
      <div v-if="error" class="error-message">
        {{ error }}
      </div>
    </div>
    
    <div v-else class="import-section">
      <div class="import-header">
        <h3>Select Repositories to Import</h3>
        <p>Choose which repositories you'd like to import as projects</p>
      </div>
      
      <div class="filters">
        <button 
          v-for="filter in filters" 
          :key="filter.id"
          @click="setFilter(filter.id)"
          class="filter-btn"
          :class="{ active: activeFilter === filter.id }"
        >
          {{ filter.name }}
        </button>
      </div>
      
      <div v-if="loading" class="loading-state">
        <div class="loading-spinner"></div>
        <p>Loading repositories...</p>
      </div>
      
      <div v-else-if="filteredRepositories.length === 0" class="empty-state">
        <p>No repositories found</p>
      </div>
      
      <div v-else class="repositories-list">
        <div 
          v-for="repo in filteredRepositories" 
          :key="repo.id" 
          class="repo-item"
          :class="{ selected: selectedRepos.includes(repo.id) }"
        >
          <div class="repo-info">
            <div class="repo-header">
              <h4>{{ repo.name }}</h4>
              <span class="repo-visibility" :class="repo.private ? 'private' : 'public'">
                {{ repo.private ? 'Private' : 'Public' }}
              </span>
            </div>
            
            <p class="repo-description">{{ repo.description || 'No description available' }}</p>
            
            <div class="repo-meta">
              <span class="repo-language" v-if="repo.language">{{ repo.language }}</span>
              <span class="repo-stars">⭐ {{ repo.stargazers_count }}</span>
              <span class="repo-forks">🔄 {{ repo.forks_count }}</span>
            </div>
          </div>
          
          <div class="repo-actions">
            <label class="checkbox-wrapper">
              <input 
                type="checkbox" 
                :checked="selectedRepos.includes(repo.id)"
                @change="toggleRepoSelection(repo.id)"
              />
              <span class="checkmark"></span>
            </label>
          </div>
        </div>
      </div>
      
      <div v-if="selectedRepos.length > 0" class="import-actions">
        <div class="selected-count">
          {{ selectedRepos.length }} repository{{ selectedRepos.length > 1 ? 'ies' : 'y' }} selected
        </div>
        <div class="action-buttons">
          <button @click="clearSelection" class="clear-btn">
            Clear Selection
          </button>
          <button @click="importSelected" class="import-btn" :disabled="importing">
            <span v-if="importing" class="loading-spinner"></span>
            {{ importing ? 'Importing...' : `Import ${selectedRepos.length} Project${selectedRepos.length > 1 ? 's' : ''}` }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { supabase } from '@/lib/supabase';
import { projectService } from '@/services/projectService';

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

interface Filter {
  id: string;
  name: string;
}

export default defineComponent({
  name: "GitHubImport",
  data() {
    return {
      isConnected: false,
      repositories: [] as Repository[],
      selectedRepos: [] as number[],
      activeFilter: 'all',
      filters: [
        { id: 'all', name: 'All' },
        { id: 'public', name: 'Public' },
        { id: 'private', name: 'Private' }
      ] as Filter[],
      loading: false,
      importing: false,
      error: ''
    };
  },
  computed: {
    filteredRepositories(): Repository[] {
      if (this.activeFilter === 'all') {
        return this.repositories;
      }
      return this.repositories.filter(repo => {
        if (this.activeFilter === 'public') return !repo.private;
        if (this.activeFilter === 'private') return repo.private;
        return true;
      });
    }
  },
  mounted() {
    this.checkConnection();
  },
  methods: {
    async checkConnection() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.provider_token) {
          this.isConnected = true;
          await this.loadRepositories();
        }
      } catch (error) {
        console.error('Error checking connection:', error);
      }
    },
    
    async connectGitHub() {
      this.loading = true;
      this.error = '';
      
      try {
        const { error } = await supabase.auth.signInWithOAuth({ provider: 'github' });
        if (error) {
          this.error = error.message;
        } else {
          // Wait a bit for the OAuth flow to complete
          setTimeout(() => {
            this.checkConnection();
          }, 2000);
        }
      } catch (error) {
        this.error = 'Failed to connect to GitHub';
      } finally {
        this.loading = false;
      }
    },
    
    async loadRepositories() {
      this.loading = true;
      this.error = '';
      
      try {
        const { data: { session } } = await supabase.auth.getSession();
        const token = session?.provider_token;
        
        if (!token) {
          this.isConnected = false;
          return;
        }
        
        const response = await fetch('https://api.github.com/user/repos?per_page=100&sort=updated', {
          headers: { Authorization: `token ${token}` }
        });
        
        if (!response.ok) {
          throw new Error('Failed to fetch repositories');
        }
        
        this.repositories = await response.json();
      } catch (error) {
        this.error = 'Failed to load repositories';
        console.error('Error loading repositories:', error);
      } finally {
        this.loading = false;
      }
    },
    
    setFilter(filterId: string) {
      this.activeFilter = filterId;
    },
    
    toggleRepoSelection(repoId: number) {
      const index = this.selectedRepos.indexOf(repoId);
      if (index > -1) {
        this.selectedRepos.splice(index, 1);
      } else {
        this.selectedRepos.push(repoId);
      }
    },
    
    clearSelection() {
      this.selectedRepos = [];
    },
    
    async importSelected() {
      this.importing = true;
      this.error = '';
      
      try {
        const selectedRepositories = this.repositories.filter(repo => 
          this.selectedRepos.includes(repo.id)
        );
        
        for (const repo of selectedRepositories) {
          const projectData = {
            title: repo.name,
            description: repo.description || '',
            github_url: repo.html_url,
            technologies: repo.language ? [repo.language] : [],
            image_url: '',
            live_url: '',
            category: '',
            difficulty_level: undefined
          };
          
          const result = await projectService.createProject(projectData);
          if (result.success && result.project) {
            this.$emit('project-imported', result.project);
          }
        }
        
        // Clear selection after successful import
        this.selectedRepos = [];
        this.$emit('close');
      } catch (error) {
        this.error = 'Failed to import some repositories';
        console.error('Error importing repositories:', error);
      } finally {
        this.importing = false;
      }
    }
  }
});
</script>

<style scoped>
.github-import {
  padding: 20px;
}

.connect-section {
  text-align: center;
  padding: 40px 20px;
}

.connect-header h3 {
  font-family: "Manrope", Helvetica;
  font-size: 24px;
  font-weight: 600;
  color: #ffffff;
  margin: 0 0 8px 0;
}

.connect-header p {
  font-family: "Manrope", Helvetica;
  font-size: 16px;
  color: rgba(255, 255, 255, 0.7);
  margin: 0 0 32px 0;
}

.connect-btn {
  background: linear-gradient(135deg, #ff5500 0%, #ff7a00 100%);
  color: #ffffff;
  border: none;
  border-radius: 8px;
  padding: 16px 32px;
  font-family: "Manrope", Helvetica;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0 auto;
}

.connect-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(255, 85, 0, 0.3);
}

.connect-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.import-section {
  max-height: 600px;
  overflow-y: auto;
}

.import-header h3 {
  font-family: "Manrope", Helvetica;
  font-size: 20px;
  font-weight: 600;
  color: #ffffff;
  margin: 0 0 8px 0;
}

.import-header p {
  font-family: "Manrope", Helvetica;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  margin: 0 0 24px 0;
}

.filters {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
}

.filter-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.8);
  border-radius: 6px;
  padding: 8px 16px;
  font-family: "Manrope", Helvetica;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.filter-btn.active {
  background: #ff5500;
  border-color: #ff5500;
  color: #ffffff;
}

.repositories-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
}

.repo-item {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 16px;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.repo-item:hover {
  border-color: rgba(255, 85, 0, 0.3);
  background: rgba(255, 85, 0, 0.05);
}

.repo-item.selected {
  border-color: #ff5500;
  background: rgba(255, 85, 0, 0.1);
}

.repo-info {
  flex: 1;
}

.repo-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 8px;
}

.repo-header h4 {
  font-family: "Manrope", Helvetica;
  font-size: 16px;
  font-weight: 600;
  color: #ffffff;
  margin: 0;
}

.repo-visibility {
  font-family: "Manrope", Helvetica;
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 12px;
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

.repo-description {
  font-family: "Manrope", Helvetica;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  margin: 0 0 8px 0;
  line-height: 1.4;
}

.repo-meta {
  display: flex;
  gap: 16px;
  align-items: center;
}

.repo-language,
.repo-stars,
.repo-forks {
  font-family: "Manrope", Helvetica;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
}

.repo-actions {
  display: flex;
  align-items: center;
}

.checkbox-wrapper {
  position: relative;
  display: inline-block;
  width: 20px;
  height: 20px;
  cursor: pointer;
}

.checkbox-wrapper input {
  opacity: 0;
  width: 0;
  height: 0;
}

.checkmark {
  position: absolute;
  top: 0;
  left: 0;
  width: 20px;
  height: 20px;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 4px;
  transition: all 0.3s ease;
}

.checkbox-wrapper input:checked ~ .checkmark {
  background: #ff5500;
  border-color: #ff5500;
}

.checkmark:after {
  content: '';
  position: absolute;
  display: none;
  left: 6px;
  top: 2px;
  width: 6px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  transform: rotate(45deg);
}

.checkbox-wrapper input:checked ~ .checkmark:after {
  display: block;
}

.import-actions {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.selected-count {
  font-family: "Manrope", Helvetica;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
}

.action-buttons {
  display: flex;
  gap: 12px;
}

.clear-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: rgba(255, 255, 255, 0.8);
  border-radius: 6px;
  padding: 8px 16px;
  font-family: "Manrope", Helvetica;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.clear-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  color: #ffffff;
}

.import-btn {
  background: linear-gradient(135deg, #ff5500 0%, #ff7a00 100%);
  color: #ffffff;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  font-family: "Manrope", Helvetica;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.import-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 15px rgba(255, 85, 0, 0.3);
}

.import-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.loading-state {
  text-align: center;
  padding: 40px 20px;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid #ffffff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  display: inline-block;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: rgba(255, 255, 255, 0.6);
}

.error-message {
  background: rgba(255, 59, 48, 0.1);
  border: 1px solid rgba(255, 59, 48, 0.3);
  border-radius: 8px;
  padding: 12px;
  color: #ff3b30;
  font-family: "Manrope", Helvetica;
  font-size: 14px;
  margin-top: 16px;
}
</style> 