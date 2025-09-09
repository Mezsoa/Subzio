"use client";
import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabaseClient";
import AuthButtons from "@/components/AuthButtons";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">(
    "idle"
  );
  const [msg, setMsg] = useState<string>("");

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
      <section className="w-full flex flex-row">
        <div
          className="min-h-[100dvh] flex items-center justify-center px-0 w-1/2 bg-white"
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
        <div className="relative min-h-[100dvh] flex items-center justify-center px-4 w-1/2" style={{ backgroundColor: "var(--background)" }}>
          <div className="max-w-md w-full rounded-2xl border border-white/10 backdrop-blur p-8" style={{ background: "rgba(15,23,42,0.9)" }}>
            <h1 className="text-xl font-medium mb-2">
              Sign in or create account
            </h1>
            <p className="text-sm text-muted mb-6">
              No account? We’ll create one when you continue. Use Google or
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
                className="w-full h-10 px-3 rounded-md border border-white/10 bg-background text-foreground placeholder:opacity-60 focus:outline-none focus:ring-2 focus:ring-foreground/10"
                disabled={status === "loading"}
                required
              />
              <button
                type="submit"
                className="w-full h-10 rounded-md bg-[linear-gradient(90deg,var(--cta-start),var(--cta-end))] text-[var(--on-primary)] text-sm font-semibold hover:brightness-110 disabled:opacity-60"
                disabled={status === "loading"}>
                {status === "loading" ? "Sending…" : "Email me a magic link"}
              </button>
            </form>

            {msg && (
              <p
                className={`mt-3 text-sm ${
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
