import { supabase } from '@/lib/supabase'

export interface DevToolIntegration {
  id: string
  user_id: string
  platform: 'github' | 'gitlab' | 'bitbucket' | 'vercel' | 'netlify'
  access_token?: string
  username: string
  avatar_url?: string
  repositories: DevToolRepository[]
  connected_at: string
  updated_at: string
}

export interface DevToolRepository {
  id: string
  name: string
  full_name: string
  description?: string
  html_url: string
  clone_url: string
  language?: string
  stars: number
  forks: number
  updated_at: string
  private: boolean
}

export interface GitHubRepo {
  id: number
  name: string
  full_name: string
  description: string | null
  html_url: string
  clone_url: string
  language: string | null
  stargazers_count: number
  forks_count: number
  updated_at: string
  private: boolean
  owner: {
    login: string
    avatar_url: string
  }
}

class DevToolsService {
  private cache: Map<string, any> = new Map()
  private cacheTimeout = 10 * 60 * 1000 // 10 minutes

  private isCacheValid(key: string): boolean {
    const cached = this.cache.get(key)
    if (!cached) return false
    return Date.now() - cached.timestamp < this.cacheTimeout
  }

  private setCache(key: string, data: any): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now()
    })
  }

  private getCache(key: string): any | null {
    if (this.isCacheValid(key)) {
      return this.cache.get(key).data
    }
    return null
  }

  async connectGitHub(code: string): Promise<{ success: boolean; integration?: DevToolIntegration; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        return { success: false, error: 'User not authenticated' }
      }

      // In a real implementation, you would exchange the code for an access token
      // For now, we'll simulate the GitHub OAuth flow
      const mockIntegration: DevToolIntegration = {
        id: `github_${user.id}`,
        user_id: user.id,
        platform: 'github',
        username: 'mock-github-user',
        avatar_url: 'https://github.com/github.png',
        repositories: [],
        connected_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      // Store integration in database
      const { error } = await supabase
        .from('dev_tool_integrations')
        .upsert({
          id: mockIntegration.id,
          user_id: mockIntegration.user_id,
          platform: mockIntegration.platform,
          username: mockIntegration.username,
          avatar_url: mockIntegration.avatar_url,
          connected_at: mockIntegration.connected_at,
          updated_at: mockIntegration.updated_at
        })

      if (error) {
        console.error('Error storing GitHub integration:', error)
        return { success: false, error: error.message }
      }

      return { success: true, integration: mockIntegration }
    } catch (error) {
      console.error('Error connecting GitHub:', error)
      return { success: false, error: 'An error occurred while connecting GitHub' }
    }
  }

  async getGitHubRepositories(username: string): Promise<{ success: boolean; repositories?: DevToolRepository[]; error?: string }> {
    try {
      const cacheKey = `github_repos_${username}`
      const cached = this.getCache(cacheKey)
      if (cached) return { success: true, repositories: cached }

      // In a real implementation, you would use the GitHub API
      // For now, we'll return mock data
      const mockRepositories: DevToolRepository[] = [
        {
          id: '1',
          name: 'ai-chatbot',
          full_name: `${username}/ai-chatbot`,
          description: 'An intelligent chatbot built with modern AI technologies',
          html_url: `https://github.com/${username}/ai-chatbot`,
          clone_url: `https://github.com/${username}/ai-chatbot.git`,
          language: 'Python',
          stars: 45,
          forks: 12,
          updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          private: false
        },
        {
          id: '2',
          name: 'web-portfolio',
          full_name: `${username}/web-portfolio`,
          description: 'My personal portfolio website built with Vue.js',
          html_url: `https://github.com/${username}/web-portfolio`,
          clone_url: `https://github.com/${username}/web-portfolio.git`,
          language: 'Vue',
          stars: 23,
          forks: 8,
          updated_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          private: false
        },
        {
          id: '3',
          name: 'mobile-app',
          full_name: `${username}/mobile-app`,
          description: 'Cross-platform mobile application',
          html_url: `https://github.com/${username}/mobile-app`,
          clone_url: `https://github.com/${username}/mobile-app.git`,
          language: 'React Native',
          stars: 67,
          forks: 15,
          updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          private: false
        }
      ]

      this.setCache(cacheKey, mockRepositories)
      return { success: true, repositories: mockRepositories }
    } catch (error) {
      console.error('Error fetching GitHub repositories:', error)
      return { success: false, error: 'An error occurred while fetching repositories' }
    }
  }

  async getUserIntegrations(): Promise<{ success: boolean; integrations?: DevToolIntegration[]; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        return { success: false, error: 'User not authenticated' }
      }

      const cacheKey = `user_integrations_${user.id}`
      const cached = this.getCache(cacheKey)
      if (cached) return { success: true, integrations: cached }

      const { data: integrations, error } = await supabase
        .from('dev_tool_integrations')
        .select('*')
        .eq('user_id', user.id)

      if (error) {
        console.error('Error fetching user integrations:', error)
        return { success: false, error: error.message }
      }

      this.setCache(cacheKey, integrations)
      return { success: true, integrations }
    } catch (error) {
      console.error('Error fetching user integrations:', error)
      return { success: false, error: 'An error occurred while fetching integrations' }
    }
  }

  async disconnectIntegration(integrationId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        return { success: false, error: 'User not authenticated' }
      }

      const { error } = await supabase
        .from('dev_tool_integrations')
        .delete()
        .eq('id', integrationId)
        .eq('user_id', user.id)

      if (error) {
        console.error('Error disconnecting integration:', error)
        return { success: false, error: error.message }
      }

      // Clear cache
      this.clearCache()

      return { success: true }
    } catch (error) {
      console.error('Error disconnecting integration:', error)
      return { success: false, error: 'An error occurred while disconnecting integration' }
    }
  }

  async importProjectFromRepo(repo: DevToolRepository): Promise<{ success: boolean; project?: any; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        return { success: false, error: 'User not authenticated' }
      }

      // Create a project from the repository
      const projectData = {
        title: repo.name,
        description: repo.description || `Project imported from ${repo.full_name}`,
        image_url: `https://via.placeholder.com/400x200/ff5500/ffffff?text=${encodeURIComponent(repo.name)}`,
        github_url: repo.html_url,
        technologies: [repo.language || 'Unknown'],
        category: this.detectCategory(repo.language || ''),
        status: 'draft' as const
      }

      // Import the project using the project service
      const { projectService } = await import('./projectService')
      const result = await projectService.createProject(projectData)

      return result
    } catch (error) {
      console.error('Error importing project from repo:', error)
      return { success: false, error: 'An error occurred while importing project' }
    }
  }

  private detectCategory(language: string): string {
    const languageMap: { [key: string]: string } = {
      'JavaScript': 'Web Development',
      'TypeScript': 'Web Development',
      'Python': 'AI/ML',
      'Java': 'Mobile Development',
      'Swift': 'Mobile Development',
      'Kotlin': 'Mobile Development',
      'C++': 'Game Development',
      'C#': 'Game Development',
      'Go': 'DevOps',
      'Rust': 'DevOps',
      'R': 'Data Science',
      'Julia': 'Data Science'
    }

    return languageMap[language] || 'Other'
  }

  // Utility methods
  getSupportedPlatforms(): Array<{ value: string; label: string; icon: string }> {
    return [
      { value: 'github', label: 'GitHub', icon: '🐙' },
      { value: 'gitlab', label: 'GitLab', icon: '🦊' },
      { value: 'bitbucket', label: 'Bitbucket', icon: '🪣' },
      { value: 'vercel', label: 'Vercel', icon: '▲' },
      { value: 'netlify', label: 'Netlify', icon: '🌐' }
    ]
  }

  getPlatformDisplayName(platform: string): string {
    const platforms = this.getSupportedPlatforms()
    const found = platforms.find(p => p.value === platform)
    return found ? found.label : platform
  }

  clearCache(): void {
    this.cache.clear()
  }
}

export const devToolsService = new DevToolsService() 