import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import readingTime from 'reading-time'

export interface BlogPost {
  slug: string
  title: string
  description: string
  category: string
  publishedAt: string
  updatedAt?: string
  author: {
    name: string
    avatar?: string
    bio?: string
  }
  featuredImage: string
  featuredImageAlt?: string
  tags?: string[]
  readingTime?: string
  content: string
  excerpt?: string
  seoTitle?: string
  seoDescription?: string
  featured?: boolean
}

export interface BlogCategory {
  slug: string
  name: string
  description: string
  count?: number
}

export const BLOG_CATEGORIES: BlogCategory[] = [
  {
    slug: 'stripe-management',
    name: 'Stripe Management',
    description: 'Tips and guides for managing Stripe subscriptions effectively'
  },
  {
    slug: 'subscription-audits',
    name: 'Subscription Audits',
    description: 'Learn how to audit and optimize your subscription spending'
  },
  {
    slug: 'cost-optimization',
    name: 'Cost Optimization',
    description: 'Strategies to reduce unnecessary subscription costs'
  },
  {
    slug: 'compliance',
    name: 'Compliance',
    description: 'Stay compliant with subscription regulations and best practices'
  }
]

const CONTENT_DIRECTORY = path.join(process.cwd(), 'content')
const BLOG_DIRECTORY = path.join(CONTENT_DIRECTORY, 'blog')
const GUIDES_DIRECTORY = path.join(CONTENT_DIRECTORY, 'guides')

function ensureDirectoryExists(dir: string) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true })
  }
}

export function getAllPosts(type: 'blog' | 'guides' = 'blog'): BlogPost[] {
  const directory = type === 'blog' ? BLOG_DIRECTORY : GUIDES_DIRECTORY
  
  ensureDirectoryExists(directory)
  
  const files = fs.readdirSync(directory)
  const posts = files
    .filter(file => file.endsWith('.mdx') || file.endsWith('.md'))
    .map(file => {
      const slug = file.replace(/\.(mdx|md)$/, '')
      const fullPath = path.join(directory, file)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data, content } = matter(fileContents)
      
      const stats = readingTime(content)
      
      return {
        slug,
        content,
        readingTime: stats.text,
        excerpt: content.slice(0, 200).replace(/[#*`]/g, '').trim() + '...',
        ...data
      } as BlogPost
    })
    .sort((a, b) => {
      return new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    })
  
  return posts
}

export function getPostBySlug(slug: string, type: 'blog' | 'guides' = 'blog'): BlogPost | null {
  const directory = type === 'blog' ? BLOG_DIRECTORY : GUIDES_DIRECTORY
  
  ensureDirectoryExists(directory)
  
  const mdxPath = path.join(directory, `${slug}.mdx`)
  const mdPath = path.join(directory, `${slug}.md`)
  
  let fullPath = ''
  if (fs.existsSync(mdxPath)) {
    fullPath = mdxPath
  } else if (fs.existsSync(mdPath)) {
    fullPath = mdPath
  } else {
    return null
  }
  
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)
  
  const stats = readingTime(content)
  
  return {
    slug,
    content,
    readingTime: stats.text,
    excerpt: content.slice(0, 200).replace(/[#*`]/g, '').trim() + '...',
    ...data
  } as BlogPost
}

export function getPostsByCategory(category: string, type: 'blog' | 'guides' = 'blog'): BlogPost[] {
  const posts = getAllPosts(type)
  return posts.filter(post => post.category === category)
}

export function getFeaturedPosts(limit: number = 3, type: 'blog' | 'guides' = 'blog'): BlogPost[] {
  const posts = getAllPosts(type)
  return posts
    .filter(post => post.featured)
    .slice(0, limit)
}

export function getRelatedPosts(currentSlug: string, limit: number = 3, type: 'blog' | 'guides' = 'blog'): BlogPost[] {
  const currentPost = getPostBySlug(currentSlug, type)
  if (!currentPost) return []
  
  const posts = getAllPosts(type)
  return posts
    .filter(post => 
      post.slug !== currentSlug && 
      (post.category === currentPost.category || 
       post.tags?.some(tag => currentPost.tags?.includes(tag)))
    )
    .slice(0, limit)
}

export function searchPosts(query: string, type: 'blog' | 'guides' = 'blog'): BlogPost[] {
  const posts = getAllPosts(type)
  const lowerQuery = query.toLowerCase()
  
  return posts.filter(post => 
    post.title.toLowerCase().includes(lowerQuery) ||
    post.description.toLowerCase().includes(lowerQuery) ||
    post.content.toLowerCase().includes(lowerQuery) ||
    post.tags?.some(tag => tag.toLowerCase().includes(lowerQuery))
  )
}

export function getCategoryWithCount(slug: string): BlogCategory | undefined {
  const category = BLOG_CATEGORIES.find(cat => cat.slug === slug)
  if (!category) return undefined
  
  const posts = getPostsByCategory(slug)
  return {
    ...category,
    count: posts.length
  }
}
