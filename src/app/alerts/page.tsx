"use client";
import RequireAuth from "@/components/auth/RequireAuth";
import SidebarNav from "@/components/SidebarNav";
import AlertsManager from "@/components/AlertsManager";
import { useSidebar } from "@/contexts/SidebarContext";
import { SubscriptionProvider } from "@/contexts/SubscriptionContext";

export default function AlertsPage() {
  const { isCollapsed } = useSidebar();

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
                  <h1 className="text-2xl font-semibold text-foreground-black">Custom Alerts</h1>
                  <p className="text-sm text-muted-light mt-1">
                    Stay informed about your subscription spending and changes
                  </p>
                </div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="max-w-7xl mx-auto px-6 py-8">
            <AlertsManager />
          </main>
        </div>
        <SidebarNav />
      </SubscriptionProvider>
    </RequireAuth>
  );
}
