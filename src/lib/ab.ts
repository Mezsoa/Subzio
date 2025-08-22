"use client";

import { useEffect, useState } from "react";

export type ABVariant = "A" | "B";

export function useABVariant() {
  const [variant, setVariant] = useState<ABVariant>("A");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const qp = params.get("ab");
    if (qp === "A" || qp === "B") {
      localStorage.setItem("killsub_ab_variant", qp);
      setVariant(qp);
      if (window.gtag) {
        window.gtag('event', 'ab_variant_assigned', { variant: qp, source: 'query' });
      }
      return;
    }
    const stored = localStorage.getItem("killsub_ab_variant") as ABVariant | null;
    if (stored === "A" || stored === "B") {
      setVariant(stored);
      if (window.gtag) {
        window.gtag('event', 'ab_variant_assigned', { variant: stored, source: 'storage' });
      }
      return;
    }
    const assigned: ABVariant = Math.random() < 0.5 ? "A" : "B";
    localStorage.setItem("killsub_ab_variant", assigned);
    setVariant(assigned);
    if (window.gtag) {
      window.gtag('event', 'ab_variant_assigned', { variant: assigned, source: 'random' });
    }
  }, []);

  return variant;
}

