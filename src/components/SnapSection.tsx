"use client";

import { PropsWithChildren, useEffect, useRef, useState } from "react";

type SnapSectionProps = PropsWithChildren<{
  className?: string;
  revealDistancePx?: number;
  durationMs?: number; // kept for backwards-compat; applies to both if specific durations not provided
  opacityDurationMs?: number; // duration for opacity fade
  transformDurationMs?: number; // duration for slide-up transform
  opacityDelayMs?: number; // optional delay before opacity starts
}>;

export default function SnapSection({ className = "", revealDistancePx = 300, durationMs = 500, opacityDurationMs, transformDurationMs, opacityDelayMs = 0, children }: SnapSectionProps) {
  const containerRef = useRef<HTMLElement | null>(null);
  const [revealed, setRevealed] = useState<boolean>(false);
  const wheelAccumRef = useRef<number>(0);
  const touchStartYRef = useRef<number | null>(null);
  const [isActive, setIsActive] = useState<boolean>(false);

  // Observe when this section is the active viewport target
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        setIsActive(entry.isIntersecting && entry.intersectionRatio > 0.9);
      },
      { threshold: [0, 0.25, 0.5, 0.6, 0.75, 1] }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Handle wheel/touch only when active and not revealed
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    if (!isActive || revealed) return;

    const onWheel = (e: WheelEvent) => {
      if (revealed) return;
      if (e.deltaY > 0) {
        wheelAccumRef.current += e.deltaY;
        if (wheelAccumRef.current >= revealDistancePx) {
          setRevealed(true);
        }
        e.preventDefault();
      }
    };

    const onTouchStart = (e: TouchEvent) => {
      if (e.touches && e.touches.length > 0) {
        touchStartYRef.current = e.touches[0].clientY;
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (revealed) return;
      const startY = touchStartYRef.current;
      if (startY == null) return;
      const currentY = e.touches[0].clientY;
      const dy = startY - currentY; // swipe up amount
      if (dy > 0) {
        if (dy >= revealDistancePx) {
          setRevealed(true);
          touchStartYRef.current = null;
        }
        e.preventDefault();
      }
    };

    const onTouchEnd = () => {
      touchStartYRef.current = null;
    };

    el.addEventListener("wheel", onWheel, { passive: false });
    el.addEventListener("touchstart", onTouchStart, { passive: true });
    el.addEventListener("touchmove", onTouchMove, { passive: false });
    el.addEventListener("touchend", onTouchEnd, { passive: true });
    return () => {
      el.removeEventListener("wheel", onWheel as EventListener);
      el.removeEventListener("touchstart", onTouchStart as EventListener);
      el.removeEventListener("touchmove", onTouchMove as EventListener);
      el.removeEventListener("touchend", onTouchEnd as EventListener);
    };
  }, [isActive, revealed, revealDistancePx]);

  // Reset accumulator when leaving active or after reveal
  useEffect(() => {
    if (!isActive || revealed) {
      wheelAccumRef.current = 0;
      touchStartYRef.current = null;
    }
  }, [isActive, revealed]);

  return (
    <section
      ref={(n) => {
        containerRef.current = n;
        return;
      }}
      className={`snap-center snap-always overscroll-y-contain min-h-full flex items-center justify-center ${className}`}
    >
      <div
        className={`w-full ease-out transform transition-opacity transition-transform ${isActive ? "opacity-100" : "opacity-0"} ${
          revealed ? "translate-y-0 opacity-100" : "translate-y-48 opacity-0"
        }`}
        style={{
          transition: `opacity ${opacityDurationMs ?? durationMs}ms ease-out ${opacityDelayMs}ms, transform ${transformDurationMs ?? durationMs}ms ease-out 0ms`,
        }}
      >
        {children}
      </div>
    </section>
  );
}

