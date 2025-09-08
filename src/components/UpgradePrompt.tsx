"use client";
import { useState } from 'react';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { STRIPE_PLANS, formatPrice } from '@/lib/stripe';
import { getStripe } from '@/lib/stripe';
import { authedFetch } from '@/lib/authedFetch';
import { Crown, X, Check, Zap } from 'lucide-react';

interface UpgradePromptProps {
  feature?: string;
  limit?: string;
  onClose?: () => void;
  inline?: boolean;
}

export default function UpgradePrompt({ 
  feature = "premium features", 
  limit = "usage limit",
  onClose,
  inline = false 
}: UpgradePromptProps) {
  const { plan } = useSubscription();
  const [loading, setLoading] = useState(false);

  const handleUpgrade = async (planId: 'pro' | 'business') => {
    try {
      setLoading(true);
      const response = await authedFetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Checkout API Error:', errorData);
        throw new Error(errorData.error || 'Failed to create checkout session');
      }

      const { sessionId } = await response.json();
      
      if (!sessionId) {
        throw new Error('No session ID returned from checkout creation');
      }

      const stripe = await getStripe();
      
      if (stripe) {
        await stripe.redirectToCheckout({ sessionId });
      }
    } catch (error) {
      console.error('Error creating checkout:', error);
    } finally {
      setLoading(false);
    }
  };

  // Only show upgrade prompt for free users or when plan is not loaded yet
  if (plan?.id && plan.id !== 'free') return null;

  const PromptContent = () => (
    <div className={`${inline ? 'p-6' : 'p-8'} ${inline ? '' : 'max-w-2xl mx-auto'}`}>
      {!inline && onClose && (
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-muted hover:text-foreground transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      )}
      
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-gradient-to-r from-cta-start to-cta-end rounded-full flex items-center justify-center mx-auto mb-4">
          <Crown className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-foreground mb-2">
          {limit ? `You've reached your ${limit}` : `Unlock ${feature}`}
        </h3>
        <p className="text-muted">
          Upgrade to Pro or Business to continue using KillSub without limits
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Pro Plan */}
        <div className="relative border border-border rounded-xl p-6 hover:border-primary/50 transition-colors">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-foreground">{STRIPE_PLANS.PRO.name}</h4>
            <div className="text-right">
              <div className="text-2xl font-bold text-foreground">{formatPrice(STRIPE_PLANS.PRO.price)}</div>
              <div className="text-sm text-muted">per month</div>
            </div>
          </div>
          
          <ul className="space-y-2 mb-6">
            {STRIPE_PLANS.PRO.features.slice(0, 4).map((feature, i) => (
              <li key={i} className="flex items-center text-sm text-muted">
                <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                {feature}
              </li>
            ))}
          </ul>
          
          <button
            onClick={() => handleUpgrade('pro')}
            disabled={loading}
            className="w-full bg-gradient-to-r from-cta-start to-cta-end text-white py-3 px-4 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Processing...' : 'Choose Pro'}
          </button>
        </div>

        {/* Business Plan */}
        <div className="relative border border-primary rounded-xl p-6 bg-gradient-to-br from-primary/5 to-cta-end/5">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2">
            <div className="bg-gradient-to-r from-cta-start to-cta-end text-white px-4 py-1 rounded-full text-xs font-semibold flex items-center">
              <Zap className="w-3 h-3 mr-1" />
              Most Popular
            </div>
          </div>
          
          <div className="flex items-center justify-between mb-4 mt-2">
            <h4 className="text-lg font-semibold text-foreground">{STRIPE_PLANS.BUSINESS.name}</h4>
            <div className="text-right">
              <div className="text-2xl font-bold text-foreground">{formatPrice(STRIPE_PLANS.BUSINESS.price)}</div>
              <div className="text-sm text-muted">per month</div>
            </div>
          </div>
          
          <ul className="space-y-2 mb-6">
            {STRIPE_PLANS.BUSINESS.features.slice(0, 4).map((feature, i) => (
              <li key={i} className="flex items-center text-sm text-muted">
                <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                {feature}
              </li>
            ))}
          </ul>
          
          <button
            onClick={() => handleUpgrade('business')}
            disabled={loading}
            className="w-full bg-gradient-to-r from-cta-start to-cta-end text-white py-3 px-4 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Processing...' : 'Choose Business'}
          </button>
        </div>
      </div>

      <div className="text-center text-sm text-muted">
        ✨ 7-day free trial • Cancel anytime • Secure payment by Stripe
      </div>
    </div>
  );

  if (inline) {
    return (
      <div className="border border-border rounded-xl bg-card">
        <PromptContent />
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="relative bg-background border border-border rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <PromptContent />
      </div>
    </div>
  );
}
