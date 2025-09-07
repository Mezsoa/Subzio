"use client";
import { ReactNode } from 'react';
import { SidebarProvider } from "@/contexts/SidebarContext";
import { SubscriptionProvider } from "@/contexts/SubscriptionContext";

interface AppProvidersProps {
  children: ReactNode;
}

export default function AppProviders({ children }: AppProvidersProps) {
  return (
    <SubscriptionProvider>
      <SidebarProvider>
        {children}
      </SidebarProvider>
    </SubscriptionProvider>
  );
}
