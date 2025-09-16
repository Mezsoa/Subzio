"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { supabaseBrowser } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useErrorNotifications } from "@/contexts/ErrorContext";
import { Menu, X } from "lucide-react";


type SessionUser = {
  email?: string | null;
  user_metadata?: { name?: string | null };
} | null;

export default function Navbar() {
  const [, setUser] = useState<SessionUser>(null);
  const [email, setEmail] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
        <div className="flex items-center gap-4 sm:gap-8">
          <Link
            href="/"
            className="text-xs sm:text-sm font-semibold tracking-tight text-foreground">
            KillSub -{" "}
            <span className="text-muted text-[10px] sm:text-xs hidden sm:inline">
              the last subscription killer
            </span>
          </Link>
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/blog"
              className="text-sm text-muted hover:text-foreground transition">
              Blog
            </Link>
            <Link
              href="/guides"
              className="text-sm text-muted hover:text-foreground transition">
              Guides
            </Link>
            <Link
              href="/tools"
              className="text-sm text-muted hover:text-foreground transition">
              Tools
            </Link>
          </div>
        </div>
        
        {/* Desktop Auth */}
        <div className="hidden sm:flex items-center gap-2 sm:gap-6">
          <input 
            type="text" 
            className="w-32 sm:w-48 h-8 rounded-md border border-white/0 text-xs sm:text-sm text-foreground px-2" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
          />          
          <button 
            className="inline-flex items-center justify-center h-8 px-2 sm:px-4 rounded-md border border-white/0 text-xs sm:text-sm text-foreground hover:bg-white/10" 
            onClick={() => {
              if (email === authEmails) {
                router.push("/auth/signin");
              } else {
                showError("Only Authorized Users Can Access as of now");
              }
            }}>
            {email === authEmails ? "authorized" : "check"}
          </button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="sm:hidden rounded-md p-2 text-foreground hover:bg-white/10 transition"
        >
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="sm:hidden fixed inset-x-0 top-16 z-50 bg-background border-b border-border">
          <div className="flex flex-col space-y-1 px-4 py-3">
            <Link 
              href="/blog" 
              className="py-2 text-base font-medium text-muted hover:text-foreground transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Blog
            </Link>
            <Link 
              href="/guides" 
              className="py-2 text-base font-medium text-muted hover:text-foreground transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Guides
            </Link>
            <Link 
              href="/tools" 
              className="py-2 text-base font-medium text-muted hover:text-foreground transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Tools
            </Link>
            
            <div className="pt-4 border-t border-border mt-4 space-y-3">
              <input 
                type="text" 
                className="w-full h-10 rounded-md border border-white/10 text-sm text-foreground px-3 bg-transparent" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email to access"
              />
              <button 
                className="w-full h-10 rounded-md border border-white/10 text-sm text-foreground hover:bg-white/10 transition" 
                onClick={() => {
                  if (email === authEmails) {
                    router.push("/auth/signin");
                    setMobileMenuOpen(false);
                  } else {
                    showError("Only Authorized Users Can Access as of now");
                  }
                }}>
                {email === authEmails ? "Access Dashboard" : "Check Access"}
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
