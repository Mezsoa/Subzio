# KillSub Blog System Documentation

## Overview

A professional blog system integrated into the KillSub Next.js application, featuring MDX support, SEO optimization, and a finance-appropriate design.

## Features

- **MDX Support**: Rich content with React components in markdown
- **SEO Optimized**: Meta tags, schema markup, and sitemap generation
- **Server Components**: Fast loading with minimal client-side JavaScript
- **Category System**: Organized content by topics
- **Responsive Design**: Mobile-first approach with DaisyUI/Tailwind
- **Search & Filter**: Find content easily
- **Related Posts**: Automatic related content suggestions
- **Newsletter Integration**: Email capture CTAs

## Directory Structure

```
src/
├── app/
│   ├── blog/
│   │   ├── page.tsx              # Blog index with pagination
│   │   └── [slug]/
│   │       └── page.tsx          # Individual blog posts
│   ├── guides/
│   │   ├── page.tsx              # Guides index
│   │   └── [slug]/
│   │       └── page.tsx          # Individual guides
│   └── tools/
│       └── page.tsx              # Interactive tools page
├── components/
│   └── blog/
│       ├── BlogCard.tsx          # Post preview cards
│       ├── BlogNavigation.tsx    # Category navigation
│       └── BlogCta.tsx           # Call-to-action components
└── lib/
    └── blog.ts                   # Blog utilities and helpers

content/
├── blog/                         # Blog post MDX files
└── guides/                       # Guide MDX files
```

## Adding New Blog Posts

### 1. Create MDX File

Create a new `.mdx` file in `/content/blog/`:

```mdx
---
title: "Your Blog Post Title"
description: "A compelling description for SEO and previews"
category: "subscription-audits" # or "stripe-management", "cost-optimization", "compliance"
publishedAt: "2024-01-20"
updatedAt: "2024-01-20"
author:
  name: "Author Name"
  bio: "Brief author bio"
  avatar: "/images/authors/author.jpg" # optional
featuredImage: "/blog/featured-image.jpg"
featuredImageAlt: "Description of the image"
tags: ["tag1", "tag2", "tag3"]
featured: true # Set to true for homepage display
seoTitle: "SEO Optimized Title | KillSub"
seoDescription: "SEO optimized description for search engines"
---

Your markdown content here...

## Heading 2

Regular markdown with **bold** and *italic* text.

### Heading 3

- Bullet points
- Work as expected

1. Numbered lists
2. Also work

> Blockquotes for emphasis

\`\`\`javascript
// Code blocks with syntax highlighting
const example = "Hello World";
\`\`\`

[Links work too](https://example.com)
```

### 2. Add Images

Place images in `/public/blog/` or `/public/guides/`:
- Use WebP format for better performance
- Optimize images before uploading
- Include descriptive alt text

### 3. Categories

Available categories:
- `stripe-management`: Stripe-related content
- `subscription-audits`: Audit guides and tips
- `cost-optimization`: Money-saving strategies
- `compliance`: Regulatory and compliance topics

## Components

### BlogCard

Display post previews:

```tsx
import BlogCard from '@/components/blog/BlogCard'

<BlogCard 
  post={postData} 
  type="blog" // or "guides"
  featured={true} // optional, makes card larger
/>
```

### BlogNavigation

Category navigation with search:

```tsx
import BlogNavigation from '@/components/blog/BlogNavigation'

<BlogNavigation 
  categories={categoriesArray}
  currentCategory="stripe-management" // optional
/>
```

### BlogCta

Call-to-action components:

```tsx
import BlogCta from '@/components/blog/BlogCta'

// Email capture
<BlogCta variant="email" />

// Product promotion
<BlogCta variant="product" category="cost-optimization" />

// Inline CTA
<BlogCta variant="inline" />
```

## Blog Utilities

### Get All Posts

```typescript
import { getAllPosts } from '@/lib/blog'

const posts = getAllPosts('blog') // or 'guides'
```

### Get Post by Slug

```typescript
import { getPostBySlug } from '@/lib/blog'

const post = getPostBySlug('my-post-slug', 'blog')
```

### Get Posts by Category

