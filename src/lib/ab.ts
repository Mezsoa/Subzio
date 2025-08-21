"use client";

import { useEffect, useMemo, useState } from "react";

export type ABVariant = "A" | "B";

export function useABVariant() {
  const [variant, setVariant] = useState<ABVariant>("A");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const qp = params.get("ab");
    if (qp === "A" || qp === "B") {
      localStorage.setItem("subkill_ab_variant", qp);
      setVariant(qp);
      return;
    }
    const stored = localStorage.getItem("subkill_ab_variant") as ABVariant | null;
    if (stored === "A" || stored === "B") {
      setVariant(stored);
      return;
    }
    const assigned: ABVariant = Math.random() < 0.5 ? "A" : "B";
    localStorage.setItem("subkill_ab_variant", assigned);
    setVariant(assigned);
  }, []);

  return variant;
}

