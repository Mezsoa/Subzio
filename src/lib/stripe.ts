import Stripe from 'stripe';
import { loadStripe, Stripe as StripeJS } from '@stripe/stripe-js';

// Server-side Stripe instance (only available on server)
export const getStripeServer = () => {
  if (typeof window !== 'undefined') {
    throw new Error('getStripeServer should only be called on the server side');
  }
  
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is not set');
  }
  
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: '2025-08-27.basil',
  });
};

// Client-side Stripe instance
let stripePromise: Promise<StripeJS | null>;
export const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
  }
  return stripePromise;
};

// Subscription plans
export const STRIPE_PLANS = {
  FREE: {
    id: 'free',
    name: 'Free',
    price: 0,
    priceId: null,
    features: [
      'Connect 1 bank account',
      'Detect up to 10 subscriptions',
      'Basic cancellation guidance',
      'Monthly reports'
    ],
    limits: {
      bankAccounts: 1,
      subscriptions: 10,
      alerts: 1
    }
  },
  PRO: {
    id: 'pro',
    name: 'Pro',
    price: 999, // $9.99 in cents
    priceId: process.env.STRIPE_PRO_PRICE_ID || 'price_pro_placeholder',
    features: [
      'Unlimited bank accounts',
      'Unlimited subscription detection',
      'Advanced AI insights',
      'Custom alerts & notifications',
      'Priority support',
      'Export data (CSV/PDF)'
    ],
    limits: {
      bankAccounts: -1, // unlimited
      subscriptions: -1, // unlimited
      alerts: -1 // unlimited
    }
  },
  BUSINESS: {
    id: 'business',
    name: 'Business',
    price: 1999, // $19.99 in cents
    priceId: process.env.STRIPE_BUSINESS_PRICE_ID || 'price_business_placeholder',
    features: [
      'Everything in Pro',
      'Family/team accounts (up to 5 users)',
      'Advanced analytics & trends',
      'Bulk subscription management',
      'API access',
      'Cancel-for-me service (5 free/month)'
    ],
    limits: {
      bankAccounts: -1,
      subscriptions: -1,
      alerts: -1,
      teamMembers: 5,
      cancelService: 5
    }
  },
  PREORDER: {
    id: 'preorder',
    name: 'Pre-order Access',
    price: 1900, // $19.00 in cents
    priceId: process.env.STRIPE_PREPAY_PRICE_ID || 'price_preorder_placeholder',
    features: [
      'Lifetime 60% discount',
      'Early access to all features',
      'Unlimited bank accounts',
      'Unlimited subscription detection',
      'Advanced AI insights',
      'Priority support'
    ],
    limits: {
      bankAccounts: -1,
      subscriptions: -1,
      alerts: -1
    }
  }
} as const;

export type PlanId = keyof typeof STRIPE_PLANS;

// Helper functions
export function getPlanById(planId: string): typeof STRIPE_PLANS[PlanId] | null {
  // Convert planId to uppercase to match STRIPE_PLANS keys
  const upperPlanId = planId.toUpperCase() as PlanId;
  const plan = STRIPE_PLANS[upperPlanId] || null;
  
  // Debug logging to see what's happening
  console.log('getPlanById debug:', {
    planId,
    upperPlanId,
    plan: plan ? { ...plan, priceId: plan.priceId } : null,
    envVars: {
      STRIPE_PRO_PRICE_ID: process.env.STRIPE_PRO_PRICE_ID,
      STRIPE_BUSINESS_PRICE_ID: process.env.STRIPE_BUSINESS_PRICE_ID,
      STRIPE_PREPAY_PRICE_ID: process.env.STRIPE_PREPAY_PRICE_ID,
    }
  });
  
  return plan;
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price / 100);
}

export function isFeatureAllowed(userPlan: string, feature: string): boolean {
  // Define feature access by plan (using lowercase plan IDs)
  const featureAccess = {
    unlimited_accounts: ['pro', 'business'],
    unlimited_subscriptions: ['pro', 'business'],
    advanced_insights: ['pro', 'business'],
    custom_alerts: ['pro', 'business'],
    data_export: ['pro', 'business'],
    team_accounts: ['business'],
    api_access: ['business'],
    cancel_service: ['business'],
  };
  
  return featureAccess[feature as keyof typeof featureAccess]?.includes(userPlan.toLowerCase()) || false;
}
