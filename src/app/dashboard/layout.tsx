"use client";
import { SidebarProvider } from "@/contexts/SidebarContext";
import { SubscriptionProvider } from "@/contexts/SubscriptionContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SubscriptionProvider>
      <SidebarProvider>
        {children}
      </SidebarProvider>
    </SubscriptionProvider>
  );
}
