import Link from "next/link";
import { Shield, FileText, AlertTriangle, CheckCircle, XCircle, Scale, Users, CreditCard } from "lucide-react";

export default function TermsOfServicePage() {
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
              Effective: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
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
                <FileText className="w-6 h-6 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-foreground">Terms of Service</h1>
            <p className="text-lg text-muted max-w-2xl mx-auto">
              These terms govern your use of KillSub and establish the legal relationship between you and our service.
            </p>
          </div>

          {/* Quick overview cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-card border border-border rounded-xl p-6 text-center">
              <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-3" />
              <h3 className="font-semibold text-foreground mb-2">Fair Terms</h3>
              <p className="text-sm text-muted">Transparent and user-friendly conditions</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-6 text-center">
              <Scale className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold text-foreground mb-2">Legal Compliance</h3>
              <p className="text-sm text-muted">Fully compliant with EU and US laws</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-6 text-center">
              <Users className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold text-foreground mb-2">User Rights</h3>
              <p className="text-sm text-muted">Clear rights and responsibilities</p>
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
                  <h2 className="text-2xl font-semibold text-foreground">1. Acceptance of Terms</h2>
                </div>
                
                <div className="space-y-4 text-muted text-sm">
                  <p>By accessing and using KillSub ("the Service"), you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use our service.</p>
                  
                  <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                    <p><strong>Important:</strong> These terms may be updated from time to time. We will notify users of significant changes via email and by posting the updated terms on our website.</p>
                  </div>
                </div>
              </section>

              {/* Section 2 */}
              <section className="bg-card border border-border rounded-xl p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Users className="w-4 h-4 text-primary" />
                  </div>
                  <h2 className="text-2xl font-semibold text-foreground">2. Service Description</h2>
                </div>
                
                <div className="space-y-4 text-muted text-sm">
                  <div>
                    <h3 className="text-lg font-medium text-foreground mb-3">What KillSub Provides:</h3>
                    <ul className="space-y-2">
                      <li>• AI-powered analysis of your financial transactions to identify subscriptions</li>
                      <li>• Guidance and resources to help you cancel unwanted subscriptions</li>
                      <li>• Dashboard to track and manage your recurring payments</li>
                      <li>• Alerts for new or changed subscription charges</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-foreground mb-3">What We Don't Do:</h3>
                    <ul className="space-y-2">
                      <li>• We do not cancel subscriptions on your behalf</li>
                      <li>• We do not provide financial advice or recommendations</li>
                      <li>• We do not guarantee successful cancellation of any service</li>
                      <li>• We are not responsible for third-party subscription policies</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Section 3 */}
              <section className="bg-card border border-border rounded-xl p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <CreditCard className="w-4 h-4 text-primary" />
                  </div>
                  <h2 className="text-2xl font-semibold text-foreground">3. Financial Data Access</h2>
                </div>
                
                <div className="space-y-4 text-muted text-sm">
                  <div>
                    <h3 className="text-lg font-medium text-foreground mb-3">Bank Connection Authorization</h3>
                    <p>By connecting your bank account through Plaid or BankID, you authorize us to:</p>
                    <ul className="space-y-2 mt-2">
                      <li>• Access your transaction history for subscription analysis</li>
                      <li>• Retrieve account balance information</li>
                      <li>• Monitor new transactions for subscription detection</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-green-500/5 border border-green-500/20 rounded-lg">
                    <h4 className="font-medium text-foreground mb-2">Security Guarantee:</h4>
                    <ul className="space-y-1">
                      <li>• We never store your banking credentials</li>
                      <li>• All data is encrypted with bank-grade security</li>
                      <li>• You can revoke access at any time</li>
                      <li>• We use only regulated financial data providers</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Section 4 */}
              <section className="bg-card border border-border rounded-xl p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-primary" />
                  </div>
                  <h2 className="text-2xl font-semibold text-foreground">4. User Responsibilities</h2>
                </div>
                
                <div className="space-y-4 text-muted text-sm">
                  <div>
                    <h3 className="text-lg font-medium text-foreground mb-3">You Agree To:</h3>
                    <ul className="space-y-2">
                      <li>• Provide accurate and current information</li>
                      <li>• Use the service only for lawful purposes</li>
                      <li>• Maintain the security of your account credentials</li>
                      <li>• Notify us immediately of any unauthorized access</li>
                      <li>• Respect the intellectual property rights of KillSub</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-foreground mb-3">You Will Not:</h3>
                    <ul className="space-y-2">
                      <li>• Attempt to gain unauthorized access to our systems</li>
                      <li>• Use automated tools to scrape or extract data</li>
                      <li>• Share your account with unauthorized users</li>
                      <li>• Reverse engineer or decompile our software</li>
                      <li>• Use the service to harm others or violate laws</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Section 5 */}
              <section className="bg-card border border-border rounded-xl p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Scale className="w-4 h-4 text-primary" />
                  </div>
                  <h2 className="text-2xl font-semibold text-foreground">5. Limitation of Liability</h2>
                </div>
                
                <div className="space-y-4 text-muted text-sm">
                  <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-lg">
                    <h4 className="font-medium text-foreground mb-2">Service Disclaimer:</h4>
                    <p>KillSub is provided "as is" without warranties of any kind. We do not guarantee:</p>
                    <ul className="space-y-1 mt-2">
                      <li>• Complete accuracy of subscription detection</li>
                      <li>• Successful cancellation of any service</li>
                      <li>• Uninterrupted service availability</li>
                      <li>• Prevention of all unwanted charges</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-foreground mb-3">Liability Limits</h3>
                    <p>Our liability is limited to the maximum extent permitted by law. In no event shall KillSub be liable for indirect, incidental, special, or consequential damages.</p>
                  </div>
                </div>
              </section>

              {/* Section 6 */}
              <section className="bg-card border border-border rounded-xl p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <XCircle className="w-4 h-4 text-primary" />
                  </div>
                  <h2 className="text-2xl font-semibold text-foreground">6. Account Termination</h2>
                </div>
                
                <div className="space-y-4 text-muted text-sm">
                  <div>
                    <h3 className="text-lg font-medium text-foreground mb-3">Your Right to Terminate</h3>
                    <p>You may terminate your account at any time by:</p>
                    <ul className="space-y-2 mt-2">
                      <li>• Contacting us at johnmessoa@gmail.com</li>
                      <li>• Using the account deletion feature in your dashboard</li>
                      <li>• Following the cancellation process in our app</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-foreground mb-3">Our Right to Terminate</h3>
                    <p>We may suspend or terminate accounts that:</p>
                    <ul className="space-y-2 mt-2">
                      <li>• Violate these terms of service</li>
                      <li>• Engage in fraudulent or harmful activity</li>
                      <li>• Remain inactive for extended periods</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                    <p><strong>Data Deletion:</strong> Upon account termination, all your personal data will be permanently deleted within 30 days, in accordance with our Privacy Policy.</p>
                  </div>
                </div>
              </section>

              {/* Section 7 */}
              <section className="bg-card border border-border rounded-xl p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4 text-primary" />
                  </div>
                  <h2 className="text-2xl font-semibold text-foreground">7. Governing Law</h2>
                </div>
                
                <div className="space-y-4 text-muted text-sm">
                  <p>These terms are governed by the laws of the European Union and the jurisdiction where our company is registered. Any disputes will be resolved through:</p>
                  <ul className="space-y-2">
                    <li>• Good faith negotiation</li>
                    <li>• Mediation if necessary</li>
                    <li>• Arbitration as a final resort</li>
                  </ul>
                  
                  <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                    <p><strong>EU Users:</strong> Nothing in these terms affects your statutory rights as a consumer under EU law.</p>
                  </div>
                </div>
              </section>

              {/* Contact section */}
              <section className="bg-gradient-to-r from-primary/5 to-cta-end/5 border border-primary/20 rounded-xl p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <FileText className="w-4 h-4 text-primary" />
                  </div>
                  <h2 className="text-2xl font-semibold text-foreground">Questions About These Terms?</h2>
                </div>
                
                <div className="space-y-4 text-muted text-sm">
                  <p>If you have any questions about these Terms of Service, please contact us:</p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <a href="mailto:johnmessoa@gmail.com" className="flex items-center space-x-2 text-primary hover:underline">
                      <FileText className="w-4 h-4" />
                      <span>johnmessoa@gmail.com</span>
                    </a>
                  </div>
                  <p className="text-xs">We're committed to maintaining fair and transparent terms that protect both our users and our service.</p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
