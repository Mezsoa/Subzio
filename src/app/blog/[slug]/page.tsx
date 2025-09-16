import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { MDXRemote } from 'next-mdx-remote/rsc'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import { getPostBySlug, getAllPosts, getRelatedPosts } from '@/lib/blog'
import BlogCard from '@/components/blog/BlogCard'
import BlogCta from '@/components/blog/BlogCta'

export async function generateStaticParams() {
  const posts = getAllPosts('blog')
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug, 'blog')
  
  if (!post) {
    return {
      title: 'Post Not Found - KillSub Blog',
    }
  }
  
  return {
    title: post.seoTitle || `${post.title} - KillSub Blog`,
    description: post.seoDescription || post.description,
    authors: [{ name: post.author.name }],
    openGraph: {
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.description,
      type: 'article',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author.name],
      images: post.featuredImage ? [post.featuredImage] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.seoTitle || post.title,
      description: post.seoDescription || post.description,
      images: post.featuredImage ? [post.featuredImage] : [],
    },
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPostBySlug(slug, 'blog')
  
  if (!post) {
    notFound()
  }
  
  const relatedPosts = getRelatedPosts(slug, 3, 'blog')
  
  const mdxOptions = {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [rehypeAutolinkHeadings, { behavior: 'wrap' }],
    ],
  }
  
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    image: post.featuredImage,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    author: {
      '@type': 'Person',
      name: post.author.name,
    },
    publisher: {
      '@type': 'Organization',
      name: 'KillSub',
      logo: {
        '@type': 'ImageObject',
        url: 'https://killsub.com/logo.png',
      },
    },
  }
  
  return (
    <article className="min-h-screen bg-background">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <nav className="mb-8 text-sm">
          <ol className="flex items-center gap-2 text-muted">
            <li>
              <Link href="/" className="hover:text-foreground transition">
                Home
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li>
              <Link href="/blog" className="hover:text-foreground transition">
                Blog
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li className="text-foreground truncate">{post.title}</li>
          </ol>
        </nav>
        
        {/* Article Header */}
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-4 text-sm text-muted">
            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary">
              {post.category.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </span>
            <time dateTime={post.publishedAt}>
              {new Date(post.publishedAt).toLocaleDateString('en-US', { 
                month: 'long', 
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
          
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-foreground mb-4">
            {post.title}
          </h1>
          
          <p className="text-lg text-muted mb-6">
            {post.description}
          </p>
          
          {/* Author */}
          <div className="flex items-center gap-3 pb-6 border-b border-border">
            {post.author.avatar && (
              <Image
                src={post.author.avatar}
                alt={post.author.name}
                width={48}
                height={48}
                className="rounded-full"
              />
            )}
            <div>
              <p className="font-medium text-foreground">{post.author.name}</p>
              {post.author.bio && (
                <p className="text-sm text-muted">{post.author.bio}</p>
              )}
            </div>
          </div>
        </header>
        
        {/* Featured Image */}
        {post.featuredImage && (
          <div className="relative aspect-[16/9] mb-8 rounded-lg overflow-hidden">
            <Image
              src={post.featuredImage}
              alt={post.featuredImageAlt || post.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
            />
          </div>
        )}
        
        {/* Article Content */}
        <div className="prose prose-lg prose-invert max-w-none mb-12">
          <MDXRemote 
            source={post.content} 
            components={{}}
          />
        </div>
        
        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8 pb-8 border-b border-border">
            {post.tags.map(tag => (
              <Link
                key={tag}
                href={`/blog?tag=${tag}`}
                className="px-3 py-1 rounded-full bg-background/60 border border-border text-sm text-muted hover:text-foreground hover:border-primary/50 transition"
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}
        
        {/* Inline CTA */}
        <BlogCta variant="inline" category={post.category} />
        
        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-semibold text-foreground mb-6">
              Related Articles
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map(relatedPost => (
                <BlogCard key={relatedPost.slug} post={relatedPost} />
              ))}
            </div>
          </section>
        )}
        
        {/* Newsletter CTA */}
        <BlogCta variant="email" />
      </div>
    </article>
  )
}
