import Link from "next/link";
import { Shield, Mail, Lock, Eye, UserCheck, Globe, Clock, FileText } from "lucide-react";

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-cta-end rounded-lg flex items-center justify-center">
                <Shield className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold text-foreground">KillSub</span>
            </Link>
            <div className="text-sm text-muted">
              Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="space-y-12">
          {/* Title section */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-cta-end rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-foreground">Privacy Policy</h1>
            <p className="text-lg text-muted max-w-2xl mx-auto">
              Your privacy is paramount. This policy explains how we collect, use, and protect your personal information in compliance with GDPR and other privacy regulations.
            </p>
          </div>

          {/* Quick overview cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-card border border-border rounded-xl p-6 text-center">
              <Lock className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold text-foreground mb-2">Bank-Grade Security</h3>
              <p className="text-sm text-muted">256-bit encryption protects all your data</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-6 text-center">
              <UserCheck className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold text-foreground mb-2">GDPR Compliant</h3>
              <p className="text-sm text-muted">Full compliance with EU data protection laws</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-6 text-center">
              <Eye className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold text-foreground mb-2">Transparent</h3>
              <p className="text-sm text-muted">Clear information about data usage</p>
            </div>
          </div>

          {/* Content sections */}
          <div className="prose prose-slate max-w-none">
            <div className="space-y-8">
              
              {/* Section 1 */}
              <section className="bg-card border border-border rounded-xl p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <FileText className="w-4 h-4 text-primary" />
                  </div>
                  <h2 className="text-2xl font-semibold text-foreground">1. Information We Collect</h2>
                </div>
                
                <div className="space-y-6 text-muted">
                  <div>
                    <h3 className="text-lg font-medium text-foreground mb-3">Personal Information</h3>
                    <ul className="space-y-2 text-sm">
                      <li>• Email address (for account creation and communication)</li>
                      <li>• Name (optional, for personalization)</li>
                      <li>• IP address (for security and analytics)</li>
                      <li>• Browser and device information (for compatibility)</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-foreground mb-3">Financial Data</h3>
                    <ul className="space-y-2 text-sm">
                      <li>• Bank account information (via secure Plaid/BankID integration)</li>
                      <li>• Transaction data (to identify subscriptions)</li>
                      <li>• Subscription information (amounts, frequencies, merchants)</li>
                    </ul>
                    <div className="mt-4 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                      <p className="text-sm"><strong>Important:</strong> We never store your banking credentials. All financial data access is handled through secure, regulated third-party providers (Plaid, BankID).</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 2 */}
              <section className="bg-card border border-border rounded-xl p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Lock className="w-4 h-4 text-primary" />
                  </div>
                  <h2 className="text-2xl font-semibold text-foreground">2. How We Use Your Information</h2>
                </div>
                
                <div className="space-y-4 text-muted text-sm">
                  <div>
                    <h3 className="text-lg font-medium text-foreground mb-3">Primary Uses</h3>
                    <ul className="space-y-2">
                      <li>• <strong>Subscription Detection:</strong> Analyze transactions to identify recurring charges</li>
                      <li>• <strong>Service Provision:</strong> Provide cancellation guidance and subscription management</li>
                      <li>• <strong>Account Management:</strong> Maintain your account and preferences</li>
                      <li>• <strong>Communication:</strong> Send service updates and important notifications</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-foreground mb-3">Analytics & Improvement</h3>
                    <ul className="space-y-2">
                      <li>• Improve our AI algorithms for better subscription detection</li>
                      <li>• Analyze usage patterns to enhance user experience</li>
                      <li>• Generate anonymized insights about subscription trends</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Section 3 - GDPR Rights */}
              <section className="bg-card border border-border rounded-xl p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Globe className="w-4 h-4 text-primary" />
                  </div>
                  <h2 className="text-2xl font-semibold text-foreground">3. Your GDPR Rights</h2>
                </div>
                
                <div className="space-y-4 text-muted text-sm">
                  <p>Under the General Data Protection Regulation (GDPR), you have the following rights:</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-background/50 rounded-lg">
                      <h4 className="font-medium text-foreground mb-2">Right to Access</h4>
                      <p>Request a copy of all personal data we hold about you</p>
                    </div>
                    <div className="p-4 bg-background/50 rounded-lg">
                      <h4 className="font-medium text-foreground mb-2">Right to Rectification</h4>
                      <p>Request correction of inaccurate or incomplete data</p>
                    </div>
                    <div className="p-4 bg-background/50 rounded-lg">
                      <h4 className="font-medium text-foreground mb-2">Right to Erasure</h4>
                      <p>Request deletion of your personal data ("right to be forgotten")</p>
                    </div>
                    <div className="p-4 bg-background/50 rounded-lg">
                      <h4 className="font-medium text-foreground mb-2">Right to Portability</h4>
                      <p>Request transfer of your data to another service</p>
                    </div>
                  </div>
                  
                  <div className="mt-6 p-4 bg-primary/5 border border-primary/20 rounded-lg">
                    <p><strong>To exercise your rights:</strong> Contact us at <a href="mailto:johnmessoa@gmail.com" className="text-primary hover:underline">johnmessoa@gmail.com</a> with your request. We will respond within 30 days.</p>
                  </div>
                </div>
              </section>

              {/* Section 4 */}
              <section className="bg-card border border-border rounded-xl p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <UserCheck className="w-4 h-4 text-primary" />
                  </div>
                  <h2 className="text-2xl font-semibold text-foreground">4. Data Sharing & Third Parties</h2>
                </div>
                
                <div className="space-y-4 text-muted text-sm">
                  <div>
                    <h3 className="text-lg font-medium text-foreground mb-3">We Share Data With:</h3>
                    <ul className="space-y-3">
                      <li>• <strong>Plaid & BankID:</strong> Secure financial data providers (GDPR compliant)</li>
                      <li>• <strong>Cloud Providers:</strong> AWS/Google Cloud for secure data storage</li>
                      <li>• <strong>Analytics:</strong> Google Analytics (anonymized data only)</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-red-500/5 border border-red-500/20 rounded-lg">
                    <h4 className="font-medium text-foreground mb-2">We Never Share:</h4>
                    <ul className="space-y-1">
                      <li>• Personal data with advertisers</li>
                      <li>• Financial data with unauthorized parties</li>
                      <li>• Data for marketing purposes without consent</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Section 5 */}
              <section className="bg-card border border-border rounded-xl p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Clock className="w-4 h-4 text-primary" />
                  </div>
                  <h2 className="text-2xl font-semibold text-foreground">5. Data Retention</h2>
                </div>
                
                <div className="space-y-4 text-muted text-sm">
                  <ul className="space-y-2">
                    <li>• <strong>Account Data:</strong> Retained while your account is active</li>
                    <li>• <strong>Transaction Data:</strong> Retained for 2 years for service improvement</li>
                    <li>• <strong>Analytics Data:</strong> Anonymized and retained for 3 years</li>
                    <li>• <strong>Deleted Accounts:</strong> All data permanently deleted within 30 days</li>
                  </ul>
                </div>
              </section>

              {/* Contact section */}
              <section className="bg-gradient-to-r from-primary/5 to-cta-end/5 border border-primary/20 rounded-xl p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Mail className="w-4 h-4 text-primary" />
                  </div>
                  <h2 className="text-2xl font-semibold text-foreground">Contact Our Data Protection Officer</h2>
                </div>
                
                <div className="space-y-4 text-muted text-sm">
                  <p>For any privacy-related questions or to exercise your GDPR rights:</p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <a href="mailto:johnmessoa@gmail.com" className="flex items-center space-x-2 text-primary hover:underline">
                      <Mail className="w-4 h-4" />
                      <span>johnmessoa@gmail.com</span>
                    </a>
                  </div>
                  <p className="text-xs">We aim to respond to all privacy inquiries within 72 hours and fulfill GDPR requests within 30 days.</p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
