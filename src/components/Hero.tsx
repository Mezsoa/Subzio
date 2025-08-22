"use client";

import { useEffect, useMemo, useState } from "react";
import SubscriptionsCard from "@/components/SubscriptionsCard";
import { useABVariant } from "@/lib/ab";

function useQuery() {
  const [query, setQuery] = useState<Record<string, string>>({});
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const obj: Record<string, string> = {};
    params.forEach((v, k) => (obj[k] = v));
    setQuery(obj);
  }, []);
  return query;
}

export default function Hero() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const query = useQuery();
  const ab = useABVariant();

  const headline = useMemo(() => {
    return query.h || "Stop paying for subscriptions you don’t use";
  }, [query.h]);

  const subhead = useMemo(() => {
    if (query.s) return query.s;
    return ab === "B"
      ? "Connect via Plaid/BankID, AI‑scan for recurring charges, and get guided cancellations."
      : "KillSub connects to your bank, detects subscriptions with AI, and guides cancellation steps.";
  }, [query.s, ab]);

  const ctaText = useMemo(() => {
    if (query.cta) return query.cta;
    return ab === "B" ? "Get early access" : "Join the waitlist";
  }, [query.cta, ab]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");
    const isValid = /[^@\s]+@[^@\s]+\.[^@\s]+/.test(email);
    if (!isValid) {
      setStatus("error");
      setErrorMsg("Please enter a valid email.");
      return;
    }
    setStatus("loading");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Something went wrong");
      setStatus("success");
      setEmail("");
      if (typeof window !== "undefined" && window.gtag) {
        window.gtag('event', 'waitlist_submit_success', {
          form_location: 'hero'
        });
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to submit.";
      setStatus("error");
      setErrorMsg(message);
    }
  }

  const inputStyles = `w-full h-12 px-4 rounded-md border text-sm bg-background text-foreground placeholder:opacity-60 focus:outline-none focus:ring-2 transition ${
    status === "error" ? "border-red-500 focus:ring-red-200" : "border-border focus:ring-foreground/10"
  }`;

  return (
    <section className="mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 pb-16 text-center bg-gradient-to-b from-zinc-950 via-neutral-800 to-zinc-950 text-foreground ">
      <p className="text-xs uppercase tracking-[0.2em] text-muted">KillSub</p>
      <h1 className="mt-3 text-3xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-foreground">
        {headline}
      </h1>
      <p className="mt-4 text-base sm:text-lg text-muted max-w-2xl mx-auto">
        {subhead}
      </p>

      <form id="waitlist" onSubmit={onSubmit} className="mt-8 max-w-xl mx-auto flex flex-col sm:flex-row gap-3 border border-border rounded-md p-2 bg-transparent">
        <input
          type="email"
          name="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          aria-invalid={status === "error"}
          className={inputStyles}
          disabled={status === "loading"}
        />
        <button
          type="submit"
          className="whitespace-nowrap inline-flex items-center justify-center h-12 px-5 rounded-md bg-primary text-on-primary text-sm font-semibold hover:bg-primary/90 transition disabled:opacity-60"
          onClick={() => {
            if (typeof window !== 'undefined' && window.gtag) {
              window.gtag('event', 'waitlist_submit_click', { form_location: 'hero' });
            }
          }}
          disabled={status === "loading"}
        >
          {status === "loading" ? "Joining…" : ctaText}
        </button>
      </form>

      {status === "error" && (
        <p className="mt-2 text-sm text-red-600">{errorMsg}</p>
      )}
      {status === "success" && (
        <p className="mt-2 text-sm text-green-600">Thanks! You&apos;re on the list.</p>
      )}

      <SubscriptionsCard />

      <div className="mt-6 text-xs text-muted flex items-center justify-center gap-2">
        <span className="inline-flex items-center gap-1">
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-400" />
          Privacy‑first, bank‑grade security
        </span>
        <span aria-hidden>•</span>
        <span>Powered by Plaid / BankID</span>
        <span aria-hidden>•</span>
        <span>Cancel anytime</span>
      </div>
    </section>
  );
}

