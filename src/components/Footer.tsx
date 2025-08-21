"use client";

import { useState } from "react";

export default function Footer() {
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

  const inputStyles = `w-full h-10 px-3 rounded-md border text-sm bg-background text-foreground placeholder:opacity-60 focus:outline-none focus:ring-2 transition ${
    status === "error" ? "border-red-500 focus:ring-red-200" : "border-border focus:ring-foreground/10"
  }`;

  return (
    <footer className="w-full border-t border-border mt-24 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 flex flex-col sm:flex-row items-center justify-between gap-4 text-foreground">
        <div className="text-sm text-muted">
          <span className="font-medium text-foreground">SubKill</span> © {new Date().getFullYear()}
        </div>

        <form onSubmit={onSubmit} className="w-full sm:w-auto max-w-md flex items-center gap-2">
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
            className="whitespace-nowrap inline-flex items-center justify-center h-10 px-4 rounded-md bg-primary text-on-primary text-sm font-semibold hover:bg-primary/90 transition disabled:opacity-60"
            disabled={status === "loading"}
          >
            {status === "loading" ? "Joining…" : "Join waitlist"}
          </button>
        </form>

        <div className="flex items-center gap-6 text-sm">
          <button className="hover:underline text-foreground" onClick={() => alert('We care about your privacy. Bank-grade encryption.')}>
            Privacy
          </button>
          <button className="hover:underline text-foreground" onClick={() => alert('Terms available upon request.')}>
            Terms
          </button>
        </div>
      </div>
      {(status === "error" || status === "success") && (
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-6">
          {status === "error" && (
            <p className="mt-2 text-sm text-red-600">{errorMsg}</p>
          )}
          {status === "success" && (
            <p className="mt-2 text-sm text-green-600">Thanks! You&apos;re on the list.</p>
          )}
        </div>
      )}
    </footer>
  );
}

