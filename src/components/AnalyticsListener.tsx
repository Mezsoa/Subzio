"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect } from "react";

const MEASUREMENT_ID = "G-MMTS4ZZ692";

type Gtag = (command: 'config' | 'event' | 'js', ...params: unknown[]) => void;
declare global {
  interface Window {
    gtag?: Gtag;
  }
}

export default function AnalyticsListener() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window === "undefined" || !window.gtag) return;
    const search = searchParams?.toString();
    const page_path = search ? `${pathname}?${search}` : pathname || "/";
    window.gtag('config', MEASUREMENT_ID, { page_path });
  }, [pathname, searchParams]);

  return null;
}

