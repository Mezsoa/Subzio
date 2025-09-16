import Link from "next/link";
import { Shield, Clock, Trash2, Database, FileText, AlertCircle, CheckCircle } from "lucide-react";

export default function DataRetentionPolicyPage() {
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
                <Clock className="w-6 h-6 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-foreground">Data Retention Policy</h1>
            <p className="text-lg text-muted max-w-2xl mx-auto">
              This policy outlines how long we retain your data and when it is automatically deleted to protect your privacy and comply with regulations.
            </p>
          </div>

          {/* Quick overview cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-card border border-border rounded-xl p-6 text-center">
              <Trash2 className="w-8 h-8 text-red-500 mx-auto mb-3" />
              <h3 className="font-semibold text-foreground mb-2">Automatic Deletion</h3>
              <p className="text-sm text-muted">Data automatically deleted per retention schedule</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-6 text-center">
              <Database className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold text-foreground mb-2">Secure Storage</h3>
              <p className="text-sm text-muted">Encrypted storage with access controls</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-6 text-center">
              <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-3" />
              <h3 className="font-semibold text-foreground mb-2">GDPR Compliant</h3>
              <p className="text-sm text-muted">Right to be forgotten implemented</p>
            </div>
          </div>

          {/* Content sections */}
          <div className="prose prose-slate max-w-none">
            
            {/* Section 1 */}
            <section className="bg-card border border-border rounded-xl p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Database className="w-4 h-4 text-primary" />
                </div>
                <h2 className="text-2xl font-semibold text-foreground">1. Data Categories & Retention Periods</h2>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-3">Account Data</h3>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <ul className="space-y-2 text-sm">
                      <li>• <strong>User Profile:</strong> Retained while account is active</li>
                      <li>• <strong>Authentication Data:</strong> Retained while account is active</li>
                      <li>• <strong>Account Settings:</strong> Retained while account is active</li>
                      <li>• <strong>Deletion:</strong> Permanently deleted within 30 days of account closure</li>
                    </ul>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-3">Financial Data</h3>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <ul className="space-y-2 text-sm">
                      <li>• <strong>Bank Account Information:</strong> Retained while account is active</li>
                      <li>• <strong>Transaction Data:</strong> Retained for 2 years for service improvement</li>
                      <li>• <strong>Subscription Data:</strong> Retained for 1 year after detection</li>
                      <li>• <strong>Access Tokens:</strong> Revoked immediately upon disconnection</li>
                    </ul>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-3">Analytics & Usage Data</h3>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <ul className="space-y-2 text-sm">
                      <li>• <strong>Usage Statistics:</strong> Anonymized and retained for 3 years</li>
                      <li>• <strong>Performance Metrics:</strong> Aggregated data retained for 5 years</li>
                      <li>• <strong>Error Logs:</strong> Retained for 1 year</li>
                      <li>• <strong>Personal Identifiers:</strong> Removed after 6 months</li>
                    </ul>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-3">Communication Data</h3>
                  <div className="bg-muted/50 rounded-lg p-4">
                    <ul className="space-y-2 text-sm">
                      <li>• <strong>Support Tickets:</strong> Retained for 2 years</li>
                      <li>• <strong>Email Communications:</strong> Retained for 1 year</li>
                      <li>• <strong>Feedback & Reviews:</strong> Retained for 3 years</li>
                      <li>• <strong>Marketing Communications:</strong> Retained until opt-out</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 2 */}
            <section className="bg-card border border-border rounded-xl p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Trash2 className="w-4 h-4 text-primary" />
                </div>
                <h2 className="text-2xl font-semibold text-foreground">2. Data Deletion Procedures</h2>
              </div>
              
              <div className="space-y-4 text-muted text-sm">
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-3">Automatic Deletion</h3>
                  <ul className="space-y-2">
                    <li>• <strong>Scheduled Cleanup:</strong> Automated deletion runs daily</li>
                    <li>• <strong>Retention Checks:</strong> Data older than retention period is flagged</li>
                    <li>• <strong>Secure Deletion:</strong> Data is overwritten multiple times before deletion</li>
                    <li>• <strong>Audit Trail:</strong> All deletions are logged for compliance</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-3">Manual Deletion</h3>
                  <ul className="space-y-2">
                    <li>• <strong>Account Closure:</strong> User-initiated account deletion</li>
                    <li>• <strong>Data Export:</strong> Users can export data before deletion</li>
                    <li>• <strong>Immediate Processing:</strong> Deletion requests processed within 24 hours</li>
                    <li>• <strong>Confirmation:</strong> Users receive confirmation of data deletion</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-3">Legal Holds</h3>
                  <ul className="space-y-2">
                    <li>• <strong>Litigation Hold:</strong> Data may be retained longer for legal proceedings</li>
                    <li>• <strong>Regulatory Requirements:</strong> Some data retained per legal requirements</li>
                    <li>• <strong>Notification:</strong> Users notified if data retention extended</li>
                    <li>• <strong>Documentation:</strong> All legal holds documented and tracked</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 3 */}
            <section className="bg-card border border-border rounded-xl p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <AlertCircle className="w-4 h-4 text-primary" />
                </div>
                <h2 className="text-2xl font-semibold text-foreground">3. Data Backup & Recovery</h2>
              </div>
              
              <div className="space-y-4 text-muted text-sm">
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-3">Backup Procedures</h3>
                  <ul className="space-y-2">
                    <li>• <strong>Daily Backups:</strong> Encrypted backups created daily</li>
                    <li>• <strong>Retention:</strong> Backups retained for 30 days</li>
                    <li>• <strong>Geographic Distribution:</strong> Backups stored in multiple locations</li>
                    <li>• <strong>Access Controls:</strong> Backup access restricted to authorized personnel</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-3">Recovery Procedures</h3>
                  <ul className="space-y-2">
                    <li>• <strong>Recovery Time:</strong> 4-hour recovery time objective</li>
                    <li>• <strong>Data Integrity:</strong> Checksums verify backup integrity</li>
                    <li>• <strong>Testing:</strong> Recovery procedures tested quarterly</li>
                    <li>• <strong>Documentation:</strong> Recovery procedures documented and updated</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 4 */}
            <section className="bg-card border border-border rounded-xl p-8">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                  <FileText className="w-4 h-4 text-primary" />
                </div>
                <h2 className="text-2xl font-semibold text-foreground">4. Your Rights</h2>
              </div>
              
              <div className="space-y-4 text-muted text-sm">
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-3">Data Subject Rights</h3>
                  <ul className="space-y-2">
                    <li>• <strong>Right to Access:</strong> Request a copy of your data</li>
                    <li>• <strong>Right to Rectification:</strong> Correct inaccurate data</li>
                    <li>• <strong>Right to Erasure:</strong> Request deletion of your data</li>
                    <li>• <strong>Right to Portability:</strong> Export your data in machine-readable format</li>
                    <li>• <strong>Right to Restriction:</strong> Limit processing of your data</li>
                    <li>• <strong>Right to Object:</strong> Object to processing of your data</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-3">How to Exercise Your Rights</h3>
                  <ul className="space-y-2">
                    <li>• <strong>Account Settings:</strong> Manage data through your account dashboard</li>
                    <li>• <strong>API Endpoints:</strong> Use our data export and deletion APIs</li>
                    <li>• <strong>Support Contact:</strong> Email privacy@killsub.com for assistance</li>
                    <li>• <strong>Response Time:</strong> We respond to requests within 30 days</li>
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
                <h2 className="text-2xl font-semibold text-foreground">5. Policy Updates</h2>
              </div>
              
              <div className="space-y-4 text-muted text-sm">
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-3">Review Schedule</h3>
                  <ul className="space-y-2">
                    <li>• <strong>Annual Review:</strong> Policy reviewed annually</li>
                    <li>• <strong>Regulatory Changes:</strong> Updated when regulations change</li>
                    <li>• <strong>Business Changes:</strong> Updated when business practices change</li>
                    <li>• <strong>User Notification:</strong> Users notified of material changes</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-foreground mb-3">Change Management</h3>
                  <ul className="space-y-2">
                    <li>• <strong>Version Control:</strong> All changes tracked and versioned</li>
                    <li>• <strong>Approval Process:</strong> Changes require legal and technical review</li>
                    <li>• <strong>Implementation:</strong> Changes implemented with proper testing</li>
                    <li>• <strong>Communication:</strong> Changes communicated to all stakeholders</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Contact section */}
            <section className="bg-gradient-to-r from-primary/5 to-cta-end/5 border border-primary/20 rounded-xl p-8">
              <div className="text-center space-y-4">
                <h2 className="text-2xl font-semibold text-foreground">Questions About Data Retention?</h2>
                <p className="text-muted">
                  If you have questions about our data retention practices or want to exercise your data rights:
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                  <a 
                    href="mailto:privacy@killsub.com" 
                    className="inline-flex items-center space-x-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    <FileText className="w-4 h-4" />
                    <span>privacy@killsub.com</span>
                  </a>
                  <a 
                    href="/api/user/export-data" 
                    className="inline-flex items-center space-x-2 px-6 py-3 border border-border text-foreground rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <Database className="w-4 h-4" />
                    <span>Export My Data</span>
                  </a>
                </div>
                <p className="text-xs text-muted">
                  For data deletion requests, please include "DATA DELETION REQUEST" in the subject line.
                </p>
              </div>
            </section>

          </div>
        </div>
      </main>
    </div>
  );
}
