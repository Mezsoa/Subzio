"use client";
import { useEffect, useState } from 'react';
import RequireAuth from "@/components/auth/RequireAuth";
import SidebarNav from "@/components/SidebarNav";
import AdvancedAnalytics from "@/components/AdvancedAnalytics";
import { useSidebar } from "@/contexts/SidebarContext";
import { SubscriptionProvider } from "@/contexts/SubscriptionContext";
import { authedFetch } from "@/lib/authedFetch";

export default function AnalyticsPage() {
  const { isCollapsed } = useSidebar();
  const [subscriptions, setSubscriptions] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch subscriptions
        const subsResponse = await authedFetch('/api/subscriptions/detect');
        if (subsResponse.ok) {
          const subsData = await subsResponse.json();
          setSubscriptions(subsData.subscriptions || []);
        }

        // Fetch transactions
        const txResponse = await authedFetch('/api/bankid/transactions').catch(() => 
          authedFetch('/api/plaid/transactions')
        );
        if (txResponse && txResponse.ok) {
          const txData = await txResponse.json();
          setTransactions(txData.transactions || []);
        }
      } catch (error) {
        console.error('Error fetching data for analytics:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <RequireAuth>
      <SubscriptionProvider>
        <div className={`min-h-screen bg-background-light transition-all duration-300 ${
          isCollapsed ? 'ml-16' : 'ml-64'
        }`}>
          {/* Header */}
          <header className="border-b border-border-light bg-background-light/95 backdrop-blur-sm sticky top-0 z-10 shadow-sm">
            <div className="max-w-7xl mx-auto px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-semibold text-foreground-black">Advanced Analytics</h1>
                  <p className="text-sm text-muted-light mt-1">
                    Deep insights into your subscription spending patterns and trends
                  </p>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="max-w-7xl mx-auto px-6 py-8">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <AdvancedAnalytics 
                subscriptions={subscriptions} 
                transactions={transactions}
              />
            )}
          </main>
        </div>
        <SidebarNav />
      </SubscriptionProvider>
    </RequireAuth>
  );
}
