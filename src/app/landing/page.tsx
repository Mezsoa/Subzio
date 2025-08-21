"use client";

import Hero from "@/components/Hero";
import TestimonialCard from "@/components/TestimonialCard";
import PricingCard from "@/components/PricingCard";
import Fomo from "@/components/Fomo";
import FAQ from "@/components/FAQ";
import Footer from "@/components/Footer";
import StickyCTA from "@/components/StickyCTA";
import { useABVariant } from "@/lib/ab";
import FounderMessage from "@/components/FounderMessage";

export default function Landing() {
  const ab = useABVariant();
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white via-black/20 to-amber-900/30 text-foreground">
      <main className="flex-1">
        <Hero />
        <section className="mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-black">
          <div className="mt-6">
            <TestimonialCard />
          </div>
        </section>
        {ab === "B" ? null : <Fomo />}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
          <div className="flex flex-col items-center">
            <PricingCard price="$5" />
          </div>
        </section>
        <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-6">
            <FounderMessage />
          </div>
          <FAQ />
        </section>
      </main>
      <Footer />
      <StickyCTA />
    </div>
  );
}

