'use client'

import { useState } from 'react'
import Link from 'next/link'

interface BlogCtaProps {
  variant?: 'email' | 'product' | 'inline'
  category?: string
}

export default function BlogCta({ variant = 'email', category }: BlogCtaProps) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  
  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    
    try {
      const res = await fetch('/api/waitlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'blog' }),
      })
      
      if (!res.ok) throw new Error('Failed to subscribe')
      
      setStatus('success')
      setEmail('')
    } catch (error) {
      setStatus('error')
    }
  }
  
  if (variant === 'inline') {
    return (
      <div className="my-8 p-6 rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-1">
              Ready to kill unnecessary subscriptions?
            </h3>
            <p className="text-sm text-muted">
              Join thousands saving money with KillSub
            </p>
          </div>
          <Link
            href="/?preorder=true"
            className="px-5 py-2.5 rounded-md bg-gradient-to-r from-primary to-primary/80 text-on-primary text-sm font-semibold hover:brightness-110 transition"
          >
            Get Started - $19/year
          </Link>
        </div>
      </div>
    )
  }
  
  if (variant === 'product') {
    const ctaText = category === 'stripe-management' 
      ? 'Manage Your Stripe Subscriptions'
      : category === 'cost-optimization'
      ? 'Start Saving Money Today'
      : 'Take Control of Your Subscriptions'
    
    return (
      <div className="my-12 p-8 rounded-lg bg-card border border-card-border">
        <div className="text-center max-w-2xl mx-auto">
          <h3 className="text-2xl font-semibold text-foreground mb-3">
            {ctaText}
          </h3>
          <p className="text-base text-muted mb-6">
            KillSub automatically finds and helps you cancel unwanted subscriptions. 
            Save an average of $300/year with our intelligent detection system.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="px-6 py-3 rounded-md bg-gradient-to-r from-primary to-primary/80 text-on-primary font-semibold hover:brightness-110 transition"
            >
              Pre-order Now - 60% Off
            </Link>
            <Link
              href="/guides"
              className="px-6 py-3 rounded-md border border-border text-foreground font-medium hover:bg-background/60 transition"
            >
              Learn More
            </Link>
          </div>
        </div>
      </div>
    )
  }
  
  // Email capture variant
  return (
    <div className="my-12 p-8 rounded-lg bg-gradient-to-br from-card to-background border border-card-border">
      <div className="max-w-xl mx-auto text-center">
        <h3 className="text-xl font-semibold text-foreground mb-3">
          Get subscription management tips
        </h3>
        <p className="text-sm text-muted mb-6">
          Join our newsletter for weekly tips on managing subscriptions and saving money
        </p>
        
        <form onSubmit={handleEmailSubmit} className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            disabled={status === 'loading' || status === 'success'}
            className="flex-1 h-11 px-4 rounded-md border border-border bg-background text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/20 transition disabled:opacity-60"
          />
          <button
            type="submit"
            disabled={status === 'loading' || status === 'success'}
            className="h-11 px-6 rounded-md bg-gradient-to-r from-primary to-primary/80 text-on-primary text-sm font-semibold hover:brightness-110 transition disabled:opacity-60"
          >
            {status === 'loading' ? 'Subscribing...' : status === 'success' ? 'Subscribed!' : 'Subscribe'}
          </button>
        </form>
        
        {status === 'error' && (
          <p className="mt-3 text-sm text-red-500">
            Something went wrong. Please try again.
          </p>
        )}
        
        <p className="mt-4 text-xs text-muted">
          No spam. Unsubscribe anytime.
        </p>
      </div>
    </div>
  )
}
