# Access Review and De-provisioning Procedures

## Overview

This document outlines our procedures for periodic access reviews and automated de-provisioning to ensure compliance with Plaid's attestation requirements and maintain security standards.

## Policy Statement

KillSub maintains a comprehensive access review program to:
- Regularly review user access and permissions
- Ensure access aligns with job functions and business needs
- Automatically de-provision access for terminated users
- Maintain audit trails for compliance

## Scope

This policy applies to:
- **User Accounts**: All user accounts in the system
- **Administrative Access**: Admin, developer, and support roles
- **API Access**: Service accounts and API tokens
- **Third-party Integrations**: Plaid, Stripe, Supabase access

## Access Review Procedures

### 1. Quarterly Access Reviews

#### Schedule
- **Frequency**: Quarterly (January, April, July, October)
- **Timeline**: Completed within 30 days of quarter start
- **Responsible**: Security team lead
- **Participants**: Department managers, IT administrators

#### Review Process

##### Step 1: Access Inventory
1. **Generate Access Report**
   ```sql
   -- Example query for user access review
   SELECT 
     u.id,
     u.email,
     u.created_at,
     u.last_sign_in_at,
     r.role_name,
     p.permission_name
   FROM users u
   LEFT JOIN user_roles ur ON u.id = ur.user_id
   LEFT JOIN roles r ON ur.role_id = r.id
   LEFT JOIN role_permissions rp ON r.id = rp.role_id
   LEFT JOIN permissions p ON rp.permission_id = p.id
   ORDER BY u.email;
   ```

2. **Review User Activity**
   - Check last sign-in dates
   - Review API access patterns
   - Identify dormant accounts
   - Flag unusual access patterns

##### Step 2: Manager Verification
1. **Distribute Access Lists**
   - Send access reports to department managers
   - Include user roles and permissions
   - Request verification of continued need

2. **Manager Review Process**
   - Verify user still employed
   - Confirm access aligns with job function
   - Identify any access changes needed
   - Document approval or changes

##### Step 3: Access Remediation
1. **Remove Unnecessary Access**
   - Revoke access for terminated users
   - Remove excessive permissions
   - Update role assignments
   - Document all changes

2. **Update Access Records**
   - Update user role assignments
   - Modify permission sets
   - Update access documentation
   - Log all changes in audit system

### 2. Immediate Access Revocation

#### Triggers for Immediate Revocation
- **Employee Termination**: Access revoked immediately
- **Role Change**: Access updated within 24 hours
- **Security Incident**: Access suspended during investigation
- **Policy Violation**: Access revoked for violations

#### Automated De-provisioning Process

##### User Account Deletion API
**Endpoint**: `/api/user/delete-account`
**Method**: POST
**Authentication**: Required

```typescript
// Automated de-provisioning workflow
async function deprovisionUser(userId: string) {
  // 1. Disconnect Plaid connections
  await disconnectPlaidItems(userId);
  
  // 2. Disconnect BankID/Tink connections
  await disconnectBankIDItems(userId);
  
  // 3. Disconnect Stripe Connect
  await disconnectStripeAccount(userId);
  
  // 4. Delete user data from database
  await deleteUserData(userId);
  
  // 5. Delete user account from Supabase Auth
  await deleteUserAccount(userId);
  
  // 6. Log de-provisioning event
  await logSecurityEvent({
    type: 'user_deprovisioned',
    user_id: userId,
    timestamp: new Date().toISOString(),
    severity: 'high'
  });
}
```

##### Third-party Service Disconnection
1. **Plaid Disconnection**
   - Call Plaid API to remove items
   - Delete access tokens from database
   - Log disconnection events

2. **BankID/Tink Disconnection**
   - Remove stored access tokens
   - Clean up user data
   - Log disconnection events

3. **Stripe Connect Disconnection**
   - Deauthorize Stripe Connect account
   - Remove stored account data
   - Log disconnection events

### 3. Access Review Documentation

#### Quarterly Review Checklist
- [ ] Generate access inventory report
- [ ] Distribute reports to managers
- [ ] Collect manager approvals
- [ ] Implement access changes
- [ ] Update access documentation
- [ ] Log review completion
- [ ] Schedule next review

#### Access Review Report Template
```
ACCESS REVIEW REPORT
Quarter: Q1 2024
Review Date: January 15, 2024
Next Review: April 15, 2024

SUMMARY:
- Total Users Reviewed: [X]
- Access Changes Made: [X]
- Users De-provisioned: [X]
- Policy Violations: [X]

DETAILS:
[Detailed findings and actions taken]

APPROVALS:
- Security Team Lead: [Signature] [Date]
- IT Administrator: [Signature] [Date]
- Department Managers: [Signature] [Date]
```

### 4. Audit Logging Requirements

#### Access Events Logged
- **Login Attempts**: Successful and failed logins
- **Permission Changes**: Role and permission modifications
- **Access Reviews**: Quarterly review activities
- **De-provisioning**: User account deletions
- **Security Events**: Suspicious access patterns

#### Log Retention
- **Retention Period**: 7 years
- **Storage**: Secure, encrypted storage
- **Access**: Restricted to security team
- **Backup**: Regular backups with encryption

#### Log Format
```json
{
  "timestamp": "2024-01-15T10:30:00Z",
  "event_type": "access_review",
  "user_id": "user-123",
  "action": "permission_removed",
  "details": {
    "permission": "admin_access",
    "reason": "role_change",
    "reviewer": "security-team"
  },
  "severity": "medium",
  "ip_address": "192.168.1.1",
  "user_agent": "Mozilla/5.0..."
}
```

## Compliance and Monitoring

### Plaid Attestation Requirements
This access review policy satisfies Plaid's attestation requirements:
- ✅ "Performs periodic access reviews and audits"
- ✅ "Implemented automated de-provisioning/modification of access for terminated or transferred employees"

### Evidence of Implementation
- ✅ Quarterly access review procedures documented
- ✅ Automated de-provisioning API endpoints
- ✅ Access review checklist and templates
- ✅ Audit logging for all access events
- ✅ Manager approval workflows

### Monitoring and Alerts
- **Real-time Alerts**: Failed access attempts, suspicious patterns
- **Weekly Reports**: Access activity summaries
- **Monthly Reviews**: Access pattern analysis
- **Quarterly Assessments**: Comprehensive access reviews

## Tools and Automation

### Automated Tools
- **Supabase RLS**: Row-level security enforcement
- **API Middleware**: Request authentication and authorization
- **Audit Logging**: Comprehensive event logging
- **Automated De-provisioning**: API endpoints for user deletion

### Manual Procedures
- **Access Review Spreadsheets**: Quarterly review tracking
- **Manager Approval Forms**: Access verification documents
- **Security Event Reports**: Incident documentation
- **Compliance Checklists**: Review completion tracking

## Contact Information

For questions about access reviews or to report access-related issues:

- **Email**: security@killsub.com
- **Subject**: "ACCESS REVIEW" for review-related issues
- **Documentation**: This procedure document
- **Last Updated**: January 15, 2024
- **Next Review**: April 15, 2024

---

*This document is part of KillSub's comprehensive security and compliance program for Plaid production API access.*
