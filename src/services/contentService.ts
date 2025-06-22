import { supabase } from '@/lib/supabase'

export interface Section {
  id: string
  page_slug: string
  section_key: string
  title: string
  subtitle: string
  content: string
  image_url: string
  order_index: number
  is_active: boolean
}

export interface TeamMember {
  id: string
  name: string
  role: string
  bio: string
  avatar_url: string
  github_url: string
  linkedin_url: string
  twitter_url: string
  order_index: number
  is_active: boolean
}

export interface FAQ {
  id: string
  question: string
  answer: string
  category: string
  order_index: number
  is_active: boolean
}

export interface SiteSetting {
  id: string
  key: string
  value: string
  description: string
}

class ContentService {
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

  async getSection(pageSlug: string, sectionKey: string): Promise<Section | null> {
    const cacheKey = `section_${pageSlug}_${sectionKey}`
    const cached = this.getCache(cacheKey)
    if (cached) return cached

    try {
      const { data, error } = await supabase
        .from('sections')
        .select('*')
        .eq('page_slug', pageSlug)
        .eq('section_key', sectionKey)
        .eq('is_active', true)
        .single()

      if (error) {
        console.error('Error fetching section:', error)
        return null
      }

      this.setCache(cacheKey, data)
      return data
    } catch (error) {
      console.error('Error fetching section:', error)
      return null
    }
  }

  async getTeamMembers(): Promise<TeamMember[]> {
    const cacheKey = 'team_members'
    const cached = this.getCache(cacheKey)
    if (cached) return cached

    try {
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .eq('is_active', true)
        .order('order_index', { ascending: true })

      if (error) {
        console.error('Error fetching team members:', error)
        return this.getDefaultTeamMembers()
      }

      this.setCache(cacheKey, data)
      return data
    } catch (error) {
      console.error('Error fetching team members:', error)
      return this.getDefaultTeamMembers()
    }
  }

  async getFAQs(category?: string): Promise<FAQ[]> {
    const cacheKey = `faqs_${category || 'all'}`
    const cached = this.getCache(cacheKey)
    if (cached) return cached

    try {
      let query = supabase
        .from('faqs')
        .select('*')
        .eq('is_active', true)
        .order('order_index', { ascending: true })

      if (category) {
        query = query.eq('category', category)
      }

      const { data, error } = await query

      if (error) {
        console.error('Error fetching FAQs:', error)
        return this.getDefaultFAQs()
      }

      this.setCache(cacheKey, data)
      return data
    } catch (error) {
      console.error('Error fetching FAQs:', error)
      return this.getDefaultFAQs()
    }
  }

  async getSiteSetting(key: string): Promise<string | null> {
    const cacheKey = `setting_${key}`
    const cached = this.getCache(cacheKey)
    if (cached) return cached

    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('value')
        .eq('key', key)
        .single()

      if (error) {
        console.error('Error fetching site setting:', error)
        return null
      }

      this.setCache(cacheKey, data.value)
      return data.value
    } catch (error) {
      console.error('Error fetching site setting:', error)
      return null
    }
  }

  // Default fallback data
  private getDefaultTeamMembers(): TeamMember[] {
    return [
      {
        id: '1',
        name: 'Ellie Chen',
        role: 'Founder & CEO',
        bio: 'Passionate about democratizing development tools and making coding accessible to everyone. Former senior engineer at major tech companies.',
        avatar_url: 'https://c.animaapp.com/bX3QfjDJ/img/logo-1.svg',
        github_url: 'https://github.com/elliechen',
        linkedin_url: 'https://linkedin.com/in/elliechen',
        twitter_url: 'https://twitter.com/elliechen',
        order_index: 1,
        is_active: true
      },
      {
        id: '2',
        name: 'Jordan Kim',
        role: 'CTO & Lead Architect',
        bio: 'Expert in scalable systems and developer experience. Believes in the power of open source and community-driven development.',
        avatar_url: 'https://c.animaapp.com/bX3QfjDJ/img/logo-2.svg',
        github_url: 'https://github.com/jordankim',
        linkedin_url: 'https://linkedin.com/in/jordankim',
        twitter_url: 'https://twitter.com/jordankim',
        order_index: 2,
        is_active: true
      },
      {
        id: '3',
        name: 'Rim Patel',
        role: 'Head of Product',
        bio: 'Product strategist focused on user experience and developer workflows. Dedicated to building tools that developers actually want to use.',
        avatar_url: 'https://c.animaapp.com/bX3QfjDJ/img/logo.svg',
        github_url: 'https://github.com/rimpatel',
        linkedin_url: 'https://linkedin.com/in/rimpatel',
        twitter_url: 'https://twitter.com/rimpatel',
        order_index: 3,
        is_active: true
      }
    ]
  }

  private getDefaultFAQs(): FAQ[] {
    return [
      {
        id: '1',
        question: 'What is Orangopus?',
        answer: 'Orangopus is a platform that simplifies development by providing intuitive tools, resources, and a supportive community for developers of all skill levels.',
        category: 'general',
        order_index: 1,
        is_active: true
      },
      {
        id: '2',
        question: 'Is Orangopus free to use?',
        answer: 'Yes! Our core platform is completely free and open source. We believe in democratizing development tools for everyone.',
        category: 'general',
        order_index: 2,
        is_active: true
      },
      {
        id: '3',
        question: 'How can I contribute to Orangopus?',
        answer: 'You can contribute by joining our community, sharing projects, providing feedback, or contributing code to our open source repositories.',
        category: 'community',
        order_index: 3,
        is_active: true
      },
      {
        id: '4',
        question: 'What technologies does Orangopus support?',
        answer: 'We support a wide range of technologies including JavaScript, TypeScript, Python, React, Vue, Node.js, and many more.',
        category: 'technical',
        order_index: 4,
        is_active: true
      },
      {
        id: '5',
        question: 'How can I get help with my project?',
        answer: 'Join our community feed to ask questions, share your projects, and connect with other developers who can help you.',
        category: 'community',
        order_index: 5,
        is_active: true
      }
    ]
  }

  // Clear cache method for development
  clearCache(): void {
    this.cache.clear()
  }
}

export const contentService = new ContentService() 