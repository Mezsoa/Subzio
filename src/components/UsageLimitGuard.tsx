"use client";
import { ReactNode, useState } from 'react';
import { useSubscription } from '@/contexts/SubscriptionContext';
import UpgradePrompt from './UpgradePrompt';

interface UsageLimitGuardProps {
  children: ReactNode;
  feature: string;
  limit: keyof typeof useSubscription extends () => infer T ? T extends { usage: infer U } ? keyof U : never : never;
  fallback?: ReactNode;
}

export default function UsageLimitGuard({ 
  children, 
  feature, 
  limit, 
  fallback 
}: UsageLimitGuardProps) {
  const { isLimitReached, isFeatureAllowed } = useSubscription();
  const [showUpgrade, setShowUpgrade] = useState(false);

  // Check if feature is allowed by plan
  if (!isFeatureAllowed(feature)) {
    return (
      <div className="relative">
        {fallback || (
          <div className="opacity-50 pointer-events-none">
            {children}
          </div>
        )}
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-lg">
          <button
            onClick={() => setShowUpgrade(true)}
            className="bg-gradient-to-r from-cta-start to-cta-end text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Upgrade to unlock {feature}
          </button>
        </div>
        {showUpgrade && (
          <UpgradePrompt 
            feature={feature}
            onClose={() => setShowUpgrade(false)}
          />
        )}
      </div>
    );
  }

  // Check if usage limit is reached
  if (isLimitReached(limit)) {
    return (
      <div className="relative">
        {fallback || (
          <div className="opacity-50 pointer-events-none">
            {children}
          </div>
        )}
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm rounded-lg">
          <button
            onClick={() => setShowUpgrade(true)}
            className="bg-gradient-to-r from-cta-start to-cta-end text-white px-6 py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Upgrade for unlimited access
          </button>
        </div>
        {showUpgrade && (
          <UpgradePrompt 
            limit={`${limit} limit`}
            onClose={() => setShowUpgrade(false)}
          />
        )}
      </div>
    );
  }

  return <>{children}</>;
}
