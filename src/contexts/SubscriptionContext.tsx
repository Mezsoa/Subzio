"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode, useMemo, useCallback } from 'react';
import { getPlanById, isFeatureAllowed } from '@/lib/stripe';
import { UsagePlanId } from '@/lib/usageLimits';
import { authedFetch } from '@/lib/authedFetch';

interface UserSubscription {
  id?: string;
  user_id: string;
  plan_id: UsagePlanId;
  status: string;
  current_period_start?: string;
  current_period_end?: string;
  trial_end?: string;
  canceled_at?: string;
}

interface UserUsage {
  bank_accounts_connected: number;
  subscriptions_detected: number;
  alerts_created: number;
  cancellation_requests: number;
}

interface SubscriptionContextType {
  subscription: UserSubscription | null;
  usage: UserUsage | null;
  loading: boolean;
  plan: ReturnType<typeof getPlanById>;
  isFeatureAllowed: (feature: string) => boolean;
  isLimitReached: (limit: keyof UserUsage) => boolean;
  refreshSubscription: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider = ({ children }: { children: ReactNode }) => {
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [usage, setUsage] = useState<UserUsage | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSubscription = useCallback(async () => {
    try {
      setLoading(true);
      
      // Check if we're on the client side and user is authenticated
      if (typeof window === 'undefined') {
        setLoading(false);
        return;
      }

      const [subRes, usageRes] = await Promise.all([
        authedFetch('/api/user/subscription').catch(() => ({ ok: false })),
        authedFetch('/api/user/usage').catch(() => ({ ok: false }))
      ]);
      
      if (subRes.ok && 'json' in subRes) {
        const { subscription: sub } = await subRes.json();
        setSubscription(sub);
      } else {
        // Set default free subscription if API fails
        setSubscription({
          user_id: 'unknown',
          plan_id: 'free' as UsagePlanId,
          status: 'active',
        });
      }
      
      if (usageRes.ok && 'json' in usageRes) {
        const { usage: userUsage } = await usageRes.json();
        setUsage(userUsage);
      } else {
        // Set default usage if API fails
        setUsage({
          bank_accounts_connected: 0,
          subscriptions_detected: 0,
          alerts_created: 0,
          cancellation_requests: 0,
        });
      }
    } catch (error) {
      console.error('Error fetching subscription:', error);
      // Set defaults on error
      setSubscription({
        user_id: 'unknown',
        plan_id: 'free' as UsagePlanId,
        status: 'active',
      });
      setUsage({
        bank_accounts_connected: 0,
        subscriptions_detected: 0,
        alerts_created: 0,
        cancellation_requests: 0,
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSubscription();
  }, [fetchSubscription]);

  // Memoize currentPlan to prevent unnecessary recalculations
  const currentPlan = useMemo(() => {
    return subscription ? getPlanById(subscription.plan_id) : getPlanById('free');
  }, [subscription]);
  
  const checkFeatureAllowed = useCallback((feature: string) => {
    if (!subscription) return false;
    // Allow access to features if subscription is active OR trialing
    if (subscription.status !== 'active' && subscription.status !== 'trialing') return false;
    return isFeatureAllowed(subscription.plan_id.toUpperCase() as 'FREE' | 'PRO' | 'BUSINESS', feature);
  }, [subscription]);

  const checkLimitReached = useCallback((limit: keyof UserUsage) => {
    if (!usage || !currentPlan?.limits) return false;
    
    const planLimit = currentPlan.limits[limit as keyof typeof currentPlan.limits];
    if (planLimit === -1) return false; // unlimited
    
    return usage[limit] >= planLimit;
  }, [usage, currentPlan]);

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(() => ({
    subscription,
    usage,
    loading,
    plan: currentPlan,
    isFeatureAllowed: checkFeatureAllowed,
    isLimitReached: checkLimitReached,
    refreshSubscription: fetchSubscription,
  }), [subscription, usage, loading, currentPlan, checkFeatureAllowed, checkLimitReached, fetchSubscription]);

  return (
    <SubscriptionContext.Provider value={contextValue}>
      {children}
    </SubscriptionContext.Provider>
  );
};

// Memoize the default context to prevent recreating it on every call
const defaultContext = {
  subscription: {
    user_id: 'unknown',
    plan_id: 'free' as UsagePlanId,
    status: 'active',
  },
  usage: {
    bank_accounts_connected: 0,
    subscriptions_detected: 0,
    alerts_created: 0,
    cancellation_requests: 0,
  },
  loading: false,
  plan: getPlanById('free'),
  isFeatureAllowed: () => false,
  isLimitReached: () => false,
  refreshSubscription: async () => {},
};

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    // Provide default values instead of throwing an error
    return defaultContext;
  }
  return context;
};
