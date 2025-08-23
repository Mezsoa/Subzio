"use client";
import { PropsWithChildren, useEffect, useRef, useState } from "react";

type RevealProps = PropsWithChildren<{
  className?: string;
  durationMs?: number;
  offsetPx?: number;
  threshold?: number;
}>;

export default function Reveal({
  className = "",
  durationMs = 600,
  offsetPx = 100,
  threshold = 0.9,
  children,
}: RevealProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && entry.intersectionRatio >= threshold) {
          setVisible(true);
        }
      },
      { threshold: [threshold, 1] }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);

  return (
    <div
      ref={ref}
      className={`transform transition-opacity transition-transform ease-out ${visible ? "opacity-100 translate-y-0" : "opacity-0"} ${className}`}
      style={{
        transition: `opacity ${durationMs}ms ease-out, transform ${durationMs}ms ease-out`,
        transform: visible ? "translateY(0)" : `translateY(${offsetPx}px)`,
      }}
    >
      {children}
    </div>
  );
}