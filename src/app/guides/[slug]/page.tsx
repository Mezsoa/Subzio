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
import { useMDXComponents } from '../../../../mdx-components'

export async function generateStaticParams() {
  const guides = getAllPosts('guides')
  return guides.map((guide) => ({
    slug: guide.slug,
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const guide = getPostBySlug(slug, 'guides')
  
  if (!guide) {
    return {
      title: 'Guide Not Found - KillSub',
    }
  }
  
  return {
    title: guide.seoTitle || `${guide.title} - KillSub Guides`,
    description: guide.seoDescription || guide.description,
    authors: [{ name: guide.author.name }],
    openGraph: {
      title: guide.seoTitle || guide.title,
      description: guide.seoDescription || guide.description,
      type: 'article',
      publishedTime: guide.publishedAt,
      modifiedTime: guide.updatedAt,
      authors: [guide.author.name],
      images: guide.featuredImage ? [guide.featuredImage] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: guide.seoTitle || guide.title,
      description: guide.seoDescription || guide.description,
      images: guide.featuredImage ? [guide.featuredImage] : [],
    },
  }
}

export default async function GuideDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const guide = getPostBySlug(slug, 'guides')
  
  if (!guide) {
    notFound()
  }
  
  const relatedGuides = getRelatedPosts(slug, 3, 'guides')
  
  const mdxOptions = {
    mdxOptions: {
      remarkPlugins: [remarkGfm],
      rehypePlugins: [
        rehypeSlug,
        [rehypeAutolinkHeadings, { behavior: 'wrap' }],
      ],
    },
  }
  
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: guide.title,
    description: guide.description,
    image: guide.featuredImage,
    datePublished: guide.publishedAt,
    dateModified: guide.updatedAt || guide.publishedAt,
    author: {
      '@type': 'Person',
      name: guide.author.name,
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
              <Link href="/guides" className="hover:text-foreground transition">
                Guides
              </Link>
            </li>
            <li aria-hidden>/</li>
            <li className="text-foreground truncate">{guide.title}</li>
          </ol>
        </nav>
        
        {/* Guide Header */}
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-4 text-sm text-muted">
            <span className="px-3 py-1 rounded-full bg-violet-500/10 text-violet-400">
              Guide
            </span>
            <time dateTime={guide.publishedAt}>
              Last updated: {new Date(guide.updatedAt || guide.publishedAt).toLocaleDateString('en-US', { 
                month: 'long', 
                day: 'numeric', 
                year: 'numeric' 
              })}
            </time>
            {guide.readingTime && (
              <>
                <span aria-hidden>•</span>
                <span>{guide.readingTime}</span>
              </>
            )}
          </div>
          
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-semibold tracking-tight text-foreground mb-4">
            {guide.title}
          </h1>
          
          <p className="text-lg text-muted mb-6">
            {guide.description}
          </p>
          
          {/* Table of Contents */}
          <div className="p-6 rounded-lg bg-card border border-card-border mb-8">
            <h2 className="text-lg font-semibold text-foreground mb-3">
              In this guide:
            </h2>
            <ul className="space-y-2 text-sm text-muted">
              <li>✓ Step-by-step instructions</li>
              <li>✓ Screenshots and examples</li>
              <li>✓ Common issues and solutions</li>
              <li>✓ Time to complete: {guide.readingTime}</li>
            </ul>
          </div>
        </header>
        
        {/* Featured Image */}
        {guide.featuredImage && (
          <div className="relative aspect-[16/9] mb-8 rounded-lg overflow-hidden">
            <Image
              src={guide.featuredImage}
              alt={guide.featuredImageAlt || guide.title}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
            />
          </div>
        )}
        
        {/* Guide Content */}
        <div className="prose prose-lg prose-invert max-w-none mb-12">
          <MDXRemote 
            source={guide.content} 
            options={mdxOptions}
            components={useMDXComponents({})}
          />
        </div>
        
        {/* Completion CTA */}
        <div className="p-6 rounded-lg bg-gradient-to-r from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20 mb-8">
          <div className="flex items-start gap-3">
            <span className="text-2xl">✅</span>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-1">
                Completed this guide?
              </h3>
              <p className="text-sm text-muted mb-3">
                Let KillSub automatically handle your subscription management
              </p>
              <Link
                href="/?preorder=true"
                className="inline-flex px-4 py-2 rounded-md bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600 transition"
              >
                Get Started with KillSub
              </Link>
            </div>
          </div>
        </div>
        
        {/* Tags */}
        {guide.tags && guide.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8 pb-8 border-b border-border">
            {guide.tags.map(tag => (
              <Link
                key={tag}
                href={`/guides?tag=${tag}`}
                className="px-3 py-1 rounded-full bg-background/60 border border-border text-sm text-muted hover:text-foreground hover:border-primary/50 transition"
              >
                #{tag}
              </Link>
            ))}
          </div>
        )}
        
        {/* Related Guides */}
        {relatedGuides.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-semibold text-foreground mb-6">
              Related Guides
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedGuides.map(relatedGuide => (
                <BlogCard key={relatedGuide.slug} post={relatedGuide} type="guides" />
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
