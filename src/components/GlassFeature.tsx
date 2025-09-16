"use client";

import React from "react";
import Reveal from "./animations/Reveal";

type GlassFeatureProps = {
  title: string;
  description: string;
  icon?: React.ReactNode;
  accent?: "emerald" | "sky" | "violet" | "amber" | "rose" | "zinc";
  className?: string;
};

const ACCENT_MAP: Record<NonNullable<GlassFeatureProps["accent"]>, string> = {
  emerald: "from-emerald-400/20 to-emerald-300/10",
  sky: "from-sky-400/20 to-sky-300/10",
  violet: "from-violet-400/20 to-violet-300/10",
  amber: "from-amber-400/25 to-amber-300/10",
  rose: "from-rose-400/20 to-rose-300/10",
  zinc: "from-[rgba(255,255,255,0.06)] to-[rgba(255,255,255,0.04)]",
};

function GlassFeature({
  title,
  description,
  icon,
  accent = "zinc",
  className = "",
}: GlassFeatureProps) {
  const accentClasses = ACCENT_MAP[accent];
  return (
    <>
      <Reveal
        threshold={0.5}
        offsetPx={200}
        durationMs={1000}
        className={`relative rounded-xl sm:rounded-2xl border border-white/10 backdrop-blur-md shadow-xl transition-colors ${className}`}>
        <div className="pointer-events-none absolute rounded-xl sm:rounded-2xl inset-0 [mask-image:radial-gradient(100%_60%_at_0%_0%,_white,_transparent)]">
          <div
            className={`absolute -top-8 sm:-top-12 -left-8 sm:-left-12 h-32 sm:h-48 w-32 sm:w-48 rounded-full bg-gradient-to-br ${accentClasses}`}
          />
        </div>

        <div
          className="relative p-4 sm:p-6 lg:p-8"
          style={{
            background:
              "linear-gradient(135deg, rgba(0,0,0,0.35), rgba(255,255,255,0.04))",
          }}>
          {icon && (
            <div className="mb-3 sm:mb-4 text-xl sm:text-2xl text-foreground/85">{icon}</div>
          )}
          <h3 className="text-sm sm:text-lg font-medium text-foreground tracking-tight">
            {title}
          </h3>
          <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm text-muted leading-relaxed">
            {description}
          </p>
          
        </div>
      </Reveal>
     
    </>
  );
}

export default GlassFeature;
