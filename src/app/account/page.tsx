"use client";
import { useState, useEffect } from 'react';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { STRIPE_PLANS, formatPrice } from '@/lib/stripe';
import { getStripe } from '@/lib/stripe';
import { authedFetch } from '@/lib/authedFetch';
import RequireAuth from '@/components/auth/RequireAuth';
import SidebarNav from '@/components/SidebarNav';
import { useSidebar } from '@/contexts/SidebarContext';
import AppProviders from '@/components/AppProviders';
import { 
  User, 
  CreditCard, 
  Calendar, 
  Crown, 
  Settings, 
  Download,
  AlertCircle,
  Check,
  X
} from 'lucide-react';

export default function AccountPage() {
  const { subscription, usage, plan, loading, refreshSubscription } = useSubscription();
  const { isCollapsed } = useSidebar();
  const [user, setUser] = useState<any>(null);
  const [upgradeLoading, setUpgradeLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      const { supabaseBrowser } = await import("@/lib/supabaseClient");
      const sb = supabaseBrowser();
      const { data: { user } } = await sb.auth.getUser();
      setUser(user);
    };
    fetchUser();
  }, []);

  const handleUpgrade = async (planId: 'pro' | 'business') => {
    try {
      setUpgradeLoading(true);
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
      setUpgradeLoading(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (!confirm('Are you sure you want to cancel your subscription?')) return;
    
    try {
      setCancelLoading(true);
      const response = await authedFetch('/api/stripe/cancel-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (response.ok) {
        await refreshSubscription();
        alert('Subscription canceled successfully');
      }
    } catch (error) {
      console.error('Error canceling subscription:', error);
      alert('Error canceling subscription');
    } finally {
      setCancelLoading(false);
    }
  };

  if (loading) {
    return (
      <RequireAuth>
        <AppProviders>
          <div className={`min-h-screen bg-background-light transition-all duration-300 ${
            isCollapsed ? 'ml-16' : 'ml-64'
          }`}>
            <div className="flex items-center justify-center h-screen">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          </div>
          <SidebarNav />
        </AppProviders>
      </RequireAuth>
    );
  }

  return (
    <RequireAuth>
      <AppProviders>
      <div className={`min-h-screen bg-background-light transition-all duration-300 ${
        isCollapsed ? 'ml-16' : 'ml-64'
      }`}>
        {/* Header */}
        <header className="border-b border-border-light bg-background-light/95 backdrop-blur-sm sticky top-0 z-10 shadow-sm">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-semibold text-foreground-black">Account Settings</h1>
                <p className="text-sm text-muted-light mt-1">Manage your subscription and account preferences</p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Account Info */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Profile Section */}
              <section className="bg-gradient-to-br from-card-bg-start-light to-card-bg-end-light border border-border-light rounded-xl p-6 shadow-sm">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  <h2 className="text-xl font-semibold text-foreground-black">Profile Information</h2>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground-black">Email</label>
                    <div className="mt-1 text-muted-light">{user?.email}</div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground-black">Member since</label>
                    <div className="mt-1 text-muted-light">
                      {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
                    </div>
                  </div>
                </div>
              </section>

              {/* Current Plan */}
              <section className="bg-gradient-to-br from-card-bg-start-light to-card-bg-end-light border border-border-light rounded-xl p-6 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Crown className="w-4 h-4 text-primary" />
                    </div>
                    <h2 className="text-xl font-semibold text-foreground-black">Current Plan</h2>
                  </div>
                  
                  {plan.id !== 'free' && subscription?.status === 'active' && (
                    <div className="flex items-center space-x-2 text-green-600 text-sm">
                      <Check className="w-4 h-4" />
                      <span>Active</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between p-4 bg-background-light-mid/50 rounded-lg mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground-black">{plan.name}</h3>
                    <p className="text-muted-light">
                      {plan.price === 0 ? 'Free forever' : `${formatPrice(plan.price)}/month`}
                    </p>
                  </div>
                  
                  {subscription?.current_period_end && (
                    <div className="text-right">
                      <div className="text-sm text-muted-light">Renews on</div>
                      <div className="font-medium text-foreground-black">
                       {new Date(subscription.current_period_end as string).toLocaleDateString()}
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <div>
                    <h4 className="font-medium text-foreground-black mb-2">Plan Features</h4>
                    <ul className="space-y-1">
                      {plan.features.slice(0, 3).map((feature, i) => (
                        <li key={i} className="flex items-center text-sm text-muted-light">
                          <Check className="w-3 h-3 text-green-500 mr-2" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-foreground-black mb-2">Usage This Month</h4>
                    <div className="space-y-1 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-light">Bank Accounts:</span>
                        <span className="text-foreground-black">
                          {usage?.bank_accounts_connected || 0}
                          {plan.limits?.bankAccounts !== -1 && ` / ${plan.limits?.bankAccounts || 0}`}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-light">Subscriptions:</span>
                        <span className="text-foreground-black">
                          {usage?.subscriptions_detected || 0}
                          {plan.limits?.subscriptions !== -1 && ` / ${plan.limits?.subscriptions || 0}`}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  {plan.id === 'free' && (
                    <>
                      <button
                        onClick={() => handleUpgrade('pro')}
                        disabled={upgradeLoading}
                        className="bg-gradient-to-r from-cta-start to-cta-end text-white px-6 py-2 rounded-lg font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
                      >
                        {upgradeLoading ? 'Processing...' : 'Upgrade to Pro'}
                      </button>
                      <button
                        onClick={() => handleUpgrade('business')}
                        disabled={upgradeLoading}
                        className="border border-primary text-primary px-6 py-2 rounded-lg font-medium hover:bg-primary/5 transition-colors"
                      >
                        Upgrade to Business
                      </button>
                    </>
                  )}
                  
                  {plan.id !== 'free' && subscription?.status === 'active' && (
                    <button
                      onClick={handleCancelSubscription}
                      disabled={cancelLoading}
                      className="border border-red-300 text-red-600 px-6 py-2 rounded-lg font-medium hover:bg-red-50 transition-colors disabled:opacity-50"
                    >
                      {cancelLoading ? 'Canceling...' : 'Cancel Subscription'}
                    </button>
                  )}
                </div>
              </section>

              {/* Billing History */}
              {plan.id !== 'free' && (
                <section className="bg-gradient-to-br from-card-bg-start-light to-card-bg-end-light border border-border-light rounded-xl p-6 shadow-sm">
                  <div className="flex items-center space-x-3 mb-6">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <CreditCard className="w-4 h-4 text-primary" />
                    </div>
                    <h2 className="text-xl font-semibold text-foreground-black">Billing History</h2>
                  </div>
                  
                  <div className="text-center py-8 text-muted-light">
                    <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p>No billing history available</p>
                    <p className="text-sm">Invoices will appear here after your first payment</p>
                  </div>
                </section>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              
              {/* Quick Actions */}
              <div className="bg-gradient-to-br from-card-bg-start-light to-card-bg-end-light border border-border-light rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-foreground-black mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-card-hover-light transition-colors">
                    <Download className="w-4 h-4 text-muted-light" />
                    <span className="text-sm text-foreground-black">Export Data</span>
                  </button>
                  <button className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-card-hover-light transition-colors">
                    <Settings className="w-4 h-4 text-muted-light" />
                    <span className="text-sm text-foreground-black">Account Settings</span>
                  </button>
                </div>
              </div>

              {/* Support */}
              <div className="bg-gradient-to-br from-card-bg-start-light to-card-bg-end-light border border-border-light rounded-xl p-6 shadow-sm">
                <h3 className="font-semibold text-foreground-black mb-4">Need Help?</h3>
                <div className="space-y-3">
                  <a 
                    href="/support"
                    className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-card-hover-light transition-colors"
                  >
                    <AlertCircle className="w-4 h-4 text-muted-light" />
                    <span className="text-sm text-foreground-black">Contact Support</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
      <SidebarNav />
      </AppProviders>
    </RequireAuth>
  );
}
