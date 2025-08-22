"use client";

import React, { useEffect, useMemo, useState } from 'react'
import SnapSection from './SnapSection'

function formatTime(ms: number) {
  const totalSeconds = Math.max(0, Math.floor(ms / 1000));
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { days, hours, minutes, seconds };
}

function Fomo() {
  const [spotsLeft, setSpotsLeft] = useState<number>(73);
  const [now, setNow] = useState<number>(Date.now());

  const deadline = useMemo(() => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const sept5ThisYear = new Date(currentYear, 8, 5, 23, 59, 59, 999).getTime();
    if (Date.now() <= sept5ThisYear) return sept5ThisYear;
    const sept5NextYear = new Date(currentYear + 1, 8, 5, 23, 59, 59, 999).getTime();
    return sept5NextYear;
  }, []);

  useEffect(() => {
    const tick = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(tick);
  }, []);

  useEffect(() => {
    const minSpots = 12;
    const interval = setInterval(() => {
      setSpotsLeft((s) => (s > minSpots ? s - 1 : s));
    }, 45000); // decrease ~every 15s for demo
    return () => clearInterval(interval);
  }, []);

  const remaining = Math.max(0, deadline - now);
  const { days, hours, minutes, seconds } = formatTime(remaining);

  return (
    <SnapSection className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-14 h-[100vh] flex items-center justify-center mt-48">
      <div className="relative overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-zinc-900 via-black to-zinc-900 p-6 sm:p-10 shadow-xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted">Early access</p>
            <h3 className="mt-2 text-2xl sm:text-3xl font-semibold tracking-tight text-foreground">
              Lock in free for a lifetime
            </h3>
            <p className="mt-3 text-sm sm:text-base text-muted max-w-xl">
              First 100 people get free for life. Join now and keep your account—cancel anytime.
            </p>
            <div className="mt-5 inline-flex items-center gap-2 rounded-md bg-emerald-500/10 text-emerald-300 px-3 py-1 text-xs">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>
                {spotsLeft} spots left
              </span>
            </div>
          </div>

          <div className="w-full lg:w-auto">
            <div className="grid grid-cols-4 gap-2 items-end text-center">
              <div className="px-3 py-2 rounded-md bg-white/5">
                <div className="text-2xl font-semibold text-foreground tabular-nums">{days}</div>
                <div className="text-[10px] uppercase tracking-wide text-muted">Days</div>
              </div>
              <div className="px-3 py-2 rounded-md bg-white/5">
                <div className="text-2xl font-semibold text-foreground tabular-nums">{hours.toString().padStart(2,'0')}</div>
                <div className="text-[10px] uppercase tracking-wide text-muted">Hours</div>
              </div>
              <div className="px-3 py-2 rounded-md bg-white/5">
                <div className="text-2xl font-semibold text-foreground tabular-nums">{minutes.toString().padStart(2,'0')}</div>
                <div className="text-[10px] uppercase tracking-wide text-muted">Minutes</div>
              </div>
              <div className="px-3 py-2 rounded-md bg-white/5">
                <div className="text-2xl font-semibold text-foreground tabular-nums">{seconds.toString().padStart(2,'0')}</div>
                <div className="text-[10px] uppercase tracking-wide text-muted">Seconds</div>
              </div>
            </div>

            <a
              href="#waitlist"
              className="mt-4 inline-flex w-full items-center justify-center h-11 px-5 rounded-md bg-primary text-on-primary text-sm font-semibold hover:bg-primary/90 transition"
              onClick={() => {
                if (typeof window !== 'undefined' && window.gtag) {
                  window.gtag('event', 'cta_click', { location: 'fomo' });
                }
              }}
            >
              Join the waitlist
            </a>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
          <div className="rounded-md border border-white/10 bg-white/5 p-3">
            <div className="text-foreground font-medium">Day‑before renewal alerts</div>
            <div className="text-muted mt-1">Never get surprised by a “free trial” turning paid.</div>
          </div>
          <div className="rounded-md border border-white/10 bg-white/5 p-3">
            <div className="text-foreground font-medium">Guided cancellations</div>
            <div className="text-muted mt-1">Direct links and steps to cancel with each provider.</div>
          </div>
          <div className="rounded-md border border-white/10 bg-white/5 p-3">
            <div className="text-foreground font-medium">Privacy‑first</div>
            <div className="text-muted mt-1">Bank‑grade security. Disconnect anytime.</div>
          </div>
        </div>

        <p className="mt-6 text-xs text-muted">
          84 people joined the waitlist this week.
        </p>
      </div>
    </SnapSection>
  )
}

export default Fomo