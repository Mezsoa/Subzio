"use client";

import { useEffect, useMemo, useState } from "react";
import { useABVariant } from "@/lib/ab";
import { useErrorNotifications } from "@/contexts/ErrorContext";
import { useErrorHandler } from "@/hooks/useErrorHandler";
import Image from "next/image";

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
  const [status, setStatus] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [selectedOption, setSelectedOption] = useState<"waitlist" | "preorder">(
    "waitlist"
  );
  const query = useQuery();
  const ab = useABVariant();
  const { showError, showSuccess } = useErrorNotifications();
  const { handleApiError, clearError } = useErrorHandler();

  // Initialize selected option based on URL parameters
  useEffect(() => {
    if (query.preorder === "true") {
      setSelectedOption("preorder");
    }
  }, [query.preorder]);

  // Listen for custom event from FOMO button
  useEffect(() => {
    const handleSelectPreorder = () => {
      setSelectedOption("preorder");
    };

    window.addEventListener("selectPreorder", handleSelectPreorder);
    return () =>
      window.removeEventListener("selectPreorder", handleSelectPreorder);
  }, []);

  const headline = "Take control";
  const headline2 = "of your";
  const headline3 = "subscriptions";

  const subhead = "One secure overview of your subscriptions.";

  const ctaText = useMemo(() => {
    if (query.cta) return query.cta;
    return selectedOption === "preorder"
      ? "Pre-order now – $19/year"
      : "Join waitlist – Free";
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
            email: email,
          }),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "Something went wrong");

        // Redirect to Stripe checkout
        if (typeof window !== "undefined" && json.sessionId) {
          // Redirect to Stripe checkout using the session ID
          const stripe = await import("@stripe/stripe-js").then((m) =>
            m.loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
          );
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
        showSuccess(
          "You've been added to our waitlist! We'll notify you when we launch.",
          "Welcome to KillSub!"
        );

        if (typeof window !== "undefined" && window.gtag) {
          window.gtag("event", "waitlist_submit_success", {
            form_location: "hero",
          });
        }
      }
    } catch (err: unknown) {
      setStatus("error");
      handleApiError(
        err,
        selectedOption === "preorder" ? "Pre-order" : "Waitlist signup"
      );
      const message = err instanceof Error ? err.message : "Failed to submit.";
      setErrorMsg(message);
    }
  }

  const inputStyles = `w-full h-12 px-4 rounded-md border text-sm bg-background text-foreground placeholder:opacity-60 focus:outline-none focus:ring-2 transition ${
    status === "error"
      ? "border-red-500 focus:ring-red-200"
      : "border-border focus:ring-foreground/10"
  }`;

  return (
    <section className="mx-auto h-screen text-center bg-gradient-to-b from-[rgba(29,155,240,0.08)] via-[rgba(11,18,32,1)] to-[rgba(11,18,32,1)] text-foreground flex flex-row">
      <section className="flex-1 h-[calc(100vh-65px)] flex flex-col justify-evenly py-2 px-4">
        <header className="mb-10 flex flex-col items-center justify-center mt-0">
          <h1 className="mt-0 text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight leading-tight font-orbitron">
            <span className="block text-white/95">Take control</span>
            <span className="block text-white/80 mt-1 font-light">of your</span>
            <span className="block text-white/90 mt-1">subscriptions</span>
          </h1>

          <div className="mt-2 w-16 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>

          <p className="mt-6 text-base sm:text-lg text-slate-300 max-w-lg mx-auto font-orbitron leading-relaxed">
            {subhead}
          </p>
        </header>
        <div>
          {/* Option Selector */}
          <div className=" max-w-md mx-auto mb-8">
            <div className="flex bg-background/50 border border-border rounded-lg p-1">
              <button
                type="button"
                onClick={() => setSelectedOption("waitlist")}
                className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition cursor-pointer ${
                  selectedOption === "waitlist"
                    ? "bg-foreground text-background"
                    : "text-muted hover:text-foreground"
                }`}>
                Free Waitlist
              </button>
              <button
                type="button"
                onClick={() => setSelectedOption("preorder")}
                className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition cursor-pointer ${
                  selectedOption === "preorder"
                    ? "bg-foreground text-background"
                    : "text-muted hover:text-foreground"
                }`}>
                Pre-order $19/year
              </button>
            </div>

            <p className="mt-3 text-xs text-muted text-center">
              {selectedOption === "preorder"
                ? "🚀 Get lifetime 60% discount + early access"
                : "📧 Get notified when we launch"}
            </p>
          </div>

          <form
            id="hero-form"
            onSubmit={onSubmit}
            className="mt-8 max-w-xl mx-auto flex flex-col sm:flex-row gap-3  rounded-md p-2 bg-transparent">
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
              className="whitespace-nowrap inline-flex items-center justify-center h-12 px-5 rounded-md text-sm text-black bg-foreground/80 font-semibold hover:brightness-110 shadow-md transition disabled:opacity-60 animate-pulse hover:animate-none cursor-pointer"
              onClick={() => {
                if (typeof window !== "undefined" && window.gtag) {
                  window.gtag("event", "waitlist_submit_click", {
                    form_location: "hero",
                    option: selectedOption,
                  });
                }
              }}
              disabled={status === "loading"}>
              {status === "loading" ? "Joining…" : ctaText}
            </button>
          </form>
          <div className="mt-4 text-xs text-muted flex items-center justify-center gap-2">
            <span className="inline-flex items-center gap-1">
              <span
                className="inline-block h-2 w-2 rounded-full"
                style={{ background: "var(--primary)" }}
              />
              Privacy‑first, bank‑grade security
            </span>
            <span aria-hidden>•</span>
            <span>Powered by Plaid / BankID</span>
            <span aria-hidden>•</span>
            <span>Cancel anytime</span>
          </div>
          <div className="mt-2 text-xs text-muted">
            <span className="mr-1">✅</span>No spam. Cancel anytime. Join 34
            others already waiting.
          </div>
          <div className="mt-2 text-xs text-muted">
            People from 🇸🇪 🇺🇸 🇨🇦 already joined this week.
          </div>

          {status === "error" && (
            <p className="mt-4 text-sm text-red-600">{errorMsg}</p>
          )}
          {status === "success" && (
            <p className="mt-4 text-sm text-green-600">
              {selectedOption === "preorder"
                ? "Redirecting to secure checkout..."
                : "Thanks! You're on the list."}
            </p>
          )}
        </div>

        <div className="absolute bottom-0 left-8 opacity-60 hover:opacity-100 transition-opacity z-50">
          <a href="https://tinylaunch.com" target="_blank" rel="noopener">
            <Image
              src="https://tinylaunch.com/tinylaunch_badge_launching_soon.svg"
              alt="TinyLaunch Badge"
              width={100}
              height={100}
              className="w-28 h-28"
            />
          </a>
        </div>
      </section>

      <section className="mb-10 flex-1 items-end relative justify-end h-[calc(100vh-65px)]">
        <p className="text-xs uppercase tracking-[0.2em] text-black absolute top-16 left-[80%] z-11 bg-gradient-to-r from-indigo-200 via-sky-200/50 to-indigo-200/50 backdrop-blur-sm rounded-lg px-4 py-2 border border-black/5">
          KillSub
        </p>
        <Image
          src="/connection/dataNet.webp"
          width={100}
          height={100}
          alt="KillSub"
          className="w-full h-full object-cover relative z-10"
        />

        {/* Realistic glass pane in the hole */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-transparent to-white/10 pointer-events-none z-20 rounded-3xl"></div>

        {/* Light reflection on glass */}
        <div className="absolute top-6 left-6 w-20 h-20 bg-white/30 rounded-full blur-2xl pointer-events-none z-30"></div>
        <div className="absolute top-12 right-8 w-12 h-12 bg-white/20 rounded-full blur-xl pointer-events-none z-30"></div>
      </section>
    </section>
  );
}
