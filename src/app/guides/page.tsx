import { Metadata } from 'next'
import BlogCard from '@/components/blog/BlogCard'
import BlogCta from '@/components/blog/BlogCta'
import { getAllPosts } from '@/lib/blog'

export const metadata: Metadata = {
  title: 'Guides - KillSub | How to Cancel Subscriptions & Save Money',
  description: 'Step-by-step guides on canceling subscriptions, managing recurring payments, and optimizing your subscription spending.',
  openGraph: {
    title: 'Subscription Management Guides - KillSub',
    description: 'Learn how to cancel subscriptions and save money with our detailed guides',
    type: 'website',
  },
}

export default async function GuidesPage() {
  const guides = getAllPosts('guides')
  
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <header className="mb-12 text-center">
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-foreground mb-4">
            Subscription Management Guides
          </h1>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            Detailed step-by-step guides to help you cancel subscriptions, negotiate better rates, and take control of your recurring payments
          </p>
        </header>
        
        {/* Featured Guides Categories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="p-6 rounded-lg bg-gradient-to-br from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20">
            <div className="text-3xl mb-3">💰</div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Save Money
            </h3>
            <p className="text-sm text-muted">
              Learn strategies to reduce subscription costs by 50% or more
            </p>
          </div>
          
          <div className="p-6 rounded-lg bg-gradient-to-br from-amber-500/10 to-amber-500/5 border border-amber-500/20">
            <div className="text-3xl mb-3">📋</div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Audit Subscriptions
            </h3>
            <p className="text-sm text-muted">
              Discover hidden subscriptions and forgotten free trials
            </p>
          </div>
          
          <div className="p-6 rounded-lg bg-gradient-to-br from-violet-500/10 to-violet-500/5 border border-violet-500/20">
            <div className="text-3xl mb-3">🚫</div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Cancel Services
            </h3>
            <p className="text-sm text-muted">
              Step-by-step cancellation guides for major services
            </p>
          </div>
        </div>
        
        {/* Guides Grid */}
        <section>
          <h2 className="text-2xl font-semibold text-foreground mb-6">
            All Guides
          </h2>
          
          {guides.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {guides.map(guide => (
                <BlogCard key={guide.slug} post={guide} type="guides" />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-card rounded-lg border border-card-border">
              <p className="text-lg text-muted mb-4">
                Guides are coming soon!
              </p>
              <p className="text-sm text-muted">
                We're working on comprehensive guides to help you manage your subscriptions.
              </p>
            </div>
          )}
        </section>
        
        {/* CTA Section */}
        <BlogCta variant="product" />
      </div>
    </div>
  )
}
