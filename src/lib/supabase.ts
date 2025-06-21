import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.VUE_APP_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = process.env.VUE_APP_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Database {
  public: {
    Tables: {
      posts: {
        Row: {
          id: string
          user_name: string
          user_avatar: string
          content: string
          created_at: string
          likes: number
          tags: string[]
          github_repo: {
            name: string
            description: string
            url: string
            stars: number
            forks: number
            language: string
          } | null
        }
        Insert: {
          id?: string
          user_name: string
          user_avatar: string
          content: string
          created_at?: string
          likes?: number
          tags: string[]
          github_repo?: {
            name: string
            description: string
            url: string
            stars: number
            forks: number
            language: string
          } | null
        }
        Update: {
          id?: string
          user_name?: string
          user_avatar?: string
          content?: string
          created_at?: string
          likes?: number
          tags?: string[]
          github_repo?: {
            name: string
            description: string
            url: string
            stars: number
            forks: number
            language: string
          } | null
        }
      }
      projects: {
        Row: {
          id: string
          title: string
          description: string
          image_url: string
          github_url: string
          live_url: string
          technologies: string[]
          created_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          image_url: string
          github_url: string
          live_url: string
          technologies: string[]
          created_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          image_url?: string
          github_url?: string
          live_url?: string
          technologies?: string[]
          created_at?: string
        }
      }
    }
  }
} 