'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BlogCategory } from '@/lib/blog'

interface BlogNavigationProps {
  categories: BlogCategory[]
  currentCategory?: string
}

export default function BlogNavigation({ categories, currentCategory }: BlogNavigationProps) {
  const pathname = usePathname()
  const isGuides = pathname.includes('/guides')
  
  return (
    <nav className="mb-8">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <Link 
            href="/blog" 
            className={`text-sm font-medium transition ${
              pathname === '/blog' && !currentCategory
                ? 'text-foreground' 
                : 'text-muted hover:text-foreground'
            }`}
          >
            All Posts
          </Link>
          <Link 
            href="/guides" 
            className={`text-sm font-medium transition ${
              isGuides 
                ? 'text-foreground' 
                : 'text-muted hover:text-foreground'
            }`}
          >
            Guides
          </Link>
          <Link 
            href="/tools" 
            className={`text-sm font-medium transition ${
              pathname === '/tools' 
                ? 'text-foreground' 
                : 'text-muted hover:text-foreground'
            }`}
          >
            Tools
          </Link>
        </div>
        
        <div className="flex items-center gap-2">
          <input
            type="search"
            placeholder="Search articles..."
            className="w-48 sm:w-64 h-9 px-3 rounded-md border border-border bg-background text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 transition"
            id="blog-search"
          />
          <button 
            type="button"
            className="h-9 px-4 rounded-md border border-border text-sm text-muted hover:text-foreground hover:bg-background/60 transition"
            onClick={() => {
              const searchInput = document.getElementById('blog-search') as HTMLInputElement
              if (searchInput) {
                // Implement search functionality
                console.log('Search:', searchInput.value)
              }
            }}
          >
            Search
          </button>
        </div>
      </div>
      
      <div className="flex flex-wrap gap-2">
        {categories.map(category => (
          <Link
            key={category.slug}
            href={`/blog?category=${category.slug}`}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition ${
              currentCategory === category.slug
                ? 'bg-primary text-on-primary'
                : 'bg-background/60 border border-border text-muted hover:text-foreground hover:border-primary/50'
            }`}
          >
            {category.name}
            {category.count !== undefined && (
              <span className="ml-1.5 opacity-70">({category.count})</span>
            )}
          </Link>
        ))}
      </div>
    </nav>
  )
}
