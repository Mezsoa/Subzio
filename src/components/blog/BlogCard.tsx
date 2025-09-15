import Link from 'next/link'
import Image from 'next/image'
import { BlogPost } from '@/lib/blog'

interface BlogCardProps {
  post: BlogPost
  type?: 'blog' | 'guides'
  featured?: boolean
}

export default function BlogCard({ post, type = 'blog', featured = false }: BlogCardProps) {
  const href = `/${type}/${post.slug}`
  
  return (
    <article 
      className={`group relative rounded-lg border border-border bg-background/40 overflow-hidden transition-all hover:bg-background/60 hover:border-primary/50 ${
        featured ? 'col-span-full md:col-span-2' : ''
      }`}
    >
      {post.featuredImage && (
        <Link href={href} className="block relative aspect-[16/9] overflow-hidden">
          <Image
            src={post.featuredImage}
            alt={post.featuredImageAlt || post.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes={featured ? "(max-width: 768px) 100vw, 66vw" : "(max-width: 768px) 100vw, 33vw"}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </Link>
      )}
      
      <div className="p-5">
        <div className="flex items-center gap-3 mb-3 text-xs text-muted">
          <span className="px-2 py-1 rounded-full bg-primary/10 text-primary">
            {post.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </span>
          <time dateTime={post.publishedAt}>
            {new Date(post.publishedAt).toLocaleDateString('en-US', { 
              month: 'short', 
              day: 'numeric', 
              year: 'numeric' 
            })}
          </time>
          {post.readingTime && (
            <>
              <span aria-hidden>•</span>
              <span>{post.readingTime}</span>
            </>
          )}
        </div>
        
        <Link href={href} className="block group">
          <h3 className={`font-semibold text-foreground mb-2 group-hover:text-primary transition-colors ${
            featured ? 'text-xl sm:text-2xl' : 'text-lg'
          }`}>
            {post.title}
          </h3>
        </Link>
        
        <p className="text-sm text-muted line-clamp-3 mb-4">
          {post.description || post.excerpt}
        </p>
        
        <div className="flex items-center justify-between">
          {post.author && (
            <div className="flex items-center gap-2">
              {post.author.avatar && (
                <Image
                  src={post.author.avatar}
                  alt={post.author.name}
                  width={24}
                  height={24}
                  className="rounded-full"
                />
              )}
              <span className="text-xs text-muted">{post.author.name}</span>
            </div>
          )}
          
          <Link 
            href={href} 
            className="text-sm text-primary hover:brightness-110 font-medium inline-flex items-center gap-1 transition"
          >
            Read more
            <svg 
              className="w-4 h-4 transition-transform group-hover:translate-x-1" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  )
}
