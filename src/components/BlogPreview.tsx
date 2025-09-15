import Link from 'next/link'
import { getFeaturedPosts } from '@/lib/blog'
import BlogCard from '@/components/blog/BlogCard'

export default async function BlogPreview() {
  const featuredPosts = getFeaturedPosts(3, 'blog')
  
  // If no featured posts, get the latest 3
  const posts = featuredPosts.length > 0 ? featuredPosts : getFeaturedPosts(3, 'blog')
  
  if (posts.length === 0) {
    return null
  }
  
  return (
    <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 bg-transparent">
      <div className="text-center mb-12">
        <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-foreground mb-3">
          Learn to Master Your Subscriptions
        </h2>
        <p className="text-base text-muted max-w-2xl mx-auto">
          Expert tips and guides to help you save money and take control of your recurring payments
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {posts.map(post => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>
      
      <div className="text-center">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md border border-border text-foreground font-medium hover:bg-background/60 hover:border-primary/50 transition"
        >
          View All Articles
          <svg 
            className="w-4 h-4" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </section>
  )
}
