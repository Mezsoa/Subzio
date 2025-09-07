import Stripe from 'stripe';
import { loadStripe } from '@stripe/stripe-js';

// Server-side Stripe instance
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
});

// Client-side Stripe instance
let stripePromise: Promise<Stripe | null>;
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
    priceId: process.env.STRIPE_PRO_PRICE_ID!,
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
    priceId: process.env.STRIPE_BUSINESS_PRICE_ID!,
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
  }
} as const;

export type PlanId = keyof typeof STRIPE_PLANS;

// Helper functions
export function getPlanById(planId: string): typeof STRIPE_PLANS[PlanId] | null {
  return STRIPE_PLANS[planId as PlanId] || null;
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price / 100);
}

export function isFeatureAllowed(userPlan: PlanId, feature: string): boolean {
  // Define feature access by plan
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
  
  return featureAccess[feature as keyof typeof featureAccess]?.includes(userPlan) || false;
}
