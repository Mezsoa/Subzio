"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useErrorNotifications } from "@/contexts/ErrorContext";


type SessionUser = {
  email?: string | null;
  user_metadata?: { name?: string | null };
} | null;

export default function Navbar() {
  const [, setUser] = useState<SessionUser>(null);
  const [email, setEmail] = useState("");
  const { showError } = useErrorNotifications();

  const router = useRouter();

  useEffect(() => {
    const sb = supabaseBrowser();
    sb.auth.getUser().then(({ data }) => setUser(data.user ?? null));
    const { data: sub } = sb.auth.onAuthStateChange((_evt, session) => {
      setUser(session?.user ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  const authEmails ="johnmessoa@gmail.com";
  // removed unused initials computation

  return (
    <header className="w-full border-b border-border bg-background">
      <nav className="mx-auto max-w-screen w-[90%] px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="text-sm font-semibold tracking-tight text-foreground w-full">
          KillSub -{" "}
          <span className="text-muted text-xs">
            the last subscription killer
          </span>
        </Link>
        <div className="flex items-center gap-6 w-full justify-end">
          <input type="text" className="w-48 h-8 rounded-md border border-white/10 text-sm text-foreground" value={email} onChange={(e) => setEmail(e.target.value)}/>          
          <button className="inline-flex items-center justify-center h-8 px-4 rounded-md border border-white/ 0 text-sm text-foreground hover:bg-white/10" onClick={() => {
            if (email === authEmails) {
              router.push("/auth/signin");
            } else {
              showError("Only Authorized Users Can Access as of now");
            }
          }}>
            {email === authEmails ? "authorized" : ""}
          </button>
        </div>
      </nav>
    </header>
  );
}
