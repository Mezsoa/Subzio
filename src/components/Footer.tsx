"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, Send, Shield, FileText, Cookie, Globe, Twitter, Linkedin, Github } from "lucide-react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [contactStatus, setContactStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [contactErrorMsg, setContactErrorMsg] = useState<string>("");

  async function onWaitlistSubmit(e: React.FormEvent) {
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
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'waitlist_submit_success', {
          form_location: 'footer'
        });
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to submit.";
      setStatus("error");
      setErrorMsg(message);
    }
  }

  async function onContactSubmit(e: React.FormEvent) {
    e.preventDefault();
    setContactErrorMsg("");
    const isValid = /[^@\s]+@[^@\s]+\.[^@\s]+/.test(contactEmail);
    if (!isValid) {
      setContactStatus("error");
      setContactErrorMsg("Please enter a valid email.");
      return;
    }
    setContactStatus("loading");
    try {
      // Create mailto link
      const subject = encodeURIComponent("Contact from KillSub");
      const body = encodeURIComponent(`Hello,\n\nI'd like to get in touch.\n\nFrom: ${contactEmail}\n\nBest regards`);
      window.location.href = `mailto:johnmessoa@gmail.com?subject=${subject}&body=${body}`;
      
      setContactStatus("success");
      setContactEmail("");
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'contact_submit_success', {
          form_location: 'footer'
        });
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Failed to send.";
      setContactStatus("error");
      setContactErrorMsg(message);
    }
  }

  return (
    <footer className="relative w-full mt-32 overflow-hidden">
      {/* Background with gradient and glassmorphism effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-background/90" />
      <div className="absolute inset-0 bg-gradient-to-t from-primary/5 via-transparent to-transparent" />
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl opacity-20 animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-cta-end/10 rounded-full blur-3xl opacity-30" />
      
      <div className="relative">
        {/* Main footer content */}
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 pt-20 pb-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Brand section */}
            <div className="lg:col-span-4 space-y-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary to-cta-end rounded-xl flex items-center justify-center">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-primary to-cta-end bg-clip-text text-transparent">
                    KillSub
                  </span>
                </div>
                <p className="text-muted text-sm leading-relaxed max-w-sm">
                  AI-powered subscription management that helps you find hidden recurring charges and cancel unwanted subscriptions with ease.
                </p>
              </div>
              
              {/* Social links */}
              <div className="flex items-center space-x-4">
                <a href="#" className="w-10 h-10 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg flex items-center justify-center hover:bg-white/20 transition-all duration-300 group">
                  <Twitter className="w-4 h-4 text-muted group-hover:text-foreground transition-colors" />
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg flex items-center justify-center hover:bg-white/20 transition-all duration-300 group">
                  <Linkedin className="w-4 h-4 text-muted group-hover:text-foreground transition-colors" />
                </a>
                <a href="#" className="w-10 h-10 bg-white/10 backdrop-blur-sm border border-white/20 rounded-lg flex items-center justify-center hover:bg-white/20 transition-all duration-300 group">
                  <Github className="w-4 h-4 text-muted group-hover:text-foreground transition-colors" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div className="lg:col-span-2 space-y-6">
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Legal</h3>
              <div className="space-y-3">
                <Link href="/privacy" className="block text-sm text-muted hover:text-foreground transition-colors duration-200 flex items-center space-x-2">
                  <Shield className="w-3 h-3" />
                  <span>Privacy Policy</span>
                </Link>
                <Link href="/terms" className="block text-sm text-muted hover:text-foreground transition-colors duration-200 flex items-center space-x-2">
                  <FileText className="w-3 h-3" />
                  <span>Terms of Service</span>
                </Link>
                <Link href="/cookies" className="block text-sm text-muted hover:text-foreground transition-colors duration-200 flex items-center space-x-2">
                  <Cookie className="w-3 h-3" />
                  <span>Cookie Policy</span>
                </Link>
                <Link href="/gdpr" className="block text-sm text-muted hover:text-foreground transition-colors duration-200 flex items-center space-x-2">
                  <Globe className="w-3 h-3" />
                  <span>GDPR Compliance</span>
                </Link>
              </div>
            </div>

            {/* Contact Form with Glassmorphism */}
            <div className="lg:col-span-3 space-y-6">
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Get in Touch</h3>
              <div className="bg-transparent backdrop-blur-md py-2 shadow-xl">
                <form onSubmit={onContactSubmit} className="space-y-4">
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                    <input
                      type="email"
                      placeholder="Your email address"
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="w-full h-12 pl-10 pr-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-foreground placeholder:text-muted/70 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300"
                      disabled={contactStatus === "loading"}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={contactStatus === "loading"}
                    className="w-full h-12 bg-gradient-to-r from-primary to-cta-end text-white rounded-xl font-medium hover:shadow-lg hover:shadow-primary/25 transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    <span>{contactStatus === "loading" ? "Sending..." : "Get in Touch "}</span>
                  </button>
                  {contactStatus === "success" && (
                    <p className="text-sm text-green-400 text-center">Message sent successfully!</p>
                  )}
                  {contactStatus === "error" && (
                    <p className="text-sm text-red-400 text-center">{contactErrorMsg}</p>
                  )}
                </form>
              </div>
            </div>

            {/* Waitlist Form with Glassmorphism */}
            <div className="lg:col-span-3 space-y-6">
              <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">Join Waitlist</h3>
              <div className="bg-transparent backdrop-blur-md py-2 shadow-xl">
                <form onSubmit={onWaitlistSubmit} className="space-y-4">
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full h-12 pl-10 pr-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-foreground placeholder:text-muted/70 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-300"
                      disabled={status === "loading"}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={status === "loading"}
                    className="w-full h-12 bg-gradient-to-r from-cta-start to-cta-end text-white rounded-xl font-medium hover:shadow-lg hover:shadow-cta-start/25 transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50"
                  >
                    <span>{status === "loading" ? "Joining..." : "Join Waitlist"}</span>
                  </button>
                  {status === "success" && (
                    <p className="text-sm text-green-400 text-center">Thanks! You&apos;re on the list.</p>
                  )}
                  {status === "error" && (
                    <p className="text-sm text-red-400 text-center">{errorMsg}</p>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 bg-black/20 backdrop-blur-sm">
          <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12 py-6">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-muted">
                © {new Date().getFullYear()} KillSub. All rights reserved.
              </div>
              <div className="text-sm text-muted">
                Made with ❤️ for financial freedom
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

