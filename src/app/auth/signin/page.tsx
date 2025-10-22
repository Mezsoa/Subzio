"use client";
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { supabaseBrowser } from "@/lib/supabaseClient";
import AuthButtons from "@/components/AuthButtons";

function SignInForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">(
    "idle"
  );
  const [msg, setMsg] = useState<string>("");
  const searchParams = useSearchParams();

  // Check for error parameters and handle session from URL hash
  useEffect(() => {
    const error = searchParams.get("error");
    if (error === "unauthorized") {
      setStatus("error");
      setMsg("Only authorized users can access this application. Please contact support if you believe this is an error.");
    }

    // Handle session from URL hash (when OAuth redirects back with session)
    const handleSessionFromHash = async () => {
      if (typeof window !== "undefined" && window.location.hash) {
        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash);
        const accessToken = params.get("access_token");
        const refreshToken = params.get("refresh_token");
        
        if (accessToken && refreshToken) {
          console.log("Processing session from URL hash");
          const supabase = supabaseBrowser();
          
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          });
          
          if (error) {
            console.error("Error setting session:", error);
            setStatus("error");
            setMsg("Failed to complete sign in. Please try again.");
          } else {
            console.log("Session set successfully, redirecting to dashboard");
            window.location.href = "/dashboard";
          }
        }
      }
    };

    handleSessionFromHash();
  }, [searchParams]);

  async function sendMagicLink(e: React.FormEvent) {
    e.preventDefault();
    setMsg("");
    setStatus("loading");
    try {
      const sb = supabaseBrowser();
      const { error } = await sb.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo:
            typeof window !== "undefined"
              ? `${window.location.origin}/auth/callback?next=/dashboard`
              : undefined,
        },
      });
      if (error) throw error;
      setStatus("sent");
      setMsg("Check your email for a sign-in link.");
    } catch (err: unknown) {
      setStatus("error");
      setMsg(err instanceof Error ? err.message : "Failed to send link");
    }
  }

  return (
    <main className="min-h-[100dvh] w-full flex items-center justify-center">
      <section className="w-full flex flex-col md:flex-row">
        {/* Background image - full screen on mobile, half screen on desktop */}
        <div
          className="fixed inset-0 md:relative md:min-h-[100dvh] md:flex md:items-center md:justify-center md:px-0 md:w-1/2 bg-white"
          style={{
            backgroundImage: "url('/login/subscribeTwo.webp')",
            backgroundSize: "cover",
            backgroundPosition: "center",
            WebkitMaskImage:
              "linear-gradient(to left, transparent 0, transparent 8%, white 22%, white 100%)",
            maskImage:
              "linear-gradient(to left, transparent 0, transparent 8%, white 22%, white 100%)",
          }}>
         
        </div>
        
        {/* Form container - overlay on mobile, side-by-side on desktop */}
        <div className="relative z-10 md:relative md:min-h-[100dvh] flex items-center justify-center px-4 md:w-1/2 bg-background/60">
          <div className="max-w-md w-full rounded-2xl border border-white/10 backdrop-blur p-6 sm:p-8" style={{ background: "rgba(15, 23, 42, 0.8)" }}>
            <h1 className="text-lg sm:text-xl font-medium mb-2">
              Sign in or create account
            </h1>
            <p className="text-xs sm:text-sm text-muted mb-6">
              No account? We'll create one when you continue. Use Google or
              email magic link.
            </p>

            <div className="mb-6">
              <AuthButtons />
            </div>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-white/10" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-transparent px-2 text-muted">or</span>
              </div>
            </div>

            <form onSubmit={sendMagicLink} className="space-y-3">
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-10 sm:h-12 px-3 rounded-md border border-white/10 bg-background text-foreground placeholder:opacity-60 focus:outline-none focus:ring-2 focus:ring-foreground/10 text-sm sm:text-base"
                disabled={status === "loading"}
                required
              />
              <button
                type="submit"
                className="w-full h-10 sm:h-12 rounded-md bg-[linear-gradient(90deg,var(--cta-start),var(--cta-end))] text-[var(--on-primary)] text-sm font-semibold hover:brightness-110 disabled:opacity-60"
                disabled={status === "loading"}>
                {status === "loading" ? "Sending…" : "Email me a magic link"}
              </button>
            </form>

            {msg && (
              <p
                className={`mt-3 text-xs sm:text-sm ${
                  status === "error" ? "text-red-500" : "text-emerald-400"
                }`}>
                {msg}
              </p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignInForm />
    </Suspense>
  );
}
