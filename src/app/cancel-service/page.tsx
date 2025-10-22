"use client";
import { useEffect, useState } from 'react';
import SidebarNav from "@/components/SidebarNav";
import CancelForMeService from "@/components/CancelForMeService";
import { useSidebar } from "@/contexts/SidebarContext";
import { SubscriptionProvider } from "@/contexts/SubscriptionContext";
import { authedFetch } from "@/lib/authedFetch";

export default function CancelServicePage() {
  const { isCollapsed } = useSidebar();
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSubscriptions = async () => {
      try {
        const response = await authedFetch('/api/subscriptions/detect');
        if (response.ok) {
          const data = await response.json();
          setSubscriptions(data.subscriptions || []);
        }
      } catch (error) {
        console.error('Error fetching subscriptions:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubscriptions();
  }, []);

  return (
    
      <SubscriptionProvider>
        <div className={`min-h-screen bg-background-light transition-all duration-300 ${
          isCollapsed ? 'ml-16' : 'ml-64'
        }`}>
          {/* Header */}
          <header className="border-b border-border-light bg-background-light/95 backdrop-blur-sm sticky top-0 z-10 shadow-sm">
            <div className="max-w-7xl mx-auto px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-semibold text-foreground-black">Cancel-for-Me Service</h1>
                  <p className="text-sm text-muted-light mt-1">
                    Let our team handle subscription cancellations for you
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
              <CancelForMeService subscriptions={subscriptions} />
            )}
          </main>
        </div>
        <SidebarNav />
      </SubscriptionProvider>
    
  );
}
