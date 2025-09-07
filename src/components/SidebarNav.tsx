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
    <nav
      className={`flex flex-col justify-start gap-2 bg-background border-r border-border h-screen p-4 absolute top-0 left-0 transition-all duration-300 ease-in-out ${
        isCollapsed ? "w-16" : "w-64"
      }`}>
      {/* Toggle Button */}
      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-6 w-6 h-6 bg-background border border-border rounded-full flex items-center justify-center hover:bg-card-hover transition-colors z-10"
        title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}>
        {isCollapsed ? (
          <ChevronRightIcon className="w-3 h-3 text-muted" />
        ) : (
          <ChevronLeftIcon className="w-3 h-3 text-muted" />
        )}
      </button>

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
        {/* Connection Status */}
        <div className="space-y-2">
          <div
            className={`rounded-md p-3 bg-card-bg-start/50 border border-border transition-all duration-300 ${
              isCollapsed ? "p-2" : ""
            }`}>
            {isCollapsed ? (
              // Collapsed view - just show connection indicators
              <div className="flex flex-col items-center gap-2">
                <div
                  className="flex flex-col items-center gap-1"
                  title="BankID Connection">
                  <div className="text-xs text-muted">B</div>
                  <span
                    className={`w-2 h-2 rounded-full ${
                      bankidConnected === null
                        ? "bg-muted animate-pulse"
                        : bankidConnected
                        ? "bg-emerald-400"
                        : "bg-muted"
                    }`}
                  />
                </div>
                <div
                  className="flex flex-col items-center gap-1"
                  title="Plaid Connection">
                  <div className="text-xs text-muted">P</div>
                  <span
                    className={`w-2 h-2 rounded-full ${
                      plaidConnected === null
                        ? "bg-muted animate-pulse"
                        : plaidConnected
                        ? "bg-emerald-400"
                        : "bg-muted"
                    }`}
                  />
                </div>
                <button
                  onClick={() => setShowConnect((s) => !s)}
                  className="text-xs text-muted hover:text-foreground transition-colors mt-1"
                  title="Manage Connections">
                  <MenuIcon className="w-3 h-3" />
                </button>
              </div>
            ) : (
              // Expanded view - full connection status
              <>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-foreground">
                    Bank Connections
                  </span>
                  <button
                    onClick={() => setShowConnect((s) => !s)}
                    className="text-xs text-muted hover:text-foreground transition-colors">
                    {showConnect ? "Close" : "Manage"}
                  </button>
                </div>

                <div className="space-y-1.5">
                  {/* BankID Status */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted">BankID (Tink)</span>
                    {bankidConnected === null ? (
                      <div className="text-xs text-muted">Checking…</div>
                    ) : bankidConnected ? (
                      <div className="flex items-center gap-1 text-emerald-400 text-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        Connected
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-muted text-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-muted" />
                        Not connected
                      </div>
                    )}
                  </div>

                  {/* Plaid Status */}
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-muted">Plaid</span>
                    {plaidConnected === null ? (
                      <div className="text-xs text-muted">Checking…</div>
                    ) : plaidConnected ? (
                      <div className="flex items-center gap-1 text-emerald-400 text-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        Connected
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-muted text-xs">
                        <span className="w-1.5 h-1.5 rounded-full bg-muted" />
                        Not connected
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Connect Bank Component */}
        {showConnect && !isCollapsed && (
          <div className="mt-2 rounded-md border border-white/10 bg-white/5 p-3 animate-in slide-in-from-right-2 duration-300">
            <ConnectBank />
          </div>
        )}

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
            href="/cancellation-requests"
            className={`text-sm font-medium text-foreground hover:text-primary hover:bg-primary/10 rounded-full p-2 flex flex-row gap-2 items-center ${
              isCollapsed ? "justify-center" : ""
            }`}
            title={isCollapsed ? "Cancellation Requests" : undefined}>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
            {!isCollapsed && <span>Cancel Requests</span>}
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
  );
}
