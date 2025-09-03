"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabaseClient";
import { authedFetch } from "@/lib/authedFetch";
import { HomeIcon, LayoutDashboardIcon } from "lucide-react";
import SignOut from "./ui/signOut";
import ConnectBank from "./ConnectBank";

export default function SidebarNav() {
  const [displayName, setDisplayName] = useState<string>("");
  const [connected, setConnected] = useState<boolean | null>(null);
  const [ showConnect, setShowConnect ] = useState(false);
  
  useEffect(() => {
    (async () => {
      try {
        const response = await authedFetch("/api/bankid/accounts");
        setConnected(response.ok);
      } catch {
        setConnected(false);
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
    <nav className="flex flex-col justify-start gap-2 bg-background border-r border-border w-64 h-screen p-4 absolute top-0 left-0">
      <div className="flex flex-row gap-2 mb-4 text-center items-center justify-center border-b border-border pb-4">
        <div className="text-[10px] uppercase tracking-wide text-muted">
          Signed in as
        </div>
        <div className="text-sm font-medium text-foreground break-words">
          {displayName || "Guest"}
        </div>
      </div>
      <section className="flex flex-col gap-2 h-full">

       
        <div className="flex flex-row gap-2 items-center">
          <Link
            href="/dashboard"
            className="text-sm font-medium text-foreground hover:text-primary hover:bg-primary/10 rounded-full p-2 flex flex-row gap-2 items-center">
           <LayoutDashboardIcon className="w-4 h-4" /> dashboard
          </Link>
        </div>
        <div className="flex items-center justify-between gap-0 rounded-md p-[8px] bg-white/5 border border-white/10">
          {connected ? (
            <Link href="/dashboard" className="text-sm font-medium text-foreground hover:text-primary hover:bg-primary/10 rounded-md px-2 py-1">
              Connected
            </Link>
          ) : (
            <button
              onClick={() => setShowConnect((s) => !s)}
              className="text-sm font-medium text-foreground hover:text-primary hover:bg-primary/10 rounded-md px-2 py-1"
            >
              {showConnect ? "Close" : "Connect bank"}
            </button>
          )}
          {connected === null ? (
            <div className="text-xs text-muted">Checking…</div>
          ) : connected ? (
            <div className="flex items-center gap-1 text-emerald-400 text-xs"><span className="w-2 h-2 rounded-full bg-emerald-400" /> Connected</div>
          ) : (
            <div className="flex items-center gap-1 text-amber-400 text-xs"><span className="w-2 h-2 rounded-full bg-amber-400" /> Not connected</div>
          )}
        </div>
        <div className={`overflow-hidden transition-all duration-300 ${showConnect ? "max-h-[300px] mt-2 opacity-100" : "max-h-0 opacity-0"}`}>
          <div className="rounded-md border border-white/10 bg-white/5 p-3">
            <ConnectBank />
          </div>
        </div>
      </section>
      <SignOut />
    </nav>
  );
}
