import { supabase } from '@/lib/supabase';

export interface NewsArticle {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  featured_image?: string;
  published_at: string;
  author?: {
    name: string;
    avatar?: string;
  };
  category?: {
    id: string;
    name: string;
  };
  tags?: Array<{
    id: string;
    name: string;
  }>;
  slug: string;
  url?: string;
  read_time?: number;
  views?: number;
}

export interface NewsCategory {
  id: string;
  name: string;
  description?: string;
}

export interface NewsFilters {
  category?: string;
  search?: string;
  tags?: string[];
  author?: string;
  dateFrom?: string;
  dateTo?: string;
  limit?: number;
  offset?: number;
}

class NewsService {
  private baseUrl = 'https://api.storychief.io/v1';
  private apiToken = process.env.VUE_APP_STORYCHIEF_TOKEN;

  /**
   * Fetch articles from StoryChief API
   */
  async fetchArticles(filters: NewsFilters = {}): Promise<NewsArticle[]> {
    try {
      const params = new URLSearchParams();
      
      if (filters.category) params.append('category', filters.category);
      if (filters.search) params.append('search', filters.search);
      if (filters.tags?.length) params.append('tags', filters.tags.join(','));
      if (filters.author) params.append('author', filters.author);
      if (filters.dateFrom) params.append('date_from', filters.dateFrom);
      if (filters.dateTo) params.append('date_to', filters.dateTo);
      if (filters.limit) params.append('limit', filters.limit.toString());
      if (filters.offset) params.append('offset', filters.offset.toString());

      const response = await fetch(`${this.baseUrl}/articles?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${this.apiToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`StoryChief API error: ${response.status}`);
      }

      const data = await response.json();
      return this.transformArticles(data.articles || []);
    } catch (error) {
      console.error('Error fetching articles from StoryChief:', error);
      throw error;
    }
  }

  /**
   * Fetch a single article by ID or slug
   */
  async fetchArticle(identifier: string): Promise<NewsArticle | null> {
    try {
      const response = await fetch(`${this.baseUrl}/articles/${identifier}`, {
        headers: {
          'Authorization': `Bearer ${this.apiToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error(`StoryChief API error: ${response.status}`);
      }

      const data = await response.json();
      return this.transformArticle(data.article);
    } catch (error) {
      console.error('Error fetching article from StoryChief:', error);
      throw error;
    }
  }

  /**
   * Fetch categories from StoryChief API
   */
  async fetchCategories(): Promise<NewsCategory[]> {
    try {
      const response = await fetch(`${this.baseUrl}/categories`, {
        headers: {
          'Authorization': `Bearer ${this.apiToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`StoryChief API error: ${response.status}`);
      }

      const data = await response.json();
      return data.categories || [];
    } catch (error) {
      console.error('Error fetching categories from StoryChief:', error);
      throw error;
    }
  }

  /**
   * Fetch tags from StoryChief API
   */
  async fetchTags(): Promise<Array<{ id: string; name: string }>> {
    try {
      const response = await fetch(`${this.baseUrl}/tags`, {
        headers: {
          'Authorization': `Bearer ${this.apiToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`StoryChief API error: ${response.status}`);
      }

      const data = await response.json();
      return data.tags || [];
    } catch (error) {
      console.error('Error fetching tags from StoryChief:', error);
      throw error;
    }
  }

  /**
   * Search articles with full-text search
   */
  async searchArticles(query: string, filters: NewsFilters = {}): Promise<NewsArticle[]> {
    const searchFilters = { ...filters, search: query };
    return this.fetchArticles(searchFilters);
  }

  /**
   * Get trending articles (most viewed in last 30 days)
   */
  async getTrendingArticles(limit: number = 5): Promise<NewsArticle[]> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const filters: NewsFilters = {
      dateFrom: thirtyDaysAgo.toISOString(),
      limit: limit
    };

    const articles = await this.fetchArticles(filters);
    return articles.sort((a, b) => (b.views || 0) - (a.views || 0));
  }

  /**
   * Get latest articles
   */
  async getLatestArticles(limit: number = 10): Promise<NewsArticle[]> {
    const filters: NewsFilters = {
      limit: limit
    };

    const articles = await this.fetchArticles(filters);
    return articles.sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());
  }

  /**
   * Get articles by category
   */
  async getArticlesByCategory(categoryId: string, limit: number = 10): Promise<NewsArticle[]> {
    const filters: NewsFilters = {
      category: categoryId,
      limit: limit
    };

    return this.fetchArticles(filters);
  }

  /**
   * Get articles by tag
   */
  async getArticlesByTag(tagName: string, limit: number = 10): Promise<NewsArticle[]> {
    const filters: NewsFilters = {
      tags: [tagName],
      limit: limit
    };

    return this.fetchArticles(filters);
  }

  /**
   * Transform StoryChief article data to our format
   */
  private transformArticle(article: any): NewsArticle {
    return {
      id: article.id || article.uuid,
      title: article.title,
      excerpt: article.excerpt || article.summary,
      content: article.content || article.body,
      featured_image: article.featured_image || article.cover_image,
      published_at: article.published_at || article.published_date,
      author: article.author ? {
        name: article.author.name || article.author.display_name,
        avatar: article.author.avatar || article.author.profile_image
      } : undefined,
      category: article.category ? {
        id: article.category.id || article.category.slug,
        name: article.category.name
      } : undefined,
      tags: article.tags?.map((tag: any) => ({
        id: tag.id || tag.slug,
        name: tag.name
      })) || [],
      slug: article.slug || article.url_slug,
      url: article.url || article.permalink,
      read_time: article.read_time || this.calculateReadTime(article.content),
      views: article.views || article.view_count
    };
  }

  /**
   * Transform multiple articles
   */
  private transformArticles(articles: any[]): NewsArticle[] {
    return articles.map(article => this.transformArticle(article));
  }

  /**
   * Calculate estimated read time for an article
   */
  private calculateReadTime(content: string): number {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.ceil(wordCount / wordsPerMinute);
  }

  /**
   * Get mock data for development/testing
   */
  getMockArticles(): NewsArticle[] {
    return [
      {
        id: "1",
        title: "Orangopus Community Reaches 1000+ Contributors",
        excerpt: "We're excited to announce that our community has grown to over 1000 active contributors, marking a major milestone in our journey.",
        content: "<p>This is a detailed article about our community growth and the amazing contributions from developers around the world.</p><p>We've seen incredible projects being built, innovative solutions being shared, and a truly collaborative spirit that defines what Orangopus is all about.</p>",
        featured_image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=400&fit=crop",
        published_at: "2024-01-15T10:00:00Z",
        author: { name: "Jordan Smith" },
        category: { id: "community", name: "Community" },
        tags: [
          { id: "1", name: "milestone" },
          { id: "2", name: "community" },
          { id: "3", name: "growth" }
        ],
        slug: "orangopus-community-reaches-1000-contributors",
        read_time: 3,
        views: 1250
      },
      {
        id: "2",
        title: "New Features Released: Enhanced Project Showcase",
        excerpt: "Discover the latest updates to our project showcase feature, including improved GitHub integration and better collaboration tools.",
        content: "<p>We've completely revamped our project showcase with new features that make it easier than ever to share your work with the community.</p><p>From enhanced GitHub integration to improved collaboration tools, these updates are designed to help you showcase your projects in the best possible way.</p>",
        featured_image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=400&fit=crop",
        published_at: "2024-01-10T14:30:00Z",
        author: { name: "Sarah Chen" },
        category: { id: "updates", name: "Updates" },
        tags: [
          { id: "4", name: "features" },
          { id: "5", name: "github" },
          { id: "6", name: "collaboration" }
        ],
        slug: "new-features-released-enhanced-project-showcase",
        read_time: 5,
        views: 890
      },
      {
        id: "3",
        title: "Getting Started with Vue 3 and TypeScript",
        excerpt: "A comprehensive guide for developers looking to build modern web applications with Vue 3 and TypeScript.",
        content: "<p>Vue 3 and TypeScript are a powerful combination for building modern web applications. In this guide, we'll walk through everything you need to know to get started.</p><p>From setting up your development environment to building your first component, we'll cover all the essentials.</p>",
        featured_image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=400&fit=crop",
        published_at: "2024-01-08T09:15:00Z",
        author: { name: "Alex Rodriguez" },
        category: { id: "tutorials", name: "Tutorials" },
        tags: [
          { id: "7", name: "vue" },
          { id: "8", name: "typescript" },
          { id: "9", name: "tutorial" }
        ],
        slug: "getting-started-with-vue-3-and-typescript",
        read_time: 8,
        views: 1560
      },
      {
        id: "4",
        title: "The Future of Open Source Collaboration",
        excerpt: "Exploring how AI and machine learning are transforming the way we collaborate on open source projects.",
        content: "<p>Artificial intelligence is revolutionizing the way we approach open source development. From automated code reviews to intelligent project suggestions, AI is becoming an integral part of the development workflow.</p><p>We explore the latest trends and how they're shaping the future of collaboration.</p>",
        featured_image: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=400&fit=crop",
        published_at: "2024-01-05T16:45:00Z",
        author: { name: "Maria Garcia" },
        category: { id: "technology", name: "Technology" },
        tags: [
          { id: "10", name: "ai" },
          { id: "11", name: "machine-learning" },
          { id: "12", name: "open-source" }
        ],
        slug: "future-of-open-source-collaboration",
        read_time: 6,
        views: 2100
      },
      {
        id: "5",
        title: "Orangopus Hackathon 2024: Winners Announced",
        excerpt: "Congratulations to all participants and winners of our annual hackathon! See the amazing projects that were built.",
        content: "<p>Our annual hackathon was a huge success with over 500 participants from around the world. The creativity and innovation on display was truly inspiring.</p><p>We're excited to share the winning projects and highlight the incredible work that was done.</p>",
        featured_image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=400&fit=crop",
        published_at: "2024-01-03T12:00:00Z",
        author: { name: "David Kim" },
        category: { id: "events", name: "Events" },
        tags: [
          { id: "13", name: "hackathon" },
          { id: "14", name: "winners" },
          { id: "15", name: "innovation" }
        ],
        slug: "orangopus-hackathon-2024-winners-announced",
        read_time: 4,
        views: 3200
      }
    ];
  }
}

export const newsService = new NewsService(); 