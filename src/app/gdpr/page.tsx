import Link from "next/link";
import { Shield, Globe, Download, Trash2, Edit, Eye, Mail, CheckCircle, Clock, Users } from "lucide-react";

export default function GDPRPage() {
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
              GDPR Compliance Center
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
                <Globe className="w-6 h-6 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-foreground">GDPR Compliance</h1>
            <p className="text-lg text-muted max-w-2xl mx-auto">
              Your data rights under the General Data Protection Regulation and how to exercise them with KillSub.
            </p>
          </div>

          {/* GDPR Rights Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-card border border-border rounded-xl p-6 text-center">
              <Eye className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold text-foreground mb-2">Right to Access</h3>
              <p className="text-sm text-muted">See what data we have</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-6 text-center">
              <Edit className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold text-foreground mb-2">Right to Rectify</h3>
              <p className="text-sm text-muted">Correct your data</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-6 text-center">
              <Trash2 className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold text-foreground mb-2">Right to Erase</h3>
              <p className="text-sm text-muted">Delete your data</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-6 text-center">
              <Download className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold text-foreground mb-2">Data Portability</h3>
              <p className="text-sm text-muted">Export your data</p>
            </div>
          </div>

          {/* Content sections */}
          <div className="prose prose-slate max-w-none">
            <div className="space-y-8">
              
              {/* Section 1 */}
              <section className="bg-card border border-border rounded-xl p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Globe className="w-4 h-4 text-primary" />
                  </div>
                  <h2 className="text-2xl font-semibold text-foreground">What is GDPR?</h2>
                </div>
                
                <div className="space-y-4 text-muted text-sm">
                  <p>The General Data Protection Regulation (GDPR) is a comprehensive data protection law that came into effect in May 2018. It gives EU residents control over their personal data and how it's processed by organizations.</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-500 mb-2" />
                      <h4 className="font-medium text-foreground mb-1">Enhanced Rights</h4>
                      <p className="text-xs">Stronger control over personal data</p>
                    </div>
                    <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-500 mb-2" />
                      <h4 className="font-medium text-foreground mb-1">Transparency</h4>
                      <p className="text-xs">Clear information about data processing</p>
                    </div>
                    <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                      <CheckCircle className="w-5 h-5 text-green-500 mb-2" />
                      <h4 className="font-medium text-foreground mb-1">Accountability</h4>
                      <p className="text-xs">Organizations must prove compliance</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 2 */}
              <section className="bg-card border border-border rounded-xl p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Eye className="w-4 h-4 text-primary" />
                  </div>
                  <h2 className="text-2xl font-semibold text-foreground">Right to Access (Article 15)</h2>
                </div>
                
                <div className="space-y-4 text-muted text-sm">
                  <p>You have the right to know what personal data we process about you, how we use it, and who we share it with.</p>
                  
                  <div className="bg-background/50 rounded-lg p-4">
                    <h4 className="font-medium text-foreground mb-3">What you can request:</h4>
                    <ul className="space-y-2">
                      <li>• Confirmation that we process your personal data</li>
                      <li>• A copy of your personal data in a readable format</li>
                      <li>• Information about how we use your data</li>
                      <li>• Details about who we share your data with</li>
                      <li>• How long we keep your data</li>
                      <li>• Information about your other GDPR rights</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-green-500/5 border border-green-500/20 rounded-lg">
                    <p><strong>How to request:</strong> Email us at <a href="mailto:johnmessoa@gmail.com" className="text-primary hover:underline">johnmessoa@gmail.com</a> with "Data Access Request" in the subject line. We'll respond within 30 days.</p>
                  </div>
                </div>
              </section>

              {/* Section 3 */}
              <section className="bg-card border border-border rounded-xl p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Edit className="w-4 h-4 text-primary" />
                  </div>
                  <h2 className="text-2xl font-semibold text-foreground">Right to Rectification (Article 16)</h2>
                </div>
                
                <div className="space-y-4 text-muted text-sm">
                  <p>You can ask us to correct inaccurate or incomplete personal data we hold about you.</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-background/50 rounded-lg p-4">
                      <h4 className="font-medium text-foreground mb-2">Examples of rectification:</h4>
                      <ul className="space-y-1">
                        <li>• Correcting your email address</li>
                        <li>• Updating your name</li>
                        <li>• Fixing incorrect transaction categorization</li>
                        <li>• Completing missing information</li>
                      </ul>
                    </div>
                    <div className="bg-background/50 rounded-lg p-4">
                      <h4 className="font-medium text-foreground mb-2">Our response:</h4>
                      <ul className="space-y-1">
                        <li>• We'll verify the correction request</li>
                        <li>• Update your data if the request is valid</li>
                        <li>• Notify any third parties if necessary</li>
                        <li>• Confirm the changes with you</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 4 */}
              <section className="bg-card border border-border rounded-xl p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 bg-red-500/10 rounded-lg flex items-center justify-center">
                    <Trash2 className="w-4 h-4 text-red-500" />
                  </div>
                  <h2 className="text-2xl font-semibold text-foreground">Right to Erasure (Article 17)</h2>
                </div>
                
                <div className="space-y-4 text-muted text-sm">
                  <p>Also known as the "right to be forgotten," you can request deletion of your personal data under certain circumstances.</p>
                  
                  <div className="bg-background/50 rounded-lg p-4">
                    <h4 className="font-medium text-foreground mb-3">When you can request erasure:</h4>
                    <ul className="space-y-2">
                      <li>• The data is no longer necessary for the original purpose</li>
                      <li>• You withdraw consent and there's no other legal basis</li>
                      <li>• You object to processing and there are no overriding legitimate grounds</li>
                      <li>• Your data has been unlawfully processed</li>
                      <li>• Erasure is required for compliance with legal obligations</li>
                    </ul>
                  </div>
                  
                  <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-lg">
                    <h4 className="font-medium text-foreground mb-2">Important Note:</h4>
                    <p>We may not be able to delete all data immediately if we have a legal obligation to retain it (e.g., financial records for tax purposes). We'll explain any limitations in our response.</p>
                  </div>
                </div>
              </section>

              {/* Section 5 */}
              <section className="bg-card border border-border rounded-xl p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Download className="w-4 h-4 text-primary" />
                  </div>
                  <h2 className="text-2xl font-semibold text-foreground">Right to Data Portability (Article 20)</h2>
                </div>
                
                <div className="space-y-4 text-muted text-sm">
                  <p>You can request a copy of your data in a structured, machine-readable format, or ask us to transfer it directly to another service provider.</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-background/50 rounded-lg p-4">
                      <h4 className="font-medium text-foreground mb-2">What we can export:</h4>
                      <ul className="space-y-1">
                        <li>• Your account information</li>
                        <li>• Subscription data and preferences</li>
                        <li>• Transaction categorizations you've made</li>
                        <li>• Dashboard settings and customizations</li>
                      </ul>
                    </div>
                    <div className="bg-background/50 rounded-lg p-4">
                      <h4 className="font-medium text-foreground mb-2">Export formats:</h4>
                      <ul className="space-y-1">
                        <li>• JSON (structured data)</li>
                        <li>• CSV (spreadsheet format)</li>
                        <li>• XML (machine-readable)</li>
                        <li>• PDF (human-readable report)</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 6 */}
              <section className="bg-card border border-border rounded-xl p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Users className="w-4 h-4 text-primary" />
                  </div>
                  <h2 className="text-2xl font-semibold text-foreground">Other GDPR Rights</h2>
                </div>
                
                <div className="space-y-6 text-muted text-sm">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-background/50 rounded-lg p-4">
                      <h4 className="font-medium text-foreground mb-2">Right to Restrict Processing</h4>
                      <p>You can ask us to limit how we use your data in certain situations, such as when you contest the accuracy of the data.</p>
                    </div>
                    <div className="bg-background/50 rounded-lg p-4">
                      <h4 className="font-medium text-foreground mb-2">Right to Object</h4>
                      <p>You can object to processing based on legitimate interests, direct marketing, or processing for research purposes.</p>
                    </div>
                    <div className="bg-background/50 rounded-lg p-4">
                      <h4 className="font-medium text-foreground mb-2">Automated Decision-Making</h4>
                      <p>You have rights regarding automated decision-making, including profiling. Our AI analysis is designed to assist, not replace human judgment.</p>
                    </div>
                    <div className="bg-background/50 rounded-lg p-4">
                      <h4 className="font-medium text-foreground mb-2">Right to Complain</h4>
                      <p>You can lodge a complaint with your local data protection authority if you believe we've violated your rights.</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 7 */}
              <section className="bg-card border border-border rounded-xl p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Clock className="w-4 h-4 text-primary" />
                  </div>
                  <h2 className="text-2xl font-semibold text-foreground">Response Timeframes</h2>
                </div>
                
                <div className="space-y-4 text-muted text-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-4 font-medium text-foreground">Request Type</th>
                          <th className="text-left py-3 px-4 font-medium text-foreground">Response Time</th>
                          <th className="text-left py-3 px-4 font-medium text-foreground">Extension Possible</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-border/50">
                          <td className="py-3 px-4">Data Access Request</td>
                          <td className="py-3 px-4">30 days</td>
                          <td className="py-3 px-4">+60 days (complex cases)</td>
                        </tr>
                        <tr className="border-b border-border/50">
                          <td className="py-3 px-4">Data Rectification</td>
                          <td className="py-3 px-4">30 days</td>
                          <td className="py-3 px-4">+60 days (complex cases)</td>
                        </tr>
                        <tr className="border-b border-border/50">
                          <td className="py-3 px-4">Data Erasure</td>
                          <td className="py-3 px-4">30 days</td>
                          <td className="py-3 px-4">+60 days (complex cases)</td>
                        </tr>
                        <tr className="border-b border-border/50">
                          <td className="py-3 px-4">Data Portability</td>
                          <td className="py-3 px-4">30 days</td>
                          <td className="py-3 px-4">+60 days (large datasets)</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                    <p><strong>Our Commitment:</strong> We aim to respond to most requests within 5-10 business days. If we need more time, we'll let you know why and when you can expect a full response.</p>
                  </div>
                </div>
              </section>

              {/* Action section */}
              <section className="bg-gradient-to-r from-primary/5 to-cta-end/5 border border-primary/20 rounded-xl p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Mail className="w-4 h-4 text-primary" />
                  </div>
                  <h2 className="text-2xl font-semibold text-foreground">Exercise Your Rights</h2>
                </div>
                
                <div className="space-y-6 text-muted text-sm">
                  <p>Ready to exercise your GDPR rights? Here's how to get started:</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-medium text-foreground">Email Us</h4>
                      <div className="bg-background/50 rounded-lg p-4">
                        <p className="mb-2">Send your request to:</p>
                        <a href="mailto:johnmessoa@gmail.com" className="flex items-center space-x-2 text-primary hover:underline">
                          <Mail className="w-4 h-4" />
                          <span>johnmessoa@gmail.com</span>
                        </a>
                        <p className="mt-2 text-xs">Include "GDPR Request" in the subject line</p>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h4 className="font-medium text-foreground">What to Include</h4>
                      <div className="bg-background/50 rounded-lg p-4">
                        <ul className="space-y-1 text-xs">
                          <li>• Your full name and email address</li>
                          <li>• Specific right you want to exercise</li>
                          <li>• Any relevant details or context</li>
                          <li>• Proof of identity (if requested)</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-green-500/5 border border-green-500/20 rounded-lg">
                    <p><strong>Free of Charge:</strong> Exercising your GDPR rights is completely free. We may only charge a reasonable fee for manifestly unfounded or excessive requests.</p>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