```typescript
import { getPostsByCategory } from '@/lib/blog'

const posts = getPostsByCategory('stripe-management', 'blog')
```

### Get Featured Posts

```typescript
import { getFeaturedPosts } from '@/lib/blog'

const featured = getFeaturedPosts(3, 'blog') // Get 3 featured posts
```

### Get Related Posts

```typescript
import { getRelatedPosts } from '@/lib/blog'

const related = getRelatedPosts('current-slug', 3, 'blog')
```

### Search Posts

```typescript
import { searchPosts } from '@/lib/blog'

const results = searchPosts('subscription', 'blog')
```

## SEO Optimization

### Meta Tags

Each post automatically generates:
- Open Graph tags
- Twitter Card tags
- Canonical URLs
- Schema.org structured data

### Schema Markup

Blog posts use `BlogPosting` schema:
```json
{
  "@context": "https://schema.org",
  "@type": "BlogPosting",
  "headline": "Post Title",
  "description": "Post Description",
  "datePublished": "2024-01-20",
  "author": {...}
}
```

Guides use `HowTo` schema for better search visibility.

## Styling Guidelines

### Typography

- Headers: `font-semibold tracking-tight`
- Body text: `text-muted leading-relaxed`
- Links: `text-primary hover:brightness-110`

### Colors

Using existing design tokens:
- Primary: `var(--primary)` - X blue (#1d9bf0)
- Background: `var(--background)` - Deep navy
- Foreground: `var(--foreground)` - Near white
- Muted: `var(--muted)` - Slate gray

### Components

Follow existing patterns:
- Cards: `rounded-lg border border-border bg-background/40`
- Buttons: `bg-gradient-to-r from-primary to-primary/80`
- Hover states: `hover:bg-background/60`

## Performance Optimization

### Image Optimization

- Use Next.js Image component
- Provide proper sizes attribute
- Use WebP format
- Lazy load below-the-fold images

### Code Splitting

- MDX content is dynamically imported
- Heavy components are lazy loaded
- Use Suspense boundaries for loading states

## Analytics Integration

Track blog engagement:

```typescript
// Page views
trackEvent('blog_view', {
  post_slug: slug,
  category: category
})

// CTA clicks
trackEvent('blog_cta_click', {
  variant: 'email',
  location: 'post_footer'
})
```

## Deployment

### Build Process

1. MDX files are processed at build time
2. Static pages are generated for all posts
3. RSS feed is automatically generated
4. Sitemap is updated

### Environment Variables

No additional environment variables required for the blog system.

## Maintenance

### Regular Tasks

1. **Weekly**: Add new blog posts
2. **Monthly**: Review analytics and update featured posts
3. **Quarterly**: Audit categories and tags
4. **Annually**: Review and update evergreen content

### Content Calendar

Suggested posting schedule:
- **Monday**: Cost optimization tips
- **Wednesday**: Product updates or guides
- **Friday**: Industry news or compliance updates

## Troubleshooting

### Common Issues

**MDX not rendering:**
- Check frontmatter format
- Ensure all required fields are present
- Validate MDX syntax

**Images not loading:**
- Verify image path starts with `/`
- Check file exists in public directory
- Ensure proper image format

**Build errors:**
- Run `pnpm lint` to check for issues
- Verify all imports are correct
- Check for missing dependencies

## Future Enhancements

Planned improvements:
- [ ] RSS feed generation
- [ ] Comment system integration
- [ ] Advanced search with filters
- [ ] Author pages
- [ ] Reading progress indicator
- [ ] Social sharing buttons
- [ ] Print-friendly versions
- [ ] Email newsletter automation

## Support

For issues or questions about the blog system:
1. Check this documentation
2. Review existing blog posts for examples
3. Test in development environment first
4. Ensure MDX syntax is valid

## Quick Start Checklist

- [x] Blog system installed and configured
- [x] MDX support enabled
- [x] Sample posts created
- [x] Navigation integrated
- [x] Homepage section added
- [ ] Add your first real blog post
- [ ] Configure analytics tracking
- [ ] Set up content calendar
- [ ] Promote on social media
