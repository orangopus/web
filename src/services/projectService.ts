import { supabase } from '@/lib/supabase'

export interface Project {
  id: string
  title: string
  description: string
  image_url: string
  github_url?: string
  live_url?: string
  technologies: string[]
  category: string
  status: 'draft' | 'published' | 'archived'
  user_id: string
  created_at: string
  updated_at: string
  likes: number
  views: number
  featured: boolean
}

export interface CreateProjectData {
  title: string
  description: string
  image_url: string
  github_url?: string
  live_url?: string
  technologies: string[]
  category: string
}

export interface UpdateProjectData extends Partial<CreateProjectData> {
  status?: 'draft' | 'published' | 'archived'
  featured?: boolean
}

class ProjectService {
  private cache: Map<string, any> = new Map()
  private cacheTimeout = 5 * 60 * 1000 // 5 minutes

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

  async createProject(data: CreateProjectData): Promise<{ success: boolean; project?: Project; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        return { success: false, error: 'User not authenticated' }
      }

      const { data: project, error } = await supabase
        .from('projects')
        .insert({
          ...data,
          user_id: user.id,
          status: 'draft',
          likes: 0,
          views: 0,
          featured: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) {
        console.error('Error creating project:', error)
        return { success: false, error: error.message }
      }

      // Clear cache
      this.clearCache()

      return { success: true, project }
    } catch (error) {
      console.error('Error creating project:', error)
      return { success: false, error: 'An error occurred while creating the project' }
    }
  }

  async updateProject(projectId: string, data: UpdateProjectData): Promise<{ success: boolean; project?: Project; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        return { success: false, error: 'User not authenticated' }
      }

      const { data: project, error } = await supabase
        .from('projects')
        .update({
          ...data,
          updated_at: new Date().toISOString()
        })
        .eq('id', projectId)
        .eq('user_id', user.id)
        .select()
        .single()

      if (error) {
        console.error('Error updating project:', error)
        return { success: false, error: error.message }
      }

      // Clear cache
      this.clearCache()

      return { success: true, project }
    } catch (error) {
      console.error('Error updating project:', error)
      return { success: false, error: 'An error occurred while updating the project' }
    }
  }

  async deleteProject(projectId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        return { success: false, error: 'User not authenticated' }
      }

      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId)
        .eq('user_id', user.id)

      if (error) {
        console.error('Error deleting project:', error)
        return { success: false, error: error.message }
      }

      // Clear cache
      this.clearCache()

      return { success: true }
    } catch (error) {
      console.error('Error deleting project:', error)
      return { success: false, error: 'An error occurred while deleting the project' }
    }
  }

  async getUserProjects(userId?: string): Promise<{ success: boolean; projects?: Project[]; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        return { success: false, error: 'User not authenticated' }
      }

      const targetUserId = userId || user.id
      const cacheKey = `user_projects_${targetUserId}`
      const cached = this.getCache(cacheKey)
      if (cached) return { success: true, projects: cached }

      const { data: projects, error } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', targetUserId)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching user projects:', error)
        return { success: false, error: error.message }
      }

      this.setCache(cacheKey, projects)
      return { success: true, projects }
    } catch (error) {
      console.error('Error fetching user projects:', error)
      return { success: false, error: 'An error occurred while fetching projects' }
    }
  }

  async getPublishedProjects(category?: string, limit?: number): Promise<{ success: boolean; projects?: Project[]; error?: string }> {
    try {
      const cacheKey = `published_projects_${category || 'all'}_${limit || 'all'}`
      const cached = this.getCache(cacheKey)
      if (cached) return { success: true, projects: cached }

      let query = supabase
        .from('projects')
        .select('*')
        .eq('status', 'published')
        .order('created_at', { ascending: false })

      if (category) {
        query = query.eq('category', category)
      }

      if (limit) {
        query = query.limit(limit)
      }

      const { data: projects, error } = await query

      if (error) {
        console.error('Error fetching published projects:', error)
        return { success: false, error: error.message }
      }

      this.setCache(cacheKey, projects)
      return { success: true, projects }
    } catch (error) {
      console.error('Error fetching published projects:', error)
      return { success: false, error: 'An error occurred while fetching projects' }
    }
  }

  async getFeaturedProjects(): Promise<{ success: boolean; projects?: Project[]; error?: string }> {
    try {
      const cacheKey = 'featured_projects'
      const cached = this.getCache(cacheKey)
      if (cached) return { success: true, projects: cached }

      const { data: projects, error } = await supabase
        .from('projects')
        .select('*')
        .eq('status', 'published')
        .eq('featured', true)
        .order('created_at', { ascending: false })
        .limit(6)

      if (error) {
        console.error('Error fetching featured projects:', error)
        return { success: false, error: error.message }
      }

      this.setCache(cacheKey, projects)
      return { success: true, projects }
    } catch (error) {
      console.error('Error fetching featured projects:', error)
      return { success: false, error: 'An error occurred while fetching featured projects' }
    }
  }

  async getProject(projectId: string): Promise<{ success: boolean; project?: Project; error?: string }> {
    try {
      const cacheKey = `project_${projectId}`
      const cached = this.getCache(cacheKey)
      if (cached) return { success: true, project: cached }

      const { data: project, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single()

      if (error) {
        console.error('Error fetching project:', error)
        return { success: false, error: error.message }
      }

      this.setCache(cacheKey, project)
      return { success: true, project }
    } catch (error) {
      console.error('Error fetching project:', error)
      return { success: false, error: 'An error occurred while fetching the project' }
    }
  }

  async likeProject(projectId: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        return { success: false, error: 'User not authenticated' }
      }

      // First, get current project
      const { data: project, error: fetchError } = await supabase
        .from('projects')
        .select('likes')
        .eq('id', projectId)
        .single()

      if (fetchError) {
        console.error('Error fetching project for like:', fetchError)
        return { success: false, error: fetchError.message }
      }

      // Update likes count
      const { error: updateError } = await supabase
        .from('projects')
        .update({ likes: (project.likes || 0) + 1 })
        .eq('id', projectId)

      if (updateError) {
        console.error('Error updating project likes:', updateError)
        return { success: false, error: updateError.message }
      }

      // Clear cache
      this.clearCache()

      return { success: true }
    } catch (error) {
      console.error('Error liking project:', error)
      return { success: false, error: 'An error occurred while liking the project' }
    }
  }

  async incrementViews(projectId: string): Promise<void> {
    try {
      const { data: project, error: fetchError } = await supabase
        .from('projects')
        .select('views')
        .eq('id', projectId)
        .single()

      if (fetchError) {
        console.error('Error fetching project for view increment:', fetchError)
        return
      }

      await supabase
        .from('projects')
        .update({ views: (project.views || 0) + 1 })
        .eq('id', projectId)

      // Clear cache
      this.clearCache()
    } catch (error) {
      console.error('Error incrementing project views:', error)
    }
  }

  async searchProjects(query: string): Promise<{ success: boolean; projects?: Project[]; error?: string }> {
    try {
      const { data: projects, error } = await supabase
        .from('projects')
        .select('*')
        .eq('status', 'published')
        .or(`title.ilike.%${query}%,description.ilike.%${query}%`)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error searching projects:', error)
        return { success: false, error: error.message }
      }

      return { success: true, projects }
    } catch (error) {
      console.error('Error searching projects:', error)
      return { success: false, error: 'An error occurred while searching projects' }
    }
  }

  // Utility methods
  getProjectCategories(): string[] {
    return [
      'Web Development',
      'Mobile Development',
      'AI/ML',
      'Game Development',
      'DevOps',
      'Data Science',
      'Blockchain',
      'IoT',
      'Other'
    ]
  }

  getProjectStatuses(): Array<{ value: string; label: string }> {
    return [
      { value: 'draft', label: 'Draft' },
      { value: 'published', label: 'Published' },
      { value: 'archived', label: 'Archived' }
    ]
  }

  clearCache(): void {
    this.cache.clear()
  }
}

export const projectService = new ProjectService() 