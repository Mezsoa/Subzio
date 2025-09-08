import { getPlanById } from './stripe';

// Plan ID type that matches actual usage (lowercase)
export type UsagePlanId = 'free' | 'pro' | 'business';

export interface UsageStats {
  bankAccountsConnected: number;
  subscriptionsDetected: number;
  alertsCreated: number;
  cancellationRequests: number;
  dataExports: number;
}

export interface UsageLimits {
  bankAccounts: number; // -1 = unlimited
  subscriptions: number; // -1 = unlimited
  alerts: number; // -1 = unlimited
  cancellationRequests: number; // -1 = unlimited
  dataExports: number; // -1 = unlimited
}

export function getPlanLimits(planId: UsagePlanId): UsageLimits {
  const plan = getPlanById(planId);
  
  if (!plan) {
    // Default to free plan limits if plan not found
    return {
      bankAccounts: 1,
      subscriptions: 10,
      alerts: 1,
      cancellationRequests: 0,
      dataExports: 0,
    };
  }
  
  return {
    bankAccounts: plan.limits.bankAccounts,
    subscriptions: plan.limits.subscriptions,
    alerts: plan.limits.alerts,
    cancellationRequests: ('cancelService' in plan.limits ? (plan.limits as { cancelService?: number }).cancelService : 0) || 0,
    dataExports: planId === 'free' ? 0 : -1, // Free = 0, Pro/Business = unlimited
  };
}

export function checkUsageLimit(
  usage: UsageStats,
  limits: UsageLimits,
  feature: keyof UsageLimits
): { allowed: boolean; remaining?: number; limit?: number } {
  const currentUsage = usage[feature as keyof UsageStats] || 0;
  const limit = limits[feature];

  if (limit === -1) {
    return { allowed: true }; // Unlimited
  }

  const remaining = Math.max(0, limit - currentUsage);
  return {
    allowed: currentUsage < limit,
    remaining,
    limit
  };
}

export function formatLimitMessage(
  feature: string,
  limit: number,
  remaining: number
): string {
  if (limit === -1) return `Unlimited ${feature}`;
  
  const featureNames: Record<string, string> = {
    bankAccounts: 'bank accounts',
    subscriptions: 'subscription detections',
    alerts: 'custom alerts',
    cancellationRequests: 'cancellation requests',
    dataExports: 'data exports'
  };

  const featureName = featureNames[feature] || feature;
  
  if (remaining === 0) {
    return `You've reached your limit of ${limit} ${featureName} for this plan.`;
  }
  
  return `${remaining} of ${limit} ${featureName} remaining this month.`;
}

export function getUpgradeMessage(planId: UsagePlanId, feature: string): string {
  const featureMessages: Record<string, Record<UsagePlanId, string>> = {
    bankAccounts: {
      free: 'Upgrade to Pro for unlimited bank accounts',
      pro: 'You already have unlimited bank accounts',
      business: 'You already have unlimited bank accounts'
    },
    subscriptions: {
      free: 'Upgrade to Pro for unlimited subscription detection',
      pro: 'You already have unlimited subscription detection',
      business: 'You already have unlimited subscription detection'
    },
    alerts: {
      free: 'Upgrade to Pro for unlimited custom alerts',
      pro: 'You already have unlimited custom alerts',
      business: 'You already have unlimited custom alerts'
    },
    cancellationRequests: {
      free: 'Upgrade to Business for cancel-for-me service',
      pro: 'Upgrade to Business for cancel-for-me service',
      business: 'You have 5 free cancellation requests per month'
    },
    dataExports: {
      free: 'Upgrade to Pro for data export capabilities',
      pro: 'You already have unlimited data exports',
      business: 'You already have unlimited data exports'
    }
  };

  return featureMessages[feature]?.[planId] || 'Upgrade for more features';
}

// Usage tracking helpers
export async function updateUsageStats(
  userId: string,
  feature: keyof UsageStats,
  increment: number = 0
): Promise<boolean> {
  try {
    const response = await fetch('/api/usage/update', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        feature,
        increment
      })
    });

    return response.ok;
  } catch (error) {
    console.error('Error updating usage stats:', error);
    return false;
  }
}

export async function getUserUsageStats(): Promise<UsageStats | null> {
  try {
    const response = await fetch('/api/usage');
    if (response.ok) {
      const data = await response.json();
      return data.usage;
    }
  } catch (error) {
    console.error('Error fetching usage stats:', error);
  }
  
  return null;
}
