import Link from "next/link";
import { Shield, Cookie, Settings, BarChart3, Lock, CheckCircle, XCircle, AlertCircle } from "lucide-react";

export default function CookiePolicyPage() {
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
                <Cookie className="w-6 h-6 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-foreground">Cookie Policy</h1>
            <p className="text-lg text-muted max-w-2xl mx-auto">
              Learn how we use cookies and similar technologies to improve your experience and protect your privacy.
            </p>
          </div>

          {/* Quick overview cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-card border border-border rounded-xl p-6 text-center">
              <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-3" />
              <h3 className="font-semibold text-foreground mb-2">Essential Only</h3>
              <p className="text-sm text-muted">We only use necessary cookies by default</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-6 text-center">
              <Settings className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold text-foreground mb-2">Full Control</h3>
              <p className="text-sm text-muted">Manage your cookie preferences easily</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-6 text-center">
              <Lock className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold text-foreground mb-2">Privacy First</h3>
              <p className="text-sm text-muted">GDPR compliant cookie practices</p>
            </div>
          </div>

          {/* Content sections */}
          <div className="prose prose-slate max-w-none">
            <div className="space-y-8">
              
              {/* Section 1 */}
              <section className="bg-card border border-border rounded-xl p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Cookie className="w-4 h-4 text-primary" />
                  </div>
                  <h2 className="text-2xl font-semibold text-foreground">1. What Are Cookies?</h2>
                </div>
                
                <div className="space-y-4 text-muted text-sm">
                  <p>Cookies are small text files stored on your device when you visit our website. They help us provide you with a better experience by remembering your preferences and enabling essential functionality.</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-background/50 rounded-lg">
                      <h4 className="font-medium text-foreground mb-2">First-Party Cookies</h4>
                      <p>Set by KillSub directly for core functionality</p>
                    </div>
                    <div className="p-4 bg-background/50 rounded-lg">
                      <h4 className="font-medium text-foreground mb-2">Third-Party Cookies</h4>
                      <p>Set by our trusted partners for analytics</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 2 */}
              <section className="bg-card border border-border rounded-xl p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 bg-green-500/10 rounded-lg flex items-center justify-center">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  </div>
                  <h2 className="text-2xl font-semibold text-foreground">2. Essential Cookies</h2>
                </div>
                
                <div className="space-y-4 text-muted text-sm">
                  <p>These cookies are necessary for the website to function properly and cannot be disabled.</p>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-4 font-medium text-foreground">Cookie Name</th>
                          <th className="text-left py-3 px-4 font-medium text-foreground">Purpose</th>
                          <th className="text-left py-3 px-4 font-medium text-foreground">Duration</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-border/50">
                          <td className="py-3 px-4 font-mono text-xs">auth-token</td>
                          <td className="py-3 px-4">Maintains your login session</td>
                          <td className="py-3 px-4">30 days</td>
                        </tr>
                        <tr className="border-b border-border/50">
                          <td className="py-3 px-4 font-mono text-xs">csrf-token</td>
                          <td className="py-3 px-4">Security protection against attacks</td>
                          <td className="py-3 px-4">Session</td>
                        </tr>
                        <tr className="border-b border-border/50">
                          <td className="py-3 px-4 font-mono text-xs">preferences</td>
                          <td className="py-3 px-4">Stores your dashboard settings</td>
                          <td className="py-3 px-4">1 year</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  
                  <div className="p-4 bg-green-500/5 border border-green-500/20 rounded-lg">
                    <p><strong>Note:</strong> Essential cookies are automatically accepted as they're required for the service to work properly.</p>
                  </div>
                </div>
              </section>

              {/* Section 3 */}
              <section className="bg-card border border-border rounded-xl p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <BarChart3 className="w-4 h-4 text-primary" />
                  </div>
                  <h2 className="text-2xl font-semibold text-foreground">3. Analytics Cookies</h2>
                </div>
                
                <div className="space-y-4 text-muted text-sm">
                  <p>These cookies help us understand how visitors interact with our website. <strong>These are optional and require your consent.</strong></p>
                  
                  <div className="space-y-4">
                    <div className="p-4 bg-background/50 rounded-lg">
                      <h4 className="font-medium text-foreground mb-2 flex items-center space-x-2">
                        <span>Google Analytics</span>
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">Optional</span>
                      </h4>
                      <p className="mb-3">Helps us understand user behavior and improve our service.</p>
                      <div className="text-xs space-y-1">
                        <div className="flex justify-between">
                          <span>Cookie: _ga, _ga_*</span>
                          <span>Duration: 2 years</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Purpose: User analytics</span>
                          <span>Provider: Google</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-4 bg-background/50 rounded-lg">
                      <h4 className="font-medium text-foreground mb-2 flex items-center space-x-2">
                        <span>Hotjar</span>
                        <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded">Optional</span>
                      </h4>
                      <p className="mb-3">Records user interactions to help improve user experience.</p>
                      <div className="text-xs space-y-1">
                        <div className="flex justify-between">
                          <span>Cookie: _hjid, _hjSession*</span>
                          <span>Duration: 1 year</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Purpose: UX analytics</span>
                          <span>Provider: Hotjar</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              {/* Section 4 */}
              <section className="bg-card border border-border rounded-xl p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 bg-amber-500/10 rounded-lg flex items-center justify-center">
                    <AlertCircle className="w-4 h-4 text-amber-500" />
                  </div>
                  <h2 className="text-2xl font-semibold text-foreground">4. Marketing Cookies</h2>
                </div>
                
                <div className="space-y-4 text-muted text-sm">
                  <div className="p-4 bg-amber-500/5 border border-amber-500/20 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <XCircle className="w-4 h-4 text-amber-500" />
                      <h4 className="font-medium text-foreground">We Don't Use Marketing Cookies</h4>
                    </div>
                    <p>KillSub does not use cookies for advertising, tracking across websites, or building marketing profiles. Your browsing behavior on our site stays private.</p>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-foreground mb-3">What This Means:</h3>
                    <ul className="space-y-2">
                      <li>• No targeted advertising based on your activity</li>
                      <li>• No selling of your data to advertisers</li>
                      <li>• No cross-site tracking</li>
                      <li>• No behavioral profiling for marketing</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* Section 5 */}
              <section className="bg-card border border-border rounded-xl p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Settings className="w-4 h-4 text-primary" />
                  </div>
                  <h2 className="text-2xl font-semibold text-foreground">5. Managing Your Cookie Preferences</h2>
                </div>
                
                <div className="space-y-6 text-muted text-sm">
                  <div>
                    <h3 className="text-lg font-medium text-foreground mb-3">Cookie Consent Banner</h3>
                    <p>When you first visit our website, you'll see a cookie banner where you can:</p>
                    <ul className="space-y-2 mt-2">
                      <li>• Accept all cookies (including optional analytics)</li>
                      <li>• Accept only essential cookies</li>
                      <li>• Customize your preferences</li>
                    </ul>
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-medium text-foreground mb-3">Browser Settings</h3>
                    <p>You can also manage cookies through your browser settings:</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                      <div className="p-3 bg-background/50 rounded-lg">
                        <h4 className="font-medium text-foreground mb-1">Chrome</h4>
                        <p className="text-xs">Settings → Privacy → Cookies</p>
                      </div>
                      <div className="p-3 bg-background/50 rounded-lg">
                        <h4 className="font-medium text-foreground mb-1">Firefox</h4>
                        <p className="text-xs">Preferences → Privacy → Cookies</p>
                      </div>
                      <div className="p-3 bg-background/50 rounded-lg">
                        <h4 className="font-medium text-foreground mb-1">Safari</h4>
                        <p className="text-xs">Preferences → Privacy → Cookies</p>
                      </div>
                      <div className="p-3 bg-background/50 rounded-lg">
                        <h4 className="font-medium text-foreground mb-1">Edge</h4>
                        <p className="text-xs">Settings → Privacy → Cookies</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                    <h4 className="font-medium text-foreground mb-2">Change Your Mind?</h4>
                    <p>You can update your cookie preferences at any time by clicking the "Cookie Settings" link in our footer or contacting us at johnmessoa@gmail.com.</p>
                  </div>
                </div>
              </section>

              {/* Section 6 */}
              <section className="bg-card border border-border rounded-xl p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Lock className="w-4 h-4 text-primary" />
                  </div>
                  <h2 className="text-2xl font-semibold text-foreground">6. GDPR Compliance</h2>
                </div>
                
                <div className="space-y-4 text-muted text-sm">
                  <p>Our cookie practices comply with the General Data Protection Regulation (GDPR) and ePrivacy Directive:</p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-green-500/5 border border-green-500/20 rounded-lg">
                      <h4 className="font-medium text-foreground mb-2">✓ Lawful Basis</h4>
                      <p>Essential cookies: Legitimate interest</p>
                      <p>Analytics cookies: Your consent</p>
                    </div>
                    <div className="p-4 bg-green-500/5 border border-green-500/20 rounded-lg">
                      <h4 className="font-medium text-foreground mb-2">✓ Transparency</h4>
                      <p>Clear information about all cookies</p>
                      <p>Easy-to-understand purposes</p>
                    </div>
                    <div className="p-4 bg-green-500/5 border border-green-500/20 rounded-lg">
                      <h4 className="font-medium text-foreground mb-2">✓ Control</h4>
                      <p>Granular consent options</p>
                      <p>Easy withdrawal of consent</p>
                    </div>
                    <div className="p-4 bg-green-500/5 border border-green-500/20 rounded-lg">
                      <h4 className="font-medium text-foreground mb-2">✓ Data Minimization</h4>
                      <p>Only necessary data collection</p>
                      <p>Appropriate retention periods</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* Contact section */}
              <section className="bg-gradient-to-r from-primary/5 to-cta-end/5 border border-primary/20 rounded-xl p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Cookie className="w-4 h-4 text-primary" />
                  </div>
                  <h2 className="text-2xl font-semibold text-foreground">Questions About Cookies?</h2>
                </div>
                
                <div className="space-y-4 text-muted text-sm">
                  <p>If you have any questions about our use of cookies or want to exercise your rights:</p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <a href="mailto:johnmessoa@gmail.com" className="flex items-center space-x-2 text-primary hover:underline">
                      <Cookie className="w-4 h-4" />
                      <span>johnmessoa@gmail.com</span>
                    </a>
                  </div>
                  <p className="text-xs">We're committed to transparency and will respond to your cookie-related questions promptly.</p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
