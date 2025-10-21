import Link from "next/link";
import { Shield, CheckCircle, Clock, FileText, Settings, Database, Users, AlertTriangle } from "lucide-react";

export default function CompliancePage() {
  const attestations = [
    {
      id: 1,
      title: "Centralized Identity and Access Management",
      description: "Implemented centralized identity and access management solutions",
      status: "completed",
      lastReviewed: "2024-01-15",
      nextReview: "2024-04-15",
      evidence: [
        "Supabase Auth as centralized identity provider",
        "Role-based access control (RBAC) implementation",
        "Single sign-on (SSO) capabilities",
        "User provisioning and deprovisioning automation"
      ],
      links: [
        { name: "Access Control Policy", href: "/access-control-policy" },
        { name: "Security Policy", href: "/security-policy" }
      ]
    },
    {
      id: 2,
      title: "Multi-Factor Authentication (Consumer-Facing)",
      description: "Implemented multi-factor authentication on the consumer-facing application where Plaid Link is deployed",
      status: "completed",
      lastReviewed: "2024-01-15",
      nextReview: "2024-04-15",
      evidence: [
        "TOTP-based MFA using Supabase Auth",
        "MFA enrollment flow in account settings",
        "MFA required for Plaid Link connections",
        "User-friendly MFA management interface"
      ],
      links: [
        { name: "MFA Implementation", href: "/account" },
        { name: "API Documentation", href: "/api/user/enable-mfa" }
      ]
    },
    {
      id: 3,
      title: "Multi-Factor Authentication (Internal Systems)",
      description: "Implemented robust MFA on internal systems that store or process consumer data",
      status: "completed",
      lastReviewed: "2024-01-15",
      nextReview: "2024-04-15",
      evidence: [
        "Supabase Admin MFA for administrative access",
        "Service account authentication with MFA",
        "Database access controls with MFA",
        "API access token rotation"
      ],
      links: [
        { name: "Access Control Policy", href: "/access-control-policy" },
        { name: "Security Policy", href: "/security-policy" }
      ]
    },
    {
      id: 4,
      title: "Vulnerability Scanning",
      description: "Performs vulnerability scanning",
      status: "completed",
      lastReviewed: "2024-01-15",
      nextReview: "2024-02-15",
      evidence: [
        "Automated GitHub Actions security scanning",
        "Dependabot for dependency vulnerability monitoring",
        "npm audit integration in CI/CD pipeline",
        "Weekly automated security scans"
      ],
      links: [
        { name: "GitHub Actions", href: "https://github.com/your-repo/actions" },
        { name: "Security Workflow", href: "/.github/workflows/security-scan.yml" }
      ]
    },
    {
      id: 5,
      title: "End-of-Life Software Monitoring",
      description: "Monitors end-of-life (EOL) software in use and updates policies to include EOL management practices",
      status: "completed",
      lastReviewed: "2024-01-15",
      nextReview: "2024-04-15",
      evidence: [
        "Node.js version monitoring and updates",
        "Next.js framework update policies",
        "Dependency EOL tracking with npm-check-updates",
        "Automated dependency update workflows"
      ],
      links: [
        { name: "Package.json Scripts", href: "/package.json" },
        { name: "Dependabot Configuration", href: "/.github/dependabot.yml" }
      ]
    },
    {
      id: 6,
      title: "Periodic Access Reviews and Audits",
      description: "Performs periodic access reviews and audits",
      status: "completed",
      lastReviewed: "2024-01-15",
      nextReview: "2024-04-15",
      evidence: [
        "Quarterly access review procedures documented",
        "Automated access review reminders",
        "User access audit logging",
        "Role-based access control reviews"
      ],
      links: [
        { name: "Access Control Policy", href: "/access-control-policy" },
        { name: "Review Procedures", href: "/docs/access-review-procedures.md" }
      ]
    },
    {
      id: 7,
      title: "Automated De-provisioning",
      description: "Implemented automated de-provisioning/modification of access for terminated or transferred employees",
      status: "completed",
      lastReviewed: "2024-01-15",
      nextReview: "2024-04-15",
      evidence: [
        "Automated account deletion API endpoints",
        "User data cleanup procedures",
        "Third-party service disconnection automation",
        "GDPR-compliant data deletion"
      ],
      links: [
        { name: "Account Deletion API", href: "/api/user/delete-account" },
        { name: "Data Retention Policy", href: "/data-retention-policy" }
      ]
    },
    {
      id: 8,
      title: "Zero Trust Access Architecture",
      description: "Implemented a zero trust access architecture",
      status: "completed",
      lastReviewed: "2024-01-15",
      nextReview: "2024-04-15",
      evidence: [
        "Per-request authentication and authorization",
        "Row-level security (RLS) in database",
        "API rate limiting and request validation",
        "Network segmentation and micro-segmentation",
        "Least privilege access principles"
      ],
      links: [
        { name: "Middleware Implementation", href: "/src/middleware.ts" },
        { name: "Security Headers", href: "/src/middleware.ts" },
        { name: "Access Control Policy", href: "/access-control-policy" }
      ]
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'in-progress':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'pending':
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800';
      case 'pending':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-background/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-4">
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
      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="space-y-8">
          {/* Title section */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-gradient-to-br from-primary to-cta-end rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-foreground">Plaid Compliance Attestations</h1>
            <p className="text-lg text-muted max-w-3xl mx-auto">
              Comprehensive security and compliance documentation for Plaid production API access. 
              All 8 required attestations have been implemented and documented.
            </p>
          </div>

          {/* Summary Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-card border border-border rounded-xl p-6 text-center">
              <CheckCircle className="w-8 h-8 text-green-500 mx-auto mb-3" />
              <h3 className="font-semibold text-foreground mb-2">8/8 Complete</h3>
              <p className="text-sm text-muted">All attestations implemented</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-6 text-center">
              <Shield className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold text-foreground mb-2">Security First</h3>
              <p className="text-sm text-muted">Zero trust architecture</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-6 text-center">
              <Database className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold text-foreground mb-2">Automated</h3>
              <p className="text-sm text-muted">Continuous monitoring</p>
            </div>
            <div className="bg-card border border-border rounded-xl p-6 text-center">
              <Users className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold text-foreground mb-2">Compliant</h3>
              <p className="text-sm text-muted">Plaid production ready</p>
            </div>
          </div>

          {/* Attestations List */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">Compliance Attestations</h2>
            
            {attestations.map((attestation) => (
              <div key={attestation.id} className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-3">
                    {getStatusIcon(attestation.status)}
                    <div>
                      <h3 className="text-lg font-semibold text-foreground">
                        {attestation.id}. {attestation.title}
                      </h3>
                      <p className="text-muted text-sm mt-1">{attestation.description}</p>
                    </div>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(attestation.status)}`}>
                    {attestation.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-foreground mb-3">Implementation Evidence</h4>
                    <ul className="space-y-2">
                      {attestation.evidence.map((item, index) => (
                        <li key={index} className="flex items-start space-x-2 text-sm text-muted">
                          <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-medium text-foreground mb-3">Review Schedule</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted">Last Reviewed:</span>
                        <span className="text-foreground">{attestation.lastReviewed}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted">Next Review:</span>
                        <span className="text-foreground">{attestation.nextReview}</span>
                      </div>
                    </div>

                    <h4 className="font-medium text-foreground mb-3 mt-4">Documentation Links</h4>
                    <div className="space-y-2">
                      {attestation.links.map((link, index) => (
                        <a
                          key={index}
                          href={link.href}
                          className="flex items-center space-x-2 text-sm text-primary hover:text-primary/80"
                        >
                          <FileText className="w-4 h-4" />
                          <span>{link.name}</span>
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Contact section */}
          <div className="bg-gradient-to-r from-primary/5 to-cta-end/5 border border-primary/20 rounded-xl p-8">
            <div className="text-center space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">Compliance Questions?</h2>
              <p className="text-muted">
                For questions about our security and compliance implementation, please contact our security team:
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
                  href="/security-policy" 
                  className="inline-flex items-center space-x-2 px-6 py-3 border border-border text-foreground rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <Shield className="w-4 h-4" />
                  <span>Security Policy</span>
                </a>
              </div>
              <p className="text-xs text-muted">
                For urgent security matters, please include "SECURITY INCIDENT" in the subject line.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
