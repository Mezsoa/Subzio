"use client";

import { useEffect, useMemo, useState } from "react";
import SubscriptionsCard from "@/components/SubscriptionsCard";
import { useABVariant } from "@/lib/ab";
import { useErrorNotifications } from "@/contexts/ErrorContext";
import { useErrorHandler } from "@/hooks/useErrorHandler";

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
  const [selectedOption, setSelectedOption] = useState<"waitlist" | "preorder">("waitlist");
  const query = useQuery();
  const ab = useABVariant();
  const { showError, showSuccess } = useErrorNotifications();
  const { handleApiError, clearError } = useErrorHandler();

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
    return selectedOption === "preorder" ? "Pre-order now – $19/year" : "Join waitlist – Free";
  }, [query.cta, selectedOption]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrorMsg("");
    clearError();
    
    const isValid = /[^@\s]+@[^@\s]+\.[^@\s]+/.test(email);
    if (!isValid) {
      setStatus("error");
      setErrorMsg("Please enter a valid email address.");
      showError("Please enter a valid email address.", "Invalid Email");
      return;
    }
    
    setStatus("loading");
    try {
      if (selectedOption === "preorder") {
        // For pre-order, redirect to Stripe checkout
        const res = await fetch("/api/stripe/create-checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            planId: "preorder",
            email: email
          }),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Something went wrong");
        
        // Redirect to Stripe checkout
        if (typeof window !== "undefined" && json.sessionId) {
          // Redirect to Stripe checkout using the session ID
          const stripe = await import('@stripe/stripe-js').then(m => m.loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!));
          if (stripe) {
            const { error } = await stripe.redirectToCheckout({
              sessionId: json.sessionId,
            });
            if (error) {
              throw new Error(error.message);
            }
          }
        }
      } else {
        // Regular waitlist signup
        const res = await fetch("/api/waitlist", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Something went wrong");
        
        setStatus("success");
        setEmail("");
        showSuccess("You've been added to our waitlist! We'll notify you when we launch.", "Welcome to KillSub!");
        
        if (typeof window !== "undefined" && window.gtag) {
          window.gtag('event', 'waitlist_submit_success', {
            form_location: 'hero'
          });
        }
      }
    } catch (err: unknown) {
      setStatus("error");
      handleApiError(err, selectedOption === "preorder" ? "Pre-order" : "Waitlist signup");
      const message = err instanceof Error ? err.message : "Failed to submit.";
      setErrorMsg(message);
    }
  }

  const inputStyles = `w-full h-12 px-4 rounded-md border text-sm bg-background text-foreground placeholder:opacity-60 focus:outline-none focus:ring-2 transition ${
    status === "error" ? "border-red-500 focus:ring-red-200" : "border-border focus:ring-foreground/10"
  }`;

  return (
    <section className="mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 pb-16 text-center bg-gradient-to-b from-[rgba(29,155,240,0.08)] via-[rgba(11,18,32,1)] to-[rgba(11,18,32,1)] text-foreground ">
      <p className="text-xs uppercase tracking-[0.2em] text-muted">KillSub</p>
      <h1 className="mt-3 text-3xl sm:text-5xl md:text-6xl font-semibold tracking-tight text-foreground">
        {headline}
      </h1>
      <p className="mt-4 text-base sm:text-lg text-muted max-w-2xl mx-auto">
        {subhead}
      </p>

      <p className="mt-2 text-sm text-[color:var(--foreground)]/80">
        Launching soon. Pre-order now for $19/year (60% off).
      </p>

      {/* Option Selector */}
      <div className="mt-6 max-w-md mx-auto">
        <div className="flex bg-background/50 border border-border rounded-lg p-1">
          <button
            type="button"
            onClick={() => setSelectedOption("waitlist")}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition ${
              selectedOption === "waitlist"
                ? "bg-foreground text-background"
                : "text-muted hover:text-foreground"
            }`}
          >
            Free Waitlist
          </button>
          <button
            type="button"
            onClick={() => setSelectedOption("preorder")}
            className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition ${
              selectedOption === "preorder"
                ? "bg-foreground text-background"
                : "text-muted hover:text-foreground"
            }`}
          >
            Pre-order $19/year
          </button>
        </div>
        <p className="mt-2 text-xs text-muted text-center">
          {selectedOption === "preorder" 
            ? "🚀 Get lifetime 60% discount + early access" 
            : "📧 Get notified when we launch"}
        </p>
      </div>

      <form id="waitlist" onSubmit={onSubmit} className="mt-6 max-w-xl mx-auto flex flex-col sm:flex-row gap-3 border border-border rounded-md p-2 bg-transparent">
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
          className="whitespace-nowrap inline-flex items-center justify-center h-12 px-5 rounded-md bg-[linear-gradient(90deg,var(--cta-start),var(--cta-end))] text-[var(--on-primary)] text-sm font-semibold hover:brightness-110 shadow-md transition disabled:opacity-60"
          onClick={() => {
            if (typeof window !== 'undefined' && window.gtag) {
              window.gtag('event', 'waitlist_submit_click', { 
                form_location: 'hero',
                option: selectedOption
              });
            }
          }}
          disabled={status === "loading"}
        >
          {status === "loading" ? "Joining…" : ctaText}
        </button>
      </form>

      <div className="mt-2 text-xs text-muted">
        <span className="mr-1">✅</span>No spam. Cancel anytime. Join 18 others already waiting.
      </div>
      <div className="mt-1 text-xs text-muted">
        People from 🇸🇪 🇺🇸 🇨🇦 already joined this week.
      </div>

      {status === "error" && (
        <p className="mt-2 text-sm text-red-600">{errorMsg}</p>
      )}
      {status === "success" && (
        <p className="mt-2 text-sm text-green-600">
          {selectedOption === "preorder" 
            ? "Redirecting to secure checkout..." 
            : "Thanks! You're on the list."}
        </p>
      )}

      <SubscriptionsCard />

      <div className="mt-6 text-xs text-muted flex items-center justify-center gap-2">
        <span className="inline-flex items-center gap-1">
          <span className="inline-block h-2 w-2 rounded-full" style={{ background: "var(--primary)" }} />
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

