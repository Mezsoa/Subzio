import Link from "next/link";
import { Shield, Lock, Eye, Users, AlertTriangle, CheckCircle, FileText, Clock } from "lucide-react";

export default function SecurityPolicyPage() {
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
            <h1 className="text-4xl font-bold text-foreground">Information Security Policy</h1>
            <p className="text-lg text-muted max-w-2xl mx-auto">
              Our comprehensive security framework ensures the protection of your financial data and personal information in compliance with industry standards and regulations.
            </p>
          </div>

          {/* Quick overview cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-card border border-border rounded-xl p-6 text-center">
              <Lock className="w-8 h-8 text-green-500 mx-auto mb-3" />
              <h3 className="font-semibold text-foreground mb-2">Bank-Grade Security</h3>
              <p className="text-sm text-muted">256-bit encryption and secure data handling</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-6 text-center">
              <Eye className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold text-foreground mb-2">Read-Only Access</h3>
              <p className="text-sm text-muted">We never store your banking credentials</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-6 text-center">
              <Users className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold text-foreground mb-2">SOC 2 Compliant</h3>
              <p className="text-sm text-muted">Enterprise-grade security standards</p>
            </div>
          </div>

          {/* Content sections */}
          <div className="prose prose-slate max-w-none">
            
            {/* Section 1 */}
            <section className="bg-card border border-border rounded-xl p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Shield className="w-4 h-4 text-primary" />
                </div>
                <h2 className="text-2xl font-semibold text-foreground">1. Security Framework</h2>
              </div>
              
              <div className="space-y-4 text-muted text-sm">
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-3">Data Protection Standards</h3>
                  <ul className="space-y-2">
                    <li>• <strong>Encryption at Rest:</strong> All data encrypted using AES-256</li>
                    <li>• <strong>Encryption in Transit:</strong> TLS 1.3 for all communications</li>
                    <li>• <strong>Secure Key Management:</strong> Keys stored in secure, encrypted vaults</li>
                    <li>• <strong>Regular Security Audits:</strong> Quarterly penetration testing</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-3">Access Controls</h3>
                  <ul className="space-y-2">
                    <li>• <strong>Multi-Factor Authentication:</strong> Required for all admin access</li>
                    <li>• <strong>Role-Based Access:</strong> Principle of least privilege</li>
                    <li>• <strong>Session Management:</strong> Automatic timeout and secure session handling</li>
                    <li>• <strong>Audit Logging:</strong> All access attempts logged and monitored</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 2 */}
            <section className="bg-card border border-border rounded-xl p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Lock className="w-4 h-4 text-primary" />
                </div>
                <h2 className="text-2xl font-semibold text-foreground">2. Financial Data Security</h2>
              </div>
              
              <div className="space-y-4 text-muted text-sm">
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-3">Banking Integration</h3>
                  <ul className="space-y-2">
                    <li>• <strong>Plaid Integration:</strong> Bank-level security through certified provider</li>
                    <li>• <strong>BankID/Tink:</strong> European banking standards compliance</li>
                    <li>• <strong>Read-Only Access:</strong> We never store banking credentials</li>
                    <li>• <strong>Token-Based:</strong> Secure access tokens with automatic rotation</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-3">Data Handling</h3>
                  <ul className="space-y-2">
                    <li>• <strong>Minimal Data Collection:</strong> Only necessary financial data</li>
                    <li>• <strong>Secure Processing:</strong> Data processed in encrypted environments</li>
                    <li>• <strong>Regular Purging:</strong> Old data automatically removed per policy</li>
                    <li>• <strong>Anonymization:</strong> Personal identifiers removed from analytics</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 3 */}
            <section className="bg-card border border-border rounded-xl p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4 text-primary" />
                </div>
                <h2 className="text-2xl font-semibold text-foreground">3. Incident Response</h2>
              </div>
              
              <div className="space-y-4 text-muted text-sm">
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-3">Response Procedures</h3>
                  <ul className="space-y-2">
                    <li>• <strong>24/7 Monitoring:</strong> Automated security monitoring</li>
                    <li>• <strong>Incident Classification:</strong> Severity-based response protocols</li>
                    <li>• <strong>User Notification:</strong> Immediate notification of security incidents</li>
                    <li>• <strong>Regulatory Reporting:</strong> Compliance with breach notification laws</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-3">Recovery Procedures</h3>
                  <ul className="space-y-2">
                    <li>• <strong>Backup Systems:</strong> Daily encrypted backups</li>
                    <li>• <strong>Disaster Recovery:</strong> 4-hour recovery time objective</li>
                    <li>• <strong>Business Continuity:</strong> Minimal service disruption</li>
                    <li>• <strong>Post-Incident Review:</strong> Lessons learned and improvements</li>
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
                <h2 className="text-2xl font-semibold text-foreground">4. Compliance & Certifications</h2>
              </div>
              
              <div className="space-y-4 text-muted text-sm">
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-3">Regulatory Compliance</h3>
                  <ul className="space-y-2">
                    <li>• <strong>GDPR:</strong> European data protection compliance</li>
                    <li>• <strong>CCPA:</strong> California consumer privacy compliance</li>
                    <li>• <strong>PCI DSS:</strong> Payment card industry standards</li>
                    <li>• <strong>SOX:</strong> Financial reporting compliance</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-3">Third-Party Security</h3>
                  <ul className="space-y-2">
                    <li>• <strong>Vendor Assessment:</strong> Security evaluation of all partners</li>
                    <li>• <strong>Data Processing Agreements:</strong> Contractual security requirements</li>
                    <li>• <strong>Regular Reviews:</strong> Annual security assessments</li>
                    <li>• <strong>Incident Coordination:</strong> Joint response procedures</li>
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
                <h2 className="text-2xl font-semibold text-foreground">5. Security Monitoring</h2>
              </div>
              
              <div className="space-y-4 text-muted text-sm">
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-3">Continuous Monitoring</h3>
                  <ul className="space-y-2">
                    <li>• <strong>Real-Time Alerts:</strong> Immediate notification of security events</li>
                    <li>• <strong>Behavioral Analysis:</strong> AI-powered anomaly detection</li>
                    <li>• <strong>Vulnerability Scanning:</strong> Automated security assessments</li>
                    <li>• <strong>Penetration Testing:</strong> Quarterly third-party testing</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-3">Security Metrics</h3>
                  <ul className="space-y-2">
                    <li>• <strong>Mean Time to Detection:</strong> &lt; 5 minutes</li>
                    <li>• <strong>Mean Time to Response:</strong> &lt; 1 hour</li>
                    <li>• <strong>False Positive Rate:</strong> &lt; 5%</li>
                    <li>• <strong>Security Training:</strong> Annual mandatory training</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 6 - Plaid Compliance */}
            <section className="bg-card border border-border rounded-xl p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-primary" />
                </div>
                <h2 className="text-2xl font-semibold text-foreground">6. Plaid Compliance Implementation</h2>
              </div>
              
              <div className="space-y-4 text-muted text-sm">
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-3">Multi-Factor Authentication</h3>
                  <ul className="space-y-2">
                    <li>• <strong>Consumer MFA:</strong> TOTP-based authentication for all users</li>
                    <li>• <strong>Plaid Link Integration:</strong> MFA required for bank connections</li>
                    <li>• <strong>Admin MFA:</strong> Enhanced MFA for administrative systems</li>
                    <li>• <strong>Implementation:</strong> Supabase Auth with TOTP support</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-3">Vulnerability Scanning</h3>
                  <ul className="space-y-2">
                    <li>• <strong>Automated Scanning:</strong> GitHub Actions security workflows</li>
                    <li>• <strong>Dependency Monitoring:</strong> Dependabot for vulnerability updates</li>
                    <li>• <strong>EOL Tracking:</strong> End-of-life software monitoring</li>
                    <li>• <strong>Continuous Monitoring:</strong> Weekly security assessments</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-3">Zero Trust Architecture</h3>
                  <ul className="space-y-2">
                    <li>• <strong>Per-Request Auth:</strong> Every request authenticated and authorized</li>
                    <li>• <strong>Row-Level Security:</strong> Database-level access controls</li>
                    <li>• <strong>Rate Limiting:</strong> Advanced request rate limiting</li>
                    <li>• <strong>Access Reviews:</strong> Quarterly access review procedures</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Contact section */}
            <section className="bg-gradient-to-r from-primary/5 to-cta-end/5 border border-primary/20 rounded-xl p-8">
              <div className="text-center space-y-4">
                <h2 className="text-2xl font-semibold text-foreground">Security Contact</h2>
                <p className="text-muted">
                  For security-related questions or to report a security incident, please contact our security team:
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <a 
                    href="mailto:security@killsub.com" 
                    className="inline-flex items-center space-x-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    <FileText className="w-4 h-4" />
                    <span>security@killsub.com</span>
                  </a>
                  <a 
                    href="/compliance" 
                    className="inline-flex items-center space-x-2 px-6 py-3 border border-border text-foreground rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <Shield className="w-4 h-4" />
                    <span>Compliance Hub</span>
                  </a>
                </div>
                <p className="text-xs text-muted">
                  For urgent security matters, please include "SECURITY INCIDENT" in the subject line.
                </p>
              </div>
            </section>

          </div>
        </div>
      </main>
    </div>
  );
}
