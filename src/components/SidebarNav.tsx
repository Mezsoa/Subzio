"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabaseClient";
import { authedFetch } from "@/lib/authedFetch";
import {
  LayoutDashboardIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  MenuIcon,
} from "lucide-react";
import SignOut from "./ui/signOut";
import ConnectBank from "./ConnectBank";
import { useSidebar } from "@/contexts/SidebarContext";

export default function SidebarNav() {
  const [displayName, setDisplayName] = useState<string>("");
  const [bankidConnected, setBankidConnected] = useState<boolean | null>(null);
  const [plaidConnected, setPlaidConnected] = useState<boolean | null>(null);
  const [showConnect, setShowConnect] = useState(false);
  const { isCollapsed, toggleSidebar } = useSidebar();

  useEffect(() => {
    (async () => {
      try {
        // Check both providers separately
        const [tinkRes, plaidRes] = await Promise.all([
          authedFetch("/api/bankid/accounts").catch(
            () => new Response(null, { status: 500 })
          ),
          authedFetch("/api/plaid/accounts").catch(
            () => new Response(null, { status: 500 })
          ),
        ]);
        setBankidConnected(tinkRes?.ok ?? false);
        setPlaidConnected(plaidRes?.ok ?? false);
      } catch {
        setBankidConnected(false);
        setPlaidConnected(false);
      }
    })();
  }, []);

  useEffect(() => {
    const sb = supabaseBrowser();
    sb.auth.getUser().then(({ data }) => {
      const u = data.user;
      const name = (u?.user_metadata as { name?: string })?.name;
      setDisplayName(name || (u?.email ?? ""));
    });
    const { data: sub } = sb.auth.onAuthStateChange((_evt, session) => {
      const u = session?.user;
      const name = (u?.user_metadata as { name?: string })?.name;
      setDisplayName(name || (u?.email ?? ""));
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  return (
    <>
      {/* Mobile overlay */}
      {!isCollapsed && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={toggleSidebar}
        />
      )}
      
      <nav
        className={`flex flex-col justify-start gap-2 bg-background border-r border-border h-screen p-4 absolute top-0 left-0 transition-all duration-300 ease-in-out z-50 ${
          isCollapsed ? "w-16" : "w-64"
        } ${
          isCollapsed ? "-translate-x-full md:translate-x-0" : "translate-x-0"
        }`}>
      {/* Toggle Button - only visible when sidebar is expanded */}
      {!isCollapsed && (
        <button
          onClick={toggleSidebar}
          className="absolute -right-3 top-6 w-6 h-6 bg-background border border-border rounded-full flex items-center justify-center hover:bg-card-hover transition-colors z-10"
          title="Collapse sidebar">
          <ChevronLeftIcon className="w-3 h-3 text-muted" />
        </button>
      )}

      {/* Mobile Menu Button - only visible when sidebar is collapsed on mobile */}
      {isCollapsed && (
        <button
          onClick={toggleSidebar}
          className="fixed top-4 left-18 w-10 h-10 bg-background border border-border rounded-lg flex items-center justify-center hover:bg-card-hover transition-colors z-50 md:hidden"
          title="Open menu">
          <MenuIcon className="w-5 h-5 text-muted" />
        </button>
      )}

      {/* User Info */}
      <div
        className={`flex flex-row gap-2 mb-4 text-center items-center justify-center border-b border-border pb-4 ${
          isCollapsed ? "opacity-0" : "opacity-100"
        } transition-opacity duration-300`}>
        {!isCollapsed && (
          <>
            <div className="text-[10px] uppercase tracking-wide text-muted">
              Signed in as
            </div>
            <div className="text-sm font-medium text-foreground break-words">
              {displayName || "Guest"}
            </div>
          </>
        )}
      </div>

      <section className="flex flex-col gap-2 h-full">
        

        {/* Navigation Links */}
        <div className="space-y-2">
          <Link
            href="/dashboard"
            className={`text-sm font-medium text-foreground hover:text-primary hover:bg-primary/10 rounded-full p-2 flex flex-row gap-2 items-center ${
              isCollapsed ? "justify-center" : ""
            }`}
            title={isCollapsed ? "Dashboard" : undefined}>
            <LayoutDashboardIcon className="w-4 h-4" />
            {!isCollapsed && <span>Dashboard</span>}
          </Link>
          
          <Link
            href="/alerts"
            className={`text-sm font-medium text-foreground hover:text-primary hover:bg-primary/10 rounded-full p-2 flex flex-row gap-2 items-center ${
              isCollapsed ? "justify-center" : ""
            }`}
            title={isCollapsed ? "Alerts" : undefined}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM11 19H6.5A2.5 2.5 0 014 16.5v-9A2.5 2.5 0 016.5 5h11A2.5 2.5 0 0120 7.5V11" />
            </svg>
            {!isCollapsed && <span>Alerts</span>}
          </Link>
          
          <Link
            href="/export"
            className={`text-sm font-medium text-foreground hover:text-primary hover:bg-primary/10 rounded-full p-2 flex flex-row gap-2 items-center ${
              isCollapsed ? "justify-center" : ""
            }`}
            title={isCollapsed ? "Export Data" : undefined}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {!isCollapsed && <span>Export</span>}
          </Link>
          
          <Link
            href="/analytics"
            className={`text-sm font-medium text-foreground hover:text-primary hover:bg-primary/10 rounded-full p-2 flex flex-row gap-2 items-center ${
              isCollapsed ? "justify-center" : ""
            }`}
            title={isCollapsed ? "Analytics" : undefined}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            {!isCollapsed && <span>Analytics</span>}
          </Link>
          
          <Link
            href="/account"
            className={`text-sm font-medium text-foreground hover:text-primary hover:bg-primary/10 rounded-full p-2 flex flex-row gap-2 items-center ${
              isCollapsed ? "justify-center" : ""
            }`}
            title={isCollapsed ? "Account" : undefined}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            {!isCollapsed && <span>Account</span>}
          </Link>
          
          <Link
            href="/cancel-service"
            className={`text-sm font-medium text-foreground hover:text-primary hover:bg-primary/10 rounded-full p-2 flex flex-row gap-2 items-center ${
              isCollapsed ? "justify-center" : ""
            }`}
            title={isCollapsed ? "Cancel Service" : undefined}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            {!isCollapsed && <span>Cancel Service</span>}
          </Link>
          
          <Link
            href="/support"
            className={`text-sm font-medium text-foreground hover:text-primary hover:bg-primary/10 rounded-full p-2 flex flex-row gap-2 items-center ${
              isCollapsed ? "justify-center" : ""
            }`}
            title={isCollapsed ? "Support" : undefined}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {!isCollapsed && <span>Support</span>}
          </Link>
        </div>
      </section>

      {/* Sign Out */}
      <div className={isCollapsed ? "flex justify-center" : ""}>
        <SignOut />
      </div>
    </nav>
    </>
  );
}
