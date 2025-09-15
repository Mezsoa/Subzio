import { Metadata } from 'next'
import { Suspense } from 'react'
import BlogCard from '@/components/blog/BlogCard'
import BlogNavigation from '@/components/blog/BlogNavigation'
import BlogCta from '@/components/blog/BlogCta'
import { getAllPosts, BLOG_CATEGORIES, getPostsByCategory } from '@/lib/blog'

export const metadata: Metadata = {
  title: 'Blog - KillSub | Subscription Management Tips & Guides',
  description: 'Learn how to manage subscriptions, save money, and take control of your recurring payments with expert tips and guides from KillSub.',
  openGraph: {
    title: 'Blog - KillSub | Subscription Management Tips',
    description: 'Expert guides on managing subscriptions and saving money',
    type: 'website',
  },
}

interface BlogPageProps {
  searchParams: Promise<{ category?: string; page?: string }>
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams
  const currentCategory = params.category
  const currentPage = parseInt(params.page || '1', 10)
  const postsPerPage = 9
  
  // Get posts based on category filter
  const allPosts = currentCategory 
    ? getPostsByCategory(currentCategory, 'blog')
    : getAllPosts('blog')
  
  // Calculate pagination
  const totalPosts = allPosts.length
  const totalPages = Math.ceil(totalPosts / postsPerPage)
  const startIndex = (currentPage - 1) * postsPerPage
  const endIndex = startIndex + postsPerPage
  const posts = allPosts.slice(startIndex, endIndex)
  
  // Get categories with counts
  const categoriesWithCounts = BLOG_CATEGORIES.map(cat => ({
    ...cat,
    count: getPostsByCategory(cat.slug, 'blog').length
  }))
  
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <header className="mb-12 text-center">
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-foreground mb-4">
            Subscription Management Blog
          </h1>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            Expert tips, guides, and insights to help you take control of your subscriptions and save money
          </p>
        </header>
        
        {/* Navigation */}
        <BlogNavigation 
          categories={categoriesWithCounts} 
          currentCategory={currentCategory}
        />
        
        {/* Blog Grid */}
        <Suspense fallback={<BlogGridSkeleton />}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {posts.map((post, index) => (
              <BlogCard 
                key={post.slug} 
                post={post} 
                featured={index === 0 && currentPage === 1 && !currentCategory}
              />
            ))}
          </div>
        </Suspense>
        
        {/* No posts message */}
        {posts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-muted">No posts found in this category.</p>
          </div>
        )}
        
        {/* Pagination */}
        {totalPages > 1 && (
          <nav className="flex justify-center gap-2 mb-12">
            {currentPage > 1 && (
              <a
                href={`/blog?${currentCategory ? `category=${currentCategory}&` : ''}page=${currentPage - 1}`}
                className="px-4 py-2 rounded-md border border-border text-sm text-muted hover:text-foreground hover:bg-background/60 transition"
              >
                Previous
              </a>
            )}
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <a
                key={page}
                href={`/blog?${currentCategory ? `category=${currentCategory}&` : ''}page=${page}`}
                className={`px-4 py-2 rounded-md text-sm transition ${
                  page === currentPage
                    ? 'bg-primary text-on-primary'
                    : 'border border-border text-muted hover:text-foreground hover:bg-background/60'
                }`}
              >
                {page}
              </a>
            ))}
            
            {currentPage < totalPages && (
              <a
                href={`/blog?${currentCategory ? `category=${currentCategory}&` : ''}page=${currentPage + 1}`}
                className="px-4 py-2 rounded-md border border-border text-sm text-muted hover:text-foreground hover:bg-background/60 transition"
              >
                Next
              </a>
            )}
          </nav>
        )}
        
        {/* CTA Section */}
        <BlogCta variant="product" category={currentCategory} />
      </div>
    </div>
  )
}

function BlogGridSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
      {[...Array(6)].map((_, i) => (
        <div key={i} className="rounded-lg border border-border bg-background/40 p-5 animate-pulse">
          <div className="aspect-[16/9] bg-muted/20 rounded mb-4" />
          <div className="h-4 bg-muted/20 rounded w-1/3 mb-3" />
          <div className="h-6 bg-muted/20 rounded mb-2" />
          <div className="h-4 bg-muted/20 rounded mb-1" />
          <div className="h-4 bg-muted/20 rounded w-2/3" />
        </div>
      ))}
    </div>
  )
}
