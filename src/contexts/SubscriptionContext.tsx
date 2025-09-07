"use client";
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { STRIPE_PLANS, PlanId, isFeatureAllowed } from '@/lib/stripe';

interface UserSubscription {
  id?: string;
  user_id: string;
  plan_id: PlanId;
  status: string;
  current_period_start?: string;
  current_period_end?: string;
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
  plan: typeof STRIPE_PLANS[PlanId];
  isFeatureAllowed: (feature: string) => boolean;
  isLimitReached: (limit: keyof UserUsage) => boolean;
  refreshSubscription: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider = ({ children }: { children: ReactNode }) => {
  const [subscription, setSubscription] = useState<UserSubscription | null>(null);
  const [usage, setUsage] = useState<UserUsage | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSubscription = async () => {
    try {
      setLoading(true);
      const [subRes, usageRes] = await Promise.all([
        fetch('/api/user/subscription'),
        fetch('/api/user/usage')
      ]);
      
      if (subRes.ok) {
        const { subscription: sub } = await subRes.json();
        setSubscription(sub);
      }
      
      if (usageRes.ok) {
        const { usage: userUsage } = await usageRes.json();
        setUsage(userUsage);
      }
    } catch (error) {
      console.error('Error fetching subscription:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscription();
  }, []);

  const currentPlan = subscription ? STRIPE_PLANS[subscription.plan_id] : STRIPE_PLANS.FREE;
  
  const checkFeatureAllowed = (feature: string) => {
    if (!subscription) return false;
    return isFeatureAllowed(subscription.plan_id, feature);
  };

  const checkLimitReached = (limit: keyof UserUsage) => {
    if (!usage || !currentPlan.limits) return false;
    
    const planLimit = currentPlan.limits[limit as keyof typeof currentPlan.limits];
    if (planLimit === -1) return false; // unlimited
    
    return usage[limit] >= planLimit;
  };

  return (
    <SubscriptionContext.Provider value={{
      subscription,
      usage,
      loading,
      plan: currentPlan,
      isFeatureAllowed: checkFeatureAllowed,
      isLimitReached: checkLimitReached,
      refreshSubscription: fetchSubscription,
    }}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};
