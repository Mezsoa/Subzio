"use client";

import { PropsWithChildren, useEffect, useRef, useState } from "react";

type SnapSectionProps = PropsWithChildren<{
  className?: string;
  durationMs?: number;
  offsetPx?: number; // starting translateY in px
  threshold?: number; // intersection threshold to reveal
}>;

export default function SnapSection({ className = "", durationMs = 900, offsetPx = 64, threshold = 0.75, children }: SnapSectionProps) {
  const containerRef = useRef<HTMLElement | null>(null);
  const [visible, setVisible] = useState<boolean>(false);

  // Reveal when entering viewport
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && entry.intersectionRatio >= threshold) {
          setVisible(true);
        }
      },
      { threshold: [threshold, 1] }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return (
    <section
      ref={(n) => {
        containerRef.current = n;
        return;
      }}
      className={`snap-center snap-always overscroll-y-contain min-h-screen flex items-center justify-center ${className}`}
    >
      <div
        className={`w-full ease-out transform transition-opacity transition-transform ${visible ? "opacity-100 translate-y-0" : "opacity-0"}`}
        style={{
          transition: `opacity ${durationMs}ms ease-out, transform ${durationMs}ms ease-out`,
          transform: visible ? "translateY(0)" : `translateY(${offsetPx}px)`,
        }}
      >
        {children}
      </div>
    </section>
  );
}

