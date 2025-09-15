'use client'
import Link from 'next/link'
import { useState } from 'react'


const tools = [
  {
    id: 'subscription-calculator',
    name: 'Subscription Cost Calculator',
    description: 'Calculate your total monthly and yearly subscription costs',
    icon: '🧮',
    status: 'available',
    href: '#calculator',
  },
  {
    id: 'savings-estimator',
    name: 'Savings Estimator',
    description: 'Estimate how much you could save by canceling unused subscriptions',
    icon: '💰',
    status: 'available',
    href: '#savings',
  },
  {
    id: 'cancellation-templates',
    name: 'Cancellation Email Templates',
    description: 'Professional email templates for canceling subscriptions',
    icon: '📧',
    status: 'available',
    href: '#templates',
  },
  {
    id: 'subscription-audit',
    name: 'Subscription Audit Checklist',
    description: 'Comprehensive checklist to audit all your subscriptions',
    icon: '📋',
    status: 'coming-soon',
    href: '#',
  },
  {
    id: 'negotiation-guide',
    name: 'Negotiation Script Generator',
    description: 'Generate scripts to negotiate better subscription rates',
    icon: '💬',
    status: 'coming-soon',
    href: '#',
  },
  {
    id: 'comparison-tool',
    name: 'Service Comparison Tool',
    description: 'Compare similar subscription services to find the best value',
    icon: '⚖️',
    status: 'coming-soon',
    href: '#',
  },
]



export default function ToolsPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <header className="mb-12 text-center">
          <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-foreground mb-4">
            Free Subscription Management Tools
          </h1>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            Powerful tools and resources to help you take control of your subscriptions and save money
          </p>
        </header>
        
        {/* Tools Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {tools.map(tool => (
            <div
              key={tool.id}
              className={`relative rounded-lg border bg-background/40 p-6 transition-all ${
                tool.status === 'available' 
                  ? 'border-border hover:bg-background/60 hover:border-primary/50' 
                  : 'border-border/50 opacity-60'
              }`}
            >
              {tool.status === 'coming-soon' && (
                <div className="absolute top-3 right-3 px-2 py-1 rounded-full bg-amber-500/10 text-amber-400 text-xs font-medium">
                  Coming Soon
                </div>
              )}
              
              <div className="text-3xl mb-3">{tool.icon}</div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                {tool.name}
              </h3>
              <p className="text-sm text-muted mb-4">
                {tool.description}
              </p>
              
              {tool.status === 'available' ? (
                <a
                  href={tool.href}
                  className="inline-flex items-center text-sm text-primary hover:brightness-110 font-medium transition"
                >
                  Use Tool
                  <svg 
                    className="w-4 h-4 ml-1" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              ) : (
                <span className="text-sm text-muted">
                  Available soon
                </span>
              )}
            </div>
          ))}
        </div>
        
        {/* Subscription Calculator Tool */}
        <section id="calculator" className="mb-16">
          <h2 className="text-2xl font-semibold text-foreground mb-6">
            Subscription Cost Calculator
          </h2>
          <div className="rounded-lg bg-card border border-card-border p-8">
            <SubscriptionCalculator />
          </div>
        </section>
        
        {/* Savings Estimator Tool */}
        <section id="savings" className="mb-16">
          <h2 className="text-2xl font-semibold text-foreground mb-6">
            Savings Estimator
          </h2>
          <div className="rounded-lg bg-card border border-card-border p-8">
            <SavingsEstimator />
          </div>
        </section>
        
        {/* Email Templates */}
        <section id="templates" className="mb-16">
          <h2 className="text-2xl font-semibold text-foreground mb-6">
            Cancellation Email Templates
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <EmailTemplate 
              title="Standard Cancellation"
              description="Professional template for canceling any subscription"
              template={`Subject: Request to Cancel Subscription - [Your Name]

Dear [Company Name] Support Team,

I am writing to request the immediate cancellation of my subscription (Account ID: [Your Account ID]).

Please confirm the cancellation and the date when it will take effect. I would also appreciate confirmation that no further charges will be made to my account.

Thank you for your assistance.

Best regards,
[Your Name]`}
            />
            
            <EmailTemplate 
              title="Refund Request"
              description="Template for requesting a refund after cancellation"
              template={`Subject: Subscription Cancellation and Refund Request

Dear [Company Name] Billing Department,

I recently canceled my subscription but was charged on [Date]. As per your refund policy, I am requesting a full refund for this charge.

Account Details:
- Account Email: [Your Email]
- Charge Date: [Date]
- Amount: [Amount]

Please process this refund and confirm once completed.

Thank you,
[Your Name]`}
            />
          </div>
        </section>
        
        {/* CTA Section */}
        <div className="mt-16 p-8 rounded-lg bg-gradient-to-r from-primary/10 to-primary/5 border border-primary/20 text-center">
          <h3 className="text-2xl font-semibold text-foreground mb-3">
            Want to automate all of this?
          </h3>
          <p className="text-base text-muted mb-6 max-w-2xl mx-auto">
            KillSub automatically finds, tracks, and helps you cancel unwanted subscriptions. 
            Save time and money with our intelligent detection system.
          </p>
          <Link
            href="/?preorder=true"
            className="inline-flex px-6 py-3 rounded-md bg-gradient-to-r from-primary to-primary/80 text-on-primary font-semibold hover:brightness-110 transition"
          >
            Get KillSub - Save 60% Today
          </Link>
        </div>
      </div>
    </div>
  )
}

