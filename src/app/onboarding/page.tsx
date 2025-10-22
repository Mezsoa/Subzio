"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import OnboardingFlow from '@/components/OnboardingFlow';
import { SubscriptionProvider } from '@/contexts/SubscriptionContext';

export default function OnboardingPage() {
  const [shouldShowOnboarding, setShouldShowOnboarding] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check if onboarding has been completed
    const onboardingCompleted = localStorage.getItem('onboarding_completed');
    
    if (onboardingCompleted === 'true') {
      router.push('/dashboard');
    } else {
      setShouldShowOnboarding(true);
    }
    
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background-light flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!shouldShowOnboarding) {
    return null;
  }

  return (
    
      <SubscriptionProvider>
        <OnboardingFlow />
      </SubscriptionProvider>
    
  );
}
