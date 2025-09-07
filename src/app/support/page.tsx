import Link from "next/link";
import { 
  HelpCircle, 
  MessageCircle, 
  Mail, 
  Book, 
  Video, 
  Search,
  ArrowRight,
  Shield,
  CreditCard,
  Settings,
  Users,
  Zap
} from "lucide-react";

export default function SupportPage() {
  const faqs = [
    {
      question: "How do I connect my bank account?",
      answer: "You can connect your bank account through our secure Plaid or BankID integration. Go to your dashboard and click 'Connect Bank' to get started.",
      category: "Getting Started"
    },
    {
      question: "Is my financial data secure?",
      answer: "Yes! We use bank-grade 256-bit encryption and never store your banking credentials. We only have read-only access to detect subscriptions.",
      category: "Security"
    },
    {
      question: "How accurate is the subscription detection?",
      answer: "Our AI is over 95% accurate at detecting recurring charges. We continuously improve our algorithms based on user feedback.",
      category: "Features"
    },
    {
      question: "Can you cancel subscriptions for me?",
      answer: "Our Business plan includes a 'Cancel for Me' service where our team handles cancellations for you. Pro users get guided cancellation instructions.",
      category: "Cancellation"
    },
    {
      question: "What's the difference between plans?",
      answer: "Free users can connect 1 bank and detect 10 subscriptions. Pro gets unlimited access + insights. Business adds team features + cancellation service.",
      category: "Billing"
    },
    {
      question: "How do I upgrade or cancel my subscription?",
      answer: "You can manage your subscription from your Account page. Upgrades are instant, and you can cancel anytime with no fees.",
      category: "Billing"
    }
  ];

  const categories = [
    {
      name: "Getting Started",
      icon: <Zap className="w-6 h-6" />,
      description: "New to KillSub? Learn the basics",
      articles: 8
    },
    {
      name: "Security & Privacy",
      icon: <Shield className="w-6 h-6" />,
      description: "How we protect your data",
      articles: 5
    },
    {
      name: "Billing & Plans",
      icon: <CreditCard className="w-6 h-6" />,
      description: "Subscription and payment info",
      articles: 6
    },
    {
      name: "Account Settings",
      icon: <Settings className="w-6 h-6" />,
      description: "Manage your account",
      articles: 4
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
              <Link href="/dashboard" className="text-sm text-muted hover:text-foreground transition-colors">
                Dashboard
              </Link>
              <Link href="/account" className="text-sm text-muted hover:text-foreground transition-colors">
                Account
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/5 to-cta-end/5 py-16">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-primary to-cta-end rounded-xl flex items-center justify-center">
              <HelpCircle className="w-8 h-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-foreground mb-4">How can we help you?</h1>
          <p className="text-lg text-muted max-w-2xl mx-auto mb-8">
            Find answers to common questions, browse our help articles, or get in touch with our support team.
          </p>
          
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
            <input
              type="text"
              placeholder="Search for help articles..."
              className="w-full h-14 pl-12 pr-4 bg-background border border-border rounded-xl text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50"
            />
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-6 py-12">
        
        {/* Quick Actions */}
        <section className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <a 
              href="mailto:johnmessoa@gmail.com"
              className="group p-6 bg-card border border-border rounded-xl hover:border-primary/50 transition-all duration-200"
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Email Support</h3>
                  <p className="text-sm text-muted">Get help within 24 hours</p>
                </div>
                <ArrowRight className="w-5 h-5 text-muted group-hover:text-primary transition-colors ml-auto" />
              </div>
            </a>

            <div className="group p-6 bg-card border border-border rounded-xl hover:border-primary/50 transition-all duration-200 cursor-pointer">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <MessageCircle className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Live Chat</h3>
                  <p className="text-sm text-muted">Chat with our team</p>
                </div>
                <ArrowRight className="w-5 h-5 text-muted group-hover:text-primary transition-colors ml-auto" />
              </div>
            </div>

            <div className="group p-6 bg-card border border-border rounded-xl hover:border-primary/50 transition-all duration-200 cursor-pointer">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Video className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">Video Tutorials</h3>
                  <p className="text-sm text-muted">Watch how-to guides</p>
                </div>
                <ArrowRight className="w-5 h-5 text-muted group-hover:text-primary transition-colors ml-auto" />
              </div>
            </div>
          </div>
        </section>

        {/* Help Categories */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-8">Browse by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => (
              <div
                key={index}
                className="group p-6 bg-card border border-border rounded-xl hover:border-primary/50 transition-all duration-200 cursor-pointer"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  {category.icon}
                </div>
                <h3 className="font-semibold text-foreground mb-2">{category.name}</h3>
                <p className="text-sm text-muted mb-3">{category.description}</p>
                <div className="text-xs text-primary font-medium">
                  {category.articles} articles
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Popular FAQs */}
        <section className="mb-16">
          <h2 className="text-2xl font-bold text-foreground mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <details
                key={index}
                className="group bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-colors"
              >
                <summary className="flex items-center justify-between cursor-pointer list-none">
                  <h3 className="font-semibold text-foreground group-open:text-primary transition-colors">
                    {faq.question}
                  </h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                      {faq.category}
                    </span>
                    <ArrowRight className="w-4 h-4 text-muted group-open:rotate-90 transition-transform" />
                  </div>
                </summary>
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-muted leading-relaxed">{faq.answer}</p>
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section className="bg-gradient-to-r from-primary/5 to-cta-end/5 border border-primary/20 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Still need help?</h2>
          <p className="text-muted mb-6 max-w-2xl mx-auto">
            Can't find what you're looking for? Our support team is here to help you get the most out of KillSub.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:johnmessoa@gmail.com"
              className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-cta-start to-cta-end text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
            >
              <Mail className="w-4 h-4 mr-2" />
              Contact Support
            </a>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center px-6 py-3 border border-border text-foreground rounded-lg font-semibold hover:bg-card transition-colors"
            >
              Back to Dashboard
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