// Interactive Calculator Component
function SubscriptionCalculator() {
  const [subscriptions, setSubscriptions] = useState<{ name: string; cost: number }[]>([])
  const [name, setName] = useState('')
  const [cost, setCost] = useState('')
  
  const addSubscription = () => {
    if (name && cost) {
      setSubscriptions([...subscriptions, { name, cost: parseFloat(cost) }])
      setName('')
      setCost('')
    }
  }
  
  const monthlyTotal = subscriptions.reduce((sum, sub) => sum + sub.cost, 0)
  const yearlyTotal = monthlyTotal * 12
  
  return (
    <div className="space-y-6">
      <p className="text-muted">
        Add your subscriptions below to calculate your total costs:
      </p>
      
      <div className="space-y-3">
        {subscriptions.map((sub, index) => (
          <div key={index} className="flex justify-between items-center p-3 bg-background/60 rounded-md">
            <span className="text-sm text-foreground">{sub.name}</span>
            <span className="text-sm font-medium text-primary">${sub.cost.toFixed(2)}/mo</span>
          </div>
        ))}
        
        <div className="flex gap-3">
          <input
            type="text"
            placeholder="Subscription name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex-1 h-10 px-3 rounded-md border border-border bg-background text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <input
            type="number"
            placeholder="Monthly cost"
            value={cost}
            onChange={(e) => setCost(e.target.value)}
            className="w-32 h-10 px-3 rounded-md border border-border bg-background text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <button 
            onClick={addSubscription}
            className="px-4 h-10 rounded-md bg-primary text-on-primary text-sm font-medium hover:brightness-110 transition"
          >
            Add
          </button>
        </div>
      </div>
      
      <div className="pt-6 border-t border-border">
        <div className="flex justify-between items-center mb-2">
          <span className="text-muted">Monthly Total:</span>
          <span className="text-xl font-semibold text-foreground">${monthlyTotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-muted">Yearly Total:</span>
          <span className="text-2xl font-semibold text-primary">${yearlyTotal.toFixed(2)}</span>
        </div>
      </div>
      
      <p className="text-xs text-muted text-center">
        Note: This is a demo calculator. Sign up for KillSub to get automatic subscription detection.
      </p>
    </div>
  )
}

// Savings Estimator Component
function SavingsEstimator() {
  const [numSubscriptions, setNumSubscriptions] = useState(10)
  const [avgCost, setAvgCost] = useState(20)
  
  // Calculate potential savings (assuming 20-30% are unused)
  const unusedPercentage = 0.25
  const estimatedUnused = Math.round(numSubscriptions * unusedPercentage)
  const yearlySavings = estimatedUnused * avgCost * 12
  
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          How many subscriptions do you have? ({numSubscriptions})
        </label>
        <input
          type="range"
          min="1"
          max="30"
          value={numSubscriptions}
          onChange={(e) => setNumSubscriptions(parseInt(e.target.value))}
          className="w-full"
        />
        <div className="flex justify-between text-xs text-muted mt-1">
          <span>1</span>
          <span>15</span>
          <span>30+</span>
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Average monthly cost per subscription
        </label>
        <select 
          value={avgCost}
          onChange={(e) => setAvgCost(parseInt(e.target.value))}
          className="w-full h-10 px-3 rounded-md border border-border bg-background text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          <option value="10">$10</option>
          <option value="20">$20</option>
          <option value="30">$30</option>
          <option value="50">$50+</option>
        </select>
      </div>
      
      <div className="p-6 rounded-lg bg-gradient-to-r from-emerald-500/10 to-emerald-500/5 border border-emerald-500/20">
        <p className="text-sm text-muted mb-2">Estimated yearly savings:</p>
        <p className="text-3xl font-bold text-emerald-400">${yearlySavings.toLocaleString()}</p>
        <p className="text-xs text-muted mt-2">
          Based on average users canceling {estimatedUnused} unused subscriptions
        </p>
      </div>
    </div>
  )
}

// Email Template Component
function EmailTemplate({ title, description, template }: { 
  title: string
  description: string
  template: string 
}) {
  const [copied, setCopied] = useState(false)
  
  const handleCopy = () => {
    navigator.clipboard.writeText(template)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  
  return (
    <div className="rounded-lg border border-border bg-background/40 p-6">
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-sm text-muted mb-4">{description}</p>
      
      <pre className="p-4 rounded-md bg-card text-xs text-muted overflow-x-auto whitespace-pre-wrap">
        {template}
      </pre>
      
      <button 
        onClick={handleCopy}
        className="mt-4 px-4 py-2 rounded-md border border-border text-sm text-muted hover:text-foreground hover:bg-background/60 transition"
      >
        {copied ? 'Copied!' : 'Copy Template'}
      </button>
    </div>
  )
}
