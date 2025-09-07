import Link from "next/link";
import { 
  Book, 
  PlayCircle, 
  FileText, 
  Shield, 
  CreditCard, 
  Settings,
  ArrowRight,
  Clock,
  User
} from "lucide-react";

export default function HelpPage() {
  const articles = [
    {
      title: "Getting Started with KillSub",
      description: "Learn how to set up your account and connect your first bank account",
      category: "Getting Started",
      readTime: "3 min read",
      icon: <Book className="w-5 h-5" />
    },
    {
      title: "How Subscription Detection Works",
      description: "Understand how our AI identifies recurring charges and subscriptions",
      category: "Features",
      readTime: "5 min read",
      icon: <PlayCircle className="w-5 h-5" />
    },
    {
      title: "Security and Privacy Guide",
      description: "Learn about our security measures and how we protect your data",
      category: "Security",
      readTime: "4 min read",
      icon: <Shield className="w-5 h-5" />
    },
    {
      title: "Understanding Your Dashboard",
      description: "Navigate your dashboard and understand all the features available",
      category: "Features",
      readTime: "6 min read",
      icon: <Settings className="w-5 h-5" />
    },
    {
      title: "Billing and Subscription Plans",
      description: "Everything you need to know about our pricing and billing",
      category: "Billing",
      readTime: "3 min read",
      icon: <CreditCard className="w-5 h-5" />
    },
    {
      title: "Canceling Subscriptions",
      description: "Step-by-step guide to cancel unwanted subscriptions",
      category: "Cancellation",
      readTime: "7 min read",
      icon: <FileText className="w-5 h-5" />
    }
  ];

  const videoTutorials = [
    {
      title: "KillSub Overview - 2 Minute Tour",
      description: "Quick overview of all KillSub features",
      duration: "2:15",
      thumbnail: "📺"
    },
    {
      title: "Connecting Your Bank Account",
      description: "Secure bank connection walkthrough",
      duration: "3:45",
      thumbnail: "🏦"
    },
    {
      title: "Reading Your Subscription Report",
      description: "Understanding your monthly reports",
      duration: "4:20",
      thumbnail: "📊"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-cta-end rounded-lg flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold text-foreground">KillSub</span>
            </Link>
            <nav className="flex items-center space-x-6">
              <Link href="/support" className="text-sm text-muted hover:text-foreground transition-colors">
                Support
              </Link>
              <Link href="/dashboard" className="text-sm text-muted hover:text-foreground transition-colors">
                Dashboard
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary/5 to-cta-end/5 py-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-cta-end rounded-xl flex items-center justify-center">
              <Book className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">Help Center</h1>
          <p className="text-lg text-muted max-w-2xl mx-auto">
            Everything you need to know about using KillSub to manage your subscriptions and save money.
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-12">
        
        {/* Quick Start Guide */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-8">Quick Start Guide</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">1. Sign Up</h3>
              <p className="text-sm text-muted">Create your account with Google or email</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">2. Connect Bank</h3>
              <p className="text-sm text-muted">Securely link your bank account</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <PlayCircle className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">3. Detect Subs</h3>
              <p className="text-sm text-muted">AI finds your recurring charges</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">4. Save Money</h3>
              <p className="text-sm text-muted">Cancel unwanted subscriptions</p>
            </div>
          </div>
        </section>

        {/* Video Tutorials */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-8">Video Tutorials</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {videoTutorials.map((video, index) => (
              <div
                key={index}
                className="group bg-card border border-border rounded-xl overflow-hidden hover:border-primary/50 transition-all duration-200 cursor-pointer"
              >
                <div className="aspect-video bg-gradient-to-br from-primary/10 to-cta-end/10 flex items-center justify-center text-4xl">
                  {video.thumbnail}
                </div>
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                      {video.duration}
                    </span>
                    <PlayCircle className="w-5 h-5 text-muted group-hover:text-primary transition-colors" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                    {video.title}
                  </h3>
                  <p className="text-sm text-muted">{video.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Help Articles */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-8">Help Articles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {articles.map((article, index) => (
              <div
                key={index}
                className="group p-6 bg-card border border-border rounded-xl hover:border-primary/50 transition-all duration-200 cursor-pointer"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-primary/20 transition-colors">
                    {article.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                        {article.category}
                      </span>
                      <div className="flex items-center text-xs text-muted">
                        <Clock className="w-3 h-3 mr-1" />
                        {article.readTime}
                      </div>
                    </div>
                    <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                      {article.title}
                    </h3>
                    <p className="text-sm text-muted mb-3">{article.description}</p>
                    <div className="flex items-center text-sm text-primary font-medium">
                      Read article
                      <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Support */}
        <section className="bg-gradient-to-r from-primary/5 to-cta-end/5 border border-primary/20 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Can't find what you're looking for?</h2>
          <p className="text-muted mb-6 max-w-2xl mx-auto">
            Our support team is here to help. Get in touch and we'll get back to you as soon as possible.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/support"
              className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-cta-start to-cta-end text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              Get Support
            </Link>
            <a
              href="mailto:johnmessoa@gmail.com"
              className="inline-flex items-center justify-center px-6 py-3 border border-border text-foreground rounded-lg font-semibold hover:bg-card transition-colors"
            >
              Email Us
            </a>
          </div>
        </section>
      </div>
    </div>
  );
}
