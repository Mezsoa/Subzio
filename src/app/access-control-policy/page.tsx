import Link from "next/link";
import { Shield, Users, Lock, Eye, CheckCircle, AlertTriangle, FileText, Clock, Settings, Database } from "lucide-react";

export default function AccessControlPolicyPage() {
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
              <div>Policy Version: 1.0</div>
              <div>Effective Date: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
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
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-foreground">Access Controls Policy</h1>
            <p className="text-lg text-muted max-w-2xl mx-auto">
              This policy establishes the framework for controlling access to KillSub systems, data, and resources to ensure security, compliance, and operational integrity.
            </p>
          </div>

          {/* Document Information */}
          <div className="bg-card border border-border rounded-xl p-6">
            <h2 className="text-xl font-semibold text-foreground mb-4">Document Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <strong className="text-foreground">Policy Name:</strong> Access Controls Policy
              </div>
              <div>
                <strong className="text-foreground">Version:</strong> 1.0
              </div>
              <div>
                <strong className="text-foreground">Effective Date:</strong> {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
              <div>
                <strong className="text-foreground">Next Review:</strong> {new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
              <div>
                <strong className="text-foreground">Approved By:</strong> Founder/CEO
              </div>
              <div>
                <strong className="text-foreground">Classification:</strong> Internal Use
              </div>
            </div>
          </div>

          {/* Content sections */}
          <div className="prose prose-slate max-w-none">
            
            {/* Section 1 */}
            <section className="bg-card border border-border rounded-xl p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Eye className="w-4 h-4 text-primary" />
                </div>
                <h2 className="text-2xl font-semibold text-foreground">1. Scope and Purpose</h2>
              </div>
              
              <div className="space-y-4 text-muted text-sm">
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-3">Scope</h3>
                  <p>This policy applies to all KillSub systems, applications, databases, and data repositories, including:</p>
                  <ul className="mt-2 space-y-1">
                    <li>• Production and staging environments</li>
                    <li>• User data and financial information</li>
                    <li>• Administrative systems and tools</li>
                    <li>• Third-party integrations (Plaid, Stripe, Supabase)</li>
                    <li>• Development and testing environments</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-3">Purpose</h3>
                  <p>The objectives of this access control policy are to:</p>
                  <ul className="mt-2 space-y-1">
                    <li>• Protect sensitive user data and financial information</li>
                    <li>• Ensure compliance with financial regulations (PCI DSS, GDPR, CCPA)</li>
                    <li>• Prevent unauthorized access to systems and data</li>
                    <li>• Maintain audit trails for security and compliance</li>
                    <li>• Support business continuity and operational security</li>
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
                <h2 className="text-2xl font-semibold text-foreground">2. Access Control Principles</h2>
              </div>
              
              <div className="space-y-4 text-muted text-sm">
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-3">Role-Based Access Control (RBAC)</h3>
                  <p>Access to KillSub systems is granted based on predefined roles that align with job functions and responsibilities. Each role has specific permissions that are:</p>
                  <ul className="mt-2 space-y-1">
                    <li>• Clearly defined and documented</li>
                    <li>• Regularly reviewed and updated</li>
                    <li>• Implemented through technical controls</li>
                    <li>• Monitored through audit logs</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-3">Principle of Least Privilege</h3>
                  <p>Users are granted the minimum level of access necessary to perform their job functions. This principle ensures:</p>
                  <ul className="mt-2 space-y-1">
                    <li>• Reduced risk of unauthorized data access</li>
                    <li>• Limited impact of compromised accounts</li>
                    <li>• Simplified access management</li>
                    <li>• Enhanced security posture</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-3">Need-to-Know Basis</h3>
                  <p>Access to sensitive information is granted only when there is a legitimate business need. This includes:</p>
                  <ul className="mt-2 space-y-1">
                    <li>• Financial data access for support purposes only</li>
                    <li>• User data access limited to specific use cases</li>
                    <li>• Administrative access restricted to authorized personnel</li>
                    <li>• Regular justification of continued access</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 3 */}
            <section className="bg-card border border-border rounded-xl p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Users className="w-4 h-4 text-primary" />
                </div>
                <h2 className="text-2xl font-semibold text-foreground">3. Role Definitions</h2>
              </div>
              
              <div className="space-y-6">
                <div className="border border-border rounded-lg p-4">
                  <h3 className="text-lg font-medium text-foreground mb-3">Founder/Admin</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <strong className="text-foreground">Access Level:</strong> Full System Access
                    </div>
                    <div>
                      <strong className="text-foreground">MFA Required:</strong> Yes
                    </div>
                    <div>
                      <strong className="text-foreground">Permissions:</strong>
                      <ul className="mt-1 space-y-1">
                        <li>• Full database access</li>
                        <li>• User account management</li>
                        <li>• System configuration</li>
                        <li>• Security settings</li>
                        <li>• Financial data access</li>
                      </ul>
                    </div>
                    <div>
                      <strong className="text-foreground">Restrictions:</strong>
                      <ul className="mt-1 space-y-1">
                        <li>• All actions logged</li>
                        <li>• Requires justification for sensitive operations</li>
                        <li>• Quarterly access review</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="border border-border rounded-lg p-4">
                  <h3 className="text-lg font-medium text-foreground mb-3">Developer</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <strong className="text-foreground">Access Level:</strong> Code and Staging Access
                    </div>
                    <div>
                      <strong className="text-foreground">MFA Required:</strong> Yes
                    </div>
                    <div>
                      <strong className="text-foreground">Permissions:</strong>
                      <ul className="mt-1 space-y-1">
                        <li>• Staging environment access</li>
                        <li>• Code repository access</li>
                        <li>• Development tools</li>
                        <li>• Testing data access</li>
                      </ul>
                    </div>
                    <div>
                      <strong className="text-foreground">Restrictions:</strong>
                      <ul className="mt-1 space-y-1">
                        <li>• No production data access</li>
                        <li>• No financial data access</li>
                        <li>• All changes require approval</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="border border-border rounded-lg p-4">
                  <h3 className="text-lg font-medium text-foreground mb-3">Support</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <strong className="text-foreground">Access Level:</strong> Limited User Data Access
                    </div>
                    <div>
                      <strong className="text-foreground">MFA Required:</strong> Yes
                    </div>
                    <div>
                      <strong className="text-foreground">Permissions:</strong>
                      <ul className="mt-1 space-y-1">
                        <li>• User account information (non-financial)</li>
                        <li>• Support ticket access</li>
                        <li>• Basic system monitoring</li>
                        <li>• User communication tools</li>
                      </ul>
                    </div>
                    <div>
                      <strong className="text-foreground">Restrictions:</strong>
                      <ul className="mt-1 space-y-1">
                        <li>• No financial data access</li>
                        <li>• No system configuration</li>
                        <li>• All access logged and monitored</li>
                      </ul>
                    </div>
                  </div>
                </div>
                
                <div className="border border-border rounded-lg p-4">
                  <h3 className="text-lg font-medium text-foreground mb-3">User</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <strong className="text-foreground">Access Level:</strong> Self-Service Account Access
                    </div>
                    <div>
                      <strong className="text-foreground">MFA Required:</strong> Optional
                    </div>
                    <div>
                      <strong className="text-foreground">Permissions:</strong>
                      <ul className="mt-1 space-y-1">
                        <li>• Own account data</li>
                        <li>• Own financial data</li>
                        <li>• Subscription management</li>
                        <li>• Data export/deletion</li>
                      </ul>
                    </div>
                    <div>
                      <strong className="text-foreground">Restrictions:</strong>
                      <ul className="mt-1 space-y-1">
                        <li>• Access limited to own data only</li>
                        <li>• No administrative functions</li>
                        <li>• Row-level security enforced</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 4 */}
            <section className="bg-card border border-border rounded-xl p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Settings className="w-4 h-4 text-primary" />
                </div>
                <h2 className="text-2xl font-semibold text-foreground">4. Access Provisioning Process</h2>
              </div>
              
              <div className="space-y-4 text-muted text-sm">
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-3">Access Request Process</h3>
                  <ol className="space-y-2">
                    <li><strong>1. Request Submission:</strong> Access requests must be submitted in writing with business justification</li>
                    <li><strong>2. Manager Approval:</strong> Direct manager must approve the access request</li>
                    <li><strong>3. Security Review:</strong> Security team reviews request for compliance</li>
                    <li><strong>4. Access Grant:</strong> Access is provisioned with appropriate permissions</li>
                    <li><strong>5. Documentation:</strong> All access grants are documented and logged</li>
                  </ol>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-3">Authorization Requirements</h3>
                  <ul className="space-y-2">
                    <li>• <strong>Founder/Admin Access:</strong> Requires CEO approval and security clearance</li>
                    <li>• <strong>Developer Access:</strong> Requires CTO approval and background check</li>
                    <li>• <strong>Support Access:</strong> Requires manager approval and training completion</li>
                    <li>• <strong>Contractor Access:</strong> Requires signed agreement and limited duration</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-3">Documentation Requirements</h3>
                  <ul className="space-y-2">
                    <li>• Access request forms with business justification</li>
                    <li>• Approval documentation from authorized personnel</li>
                    <li>• Access provisioning records with timestamps</li>
                    <li>• User acknowledgment of security policies</li>
                    <li>• Regular access review documentation</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 5 */}
            <section className="bg-card border border-border rounded-xl p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Shield className="w-4 h-4 text-primary" />
                </div>
                <h2 className="text-2xl font-semibold text-foreground">5. Authentication Requirements</h2>
              </div>
              
              <div className="space-y-4 text-muted text-sm">
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-3">Multi-Factor Authentication (MFA)</h3>
                  <ul className="space-y-2">
                    <li>• <strong>Admin/Developer Access:</strong> MFA required for all administrative accounts</li>
                    <li>• <strong>Support Access:</strong> MFA required for support personnel</li>
                    <li>• <strong>User Access:</strong> MFA recommended for enhanced security</li>
                    <li>• <strong>Implementation:</strong> TOTP-based authentication using authenticator apps</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-3">OAuth Tokens for API Access</h3>
                  <ul className="space-y-2">
                    <li>• <strong>Token Management:</strong> All API access requires valid OAuth tokens</li>
                    <li>• <strong>Token Rotation:</strong> Tokens are rotated every 90 days</li>
                    <li>• <strong>Scope Limitation:</strong> Tokens are scoped to specific permissions</li>
                    <li>• <strong>Monitoring:</strong> All token usage is logged and monitored</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-3">TLS Certificates for Service-to-Service</h3>
                  <ul className="space-y-2">
                    <li>• <strong>Certificate Management:</strong> All service communications use TLS 1.3</li>
                    <li>• <strong>Certificate Validation:</strong> Certificates are validated and monitored</li>
                    <li>• <strong>Renewal Process:</strong> Automated certificate renewal and deployment</li>
                    <li>• <strong>Security Standards:</strong> Minimum 2048-bit RSA or 256-bit ECDSA keys</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 6 */}
            <section className="bg-card border border-border rounded-xl p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-primary" />
                </div>
                <h2 className="text-2xl font-semibold text-foreground">6. Access Reviews</h2>
              </div>
              
              <div className="space-y-4 text-muted text-sm">
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-3">Quarterly Access Reviews</h3>
                  <ul className="space-y-2">
                    <li>• <strong>Review Schedule:</strong> Access reviews conducted quarterly</li>
                    <li>• <strong>Review Scope:</strong> All user accounts and permissions</li>
                    <li>• <strong>Review Process:</strong> Managers verify continued need for access</li>
                    <li>• <strong>Documentation:</strong> All reviews documented with approval signatures</li>
                    <li>• <strong>Remediation:</strong> Unnecessary access removed within 30 days</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-3">Immediate Revocation</h3>
                  <ul className="space-y-2">
                    <li>• <strong>Termination:</strong> Access revoked immediately upon employee termination</li>
                    <li>• <strong>Role Change:</strong> Access updated within 24 hours of role change</li>
                    <li>• <strong>Security Incident:</strong> Access suspended during security investigations</li>
                    <li>• <strong>Policy Violation:</strong> Access revoked for policy violations</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-3">Audit Logging Requirements</h3>
                  <ul className="space-y-2">
                    <li>• <strong>Access Events:</strong> All access attempts logged with timestamps</li>
                    <li>• <strong>Permission Changes:</strong> All permission modifications logged</li>
                    <li>• <strong>Failed Attempts:</strong> Failed access attempts monitored and alerted</li>
                    <li>• <strong>Retention:</strong> Audit logs retained for 7 years</li>
                    <li>• <strong>Monitoring:</strong> Real-time monitoring of suspicious access patterns</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 7 */}
            <section className="bg-card border border-border rounded-xl p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Database className="w-4 h-4 text-primary" />
                </div>
                <h2 className="text-2xl font-semibold text-foreground">7. Technical Implementation</h2>
              </div>
              
              <div className="space-y-4 text-muted text-sm">
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-3">Supabase Row Level Security (RLS)</h3>
                  <ul className="space-y-2">
                    <li>• <strong>Policy Implementation:</strong> RLS policies enforce data access at database level</li>
                    <li>• <strong>User Isolation:</strong> Users can only access their own data</li>
                    <li>• <strong>Admin Override:</strong> Admin policies allow elevated access when needed</li>
                    <li>• <strong>Policy Testing:</strong> RLS policies tested and validated regularly</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-3">Authentication Middleware</h3>
                  <ul className="space-y-2">
                    <li>• <strong>Token Validation:</strong> All API requests validate authentication tokens</li>
                    <li>• <strong>Session Management:</strong> Secure session handling with automatic timeout</li>
                    <li>• <strong>Rate Limiting:</strong> API rate limiting to prevent abuse</li>
                    <li>• <strong>Error Handling:</strong> Secure error responses without information leakage</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-3">Session Management</h3>
                  <ul className="space-y-2">
                    <li>• <strong>Session Timeout:</strong> Sessions expire after 24 hours of inactivity</li>
                    <li>• <strong>Secure Cookies:</strong> HttpOnly, Secure, SameSite cookie attributes</li>
                    <li>• <strong>Token Rotation:</strong> Refresh tokens rotated on each use</li>
                    <li>• <strong>Concurrent Sessions:</strong> Limited to 3 concurrent sessions per user</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 8 */}
            <section className="bg-card border border-border rounded-xl p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4 text-primary" />
                </div>
                <h2 className="text-2xl font-semibold text-foreground">8. Compliance and Monitoring</h2>
              </div>
              
              <div className="space-y-4 text-muted text-sm">
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-3">Regulatory Compliance</h3>
                  <ul className="space-y-2">
                    <li>• <strong>PCI DSS:</strong> Access controls meet PCI DSS requirements</li>
                    <li>• <strong>GDPR:</strong> Data access controls support GDPR compliance</li>
                    <li>• <strong>CCPA:</strong> California privacy law compliance maintained</li>
                    <li>• <strong>SOX:</strong> Financial reporting access controls implemented</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-3">Security Monitoring</h3>
                  <ul className="space-y-2">
                    <li>• <strong>Real-time Monitoring:</strong> 24/7 monitoring of access patterns</li>
                    <li>• <strong>Anomaly Detection:</strong> AI-powered detection of unusual access</li>
                    <li>• <strong>Alert System:</strong> Immediate alerts for security events</li>
                    <li>• <strong>Incident Response:</strong> Automated response to security incidents</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-3">Policy Enforcement</h3>
                  <ul className="space-y-2">
                    <li>• <strong>Automated Enforcement:</strong> Technical controls enforce policy requirements</li>
                    <li>• <strong>Regular Audits:</strong> Quarterly audits of access controls</li>
                    <li>• <strong>Penetration Testing:</strong> Annual penetration testing of access controls</li>
                    <li>• <strong>Continuous Improvement:</strong> Policy updated based on audit findings</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 9 - Recent Implementations */}
            <section className="bg-card border border-border rounded-xl p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-primary" />
                </div>
                <h2 className="text-2xl font-semibold text-foreground">9. Recent Security Enhancements</h2>
              </div>
              
              <div className="space-y-4 text-muted text-sm">
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-3">Multi-Factor Authentication (MFA)</h3>
                  <ul className="space-y-2">
                    <li>• <strong>Consumer MFA:</strong> TOTP-based MFA for all user accounts</li>
                    <li>• <strong>MFA Enrollment:</strong> User-friendly setup process in account settings</li>
                    <li>• <strong>Plaid Integration:</strong> MFA required for bank account connections</li>
                    <li>• <strong>Admin MFA:</strong> Enhanced MFA for administrative access</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-3">Enhanced Zero Trust Controls</h3>
                  <ul className="space-y-2">
                    <li>• <strong>Rate Limiting:</strong> Per-user and per-IP request limiting</li>
                    <li>• <strong>Request Validation:</strong> Enhanced API request validation</li>
                    <li>• <strong>Security Headers:</strong> Comprehensive security headers for all responses</li>
                    <li>• <strong>Access Monitoring:</strong> Real-time access pattern monitoring</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-3">Automated Security Scanning</h3>
                  <ul className="space-y-2">
                    <li>• <strong>GitHub Actions:</strong> Automated vulnerability scanning</li>
                    <li>• <strong>Dependabot:</strong> Automated dependency updates</li>
                    <li>• <strong>EOL Monitoring:</strong> End-of-life software tracking</li>
                    <li>• <strong>Security Alerts:</strong> Automated security notifications</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Contact section */}
            <section className="bg-gradient-to-r from-primary/5 to-cta-end/5 border border-primary/20 rounded-xl p-8">
              <div className="text-center space-y-4">
                <h2 className="text-2xl font-semibold text-foreground">Questions About Access Controls?</h2>
                <p className="text-muted">
                  For questions about this policy or to report access control issues:
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
                  <a 
                    href="/api/access-control-policy/pdf" 
                    className="inline-flex items-center space-x-2 px-6 py-3 border border-border text-foreground rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <FileText className="w-4 h-4" />
                    <span>Download PDF</span>
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
