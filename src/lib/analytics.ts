"use client";

// Analytics events we track
export interface AnalyticsEvent {
  event: string;
  properties?: Record<string, any>;
  userId?: string;
  timestamp?: string;
}

// Event types
export const ANALYTICS_EVENTS = {
  // User Events
  USER_SIGNED_UP: 'user_signed_up',
  USER_SIGNED_IN: 'user_signed_in',
  USER_SIGNED_OUT: 'user_signed_out',
  USER_IDENTIFIED: 'user_identified',
  
  // Onboarding Events
  ONBOARDING_STARTED: 'onboarding_started',
  ONBOARDING_STEP_COMPLETED: 'onboarding_step_completed',
  ONBOARDING_COMPLETED: 'onboarding_completed',
  ONBOARDING_ABANDONED: 'onboarding_abandoned',
  
  // Bank Connection Events
  BANK_CONNECTION_STARTED: 'bank_connection_started',
  BANK_CONNECTION_COMPLETED: 'bank_connection_completed',
  BANK_CONNECTION_FAILED: 'bank_connection_failed',
  BANK_DISCONNECTED: 'bank_disconnected',
  
  // Subscription Events
  SUBSCRIPTIONS_DETECTED: 'subscriptions_detected',
  SUBSCRIPTION_VIEWED: 'subscription_viewed',
  CANCELLATION_CLICKED: 'cancellation_clicked',
  CANCELLATION_REQUEST_CREATED: 'cancellation_request_created',
  
  // Upgrade Events
  UPGRADE_PROMPT_SHOWN: 'upgrade_prompt_shown',
  UPGRADE_BUTTON_CLICKED: 'upgrade_button_clicked',
  CHECKOUT_STARTED: 'checkout_started',
  SUBSCRIPTION_CREATED: 'subscription_created',
  SUBSCRIPTION_CANCELED: 'subscription_canceled',
  
  // Affiliate Events
  AFFILIATE_LINK_CLICKED: 'affiliate_link_clicked',
  ALTERNATIVE_VIEWED: 'alternative_viewed',
  
  // Feature Usage
  DASHBOARD_VIEWED: 'dashboard_viewed',
  DATA_EXPORTED: 'data_exported',
  SUPPORT_CONTACTED: 'support_contacted',
  PAGE_VIEWED: 'page_viewed',
  CONVERSION: 'conversion',
  FUNNEL_STEP: 'funnel_step',
} as const;

type EventType = typeof ANALYTICS_EVENTS[keyof typeof ANALYTICS_EVENTS];

class Analytics {
  private userId: string | null = null;
  private sessionId: string;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.initializeUserId();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private async initializeUserId() {
    try {
      const { supabaseBrowser } = await import("@/lib/supabaseClient");
      const sb = supabaseBrowser();
      const { data: { user } } = await sb.auth.getUser();
      this.userId = user?.id || null;
    } catch (error) {
      console.error('Error initializing analytics user ID:', error);
    }
  }

  private async sendEvent(event: AnalyticsEvent) {
    try {
      // Send to our internal analytics API
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...event,
          userId: this.userId,
          sessionId: this.sessionId,
          timestamp: new Date().toISOString(),
          url: typeof window !== 'undefined' ? window.location.href : undefined,
          userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : undefined,
        }),
      });

      // Also send to Google Analytics if available
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', event.event, {
          ...event.properties,
          user_id: this.userId,
          session_id: this.sessionId,
        });
      }
    } catch (error) {
      console.error('Error sending analytics event:', error);
    }
  }

  // Public methods for tracking events
  track(event: EventType, properties?: Record<string, any>) {
    this.sendEvent({ event, properties });
  }

  identify(userId: string, traits?: Record<string, any>) {
    this.userId = userId;
    this.track(ANALYTICS_EVENTS.USER_IDENTIFIED, { userId, ...traits });
  }

  page(name: string, properties?: Record<string, any>) {
    this.track(ANALYTICS_EVENTS.PAGE_VIEWED, { page: name, ...properties });
  }

  // Conversion tracking
  trackConversion(type: 'signup' | 'subscription' | 'cancellation', value?: number, properties?: Record<string, any>) {
    this.track(ANALYTICS_EVENTS.CONVERSION, {
      conversion_type: type,
      value,
      ...properties,
    });

    // Send to Google Analytics as conversion
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('event', 'conversion', {
        send_to: 'AW-CONVERSION_ID/CONVERSION_LABEL', // Replace with actual conversion ID
        value,
        currency: 'USD',
        transaction_id: `${type}_${Date.now()}`,
      });
    }
  }

  // Funnel tracking
  trackFunnelStep(funnel: string, step: string, properties?: Record<string, any>) {
    this.track(ANALYTICS_EVENTS.FUNNEL_STEP, {
      funnel,
      step,
      ...properties,
    });
  }
}

// Singleton instance
let analyticsInstance: Analytics | null = null;

export function getAnalytics(): Analytics {
  if (typeof window === 'undefined') {
    // Return a no-op version for server-side rendering
    return {
      track: () => {},
      identify: () => {},
      page: () => {},
      trackConversion: () => {},
      trackFunnelStep: () => {},
      userId: null,
      sessionId: '',
      generateSessionId: () => '',
      initializeUserId: () => {},
      sendEvent: () => {},
    } as unknown as Analytics;
  }

  if (!analyticsInstance) {
    analyticsInstance = new Analytics();
  }

  return analyticsInstance;
}

// Convenience functions
export const analytics = {
  track: (event: EventType, properties?: Record<string, any>) => {
    getAnalytics().track(event, properties);
  },
  
  identify: (userId: string, traits?: Record<string, any>) => {
    getAnalytics().identify(userId, traits);
  },
  
  page: (name: string, properties?: Record<string, any>) => {
    getAnalytics().page(name, properties);
  },
  
  trackConversion: (type: 'signup' | 'subscription' | 'cancellation', value?: number, properties?: Record<string, any>) => {
    getAnalytics().trackConversion(type, value, properties);
  },
  
  trackFunnelStep: (funnel: string, step: string, properties?: Record<string, any>) => {
    getAnalytics().trackFunnelStep(funnel, step, properties);
  },
};

// React hook for analytics
export function useAnalytics() {
  return analytics;
}
