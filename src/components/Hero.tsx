"use client";

import { useState } from "react";

export default function Hero() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");

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
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to submit.";
      setStatus("error");
      setErrorMsg(message);
    }
  }

  const inputStyles = `w-full h-12 px-4 rounded-md border text-sm focus:outline-none focus:ring-2 transition ${
    status === "error" ? "border-red-500 focus:ring-red-200" : "border-black/10 focus:ring-black/10"
  }`;

  return (
    <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 pb-16 text-center">
      <p className="text-xs uppercase tracking-[0.2em] text-black/60">SubZIo</p>
      <h1 className="mt-3 text-3xl sm:text-5xl md:text-6xl font-semibold tracking-tight">
        Stop paying for subscriptions you don’t use
      </h1>
      <p className="mt-4 text-base sm:text-lg text-black/60 max-w-2xl mx-auto">
        Subscription Killer finds and cancels your forgotten subscriptions in one click.
      </p>

      <form id="waitlist" onSubmit={onSubmit} className="mt-8 max-w-xl mx-auto flex flex-col sm:flex-row gap-3">
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
          className="whitespace-nowrap inline-flex items-center justify-center h-12 px-5 rounded-md bg-black text-white text-sm font-semibold hover:bg-black/90 transition disabled:opacity-60"
          disabled={status === "loading"}
        >
          {status === "loading" ? "Joining…" : "Join the waitlist"}
        </button>
      </form>

      {status === "error" && (
        <p className="mt-2 text-sm text-red-600">{errorMsg}</p>
      )}
      {status === "success" && (
        <p className="mt-2 text-sm text-green-600">Thanks! You&apos;re on the list.</p>
      )}

      <div className="mt-12 h-56 sm:h-72 md:h-80 bg-gradient-to-br from-black/[0.04] to-black/[0.02] rounded-xl border border-black/10" />
    </section>
  );
}

