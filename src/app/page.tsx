import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Card from "@/components/Card";
import TestimonialCard from "@/components/TestimonialCard";
import Footer from "@/components/Footer";
import Fomo from "@/components/Fomo";
import FAQ from "@/components/FAQ";
import FounderMessage from "@/components/FounderMessage";
import SnapSection from "@/components/SnapSection";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-bl from-white via-black/20 to-amber-900/30 text-foreground overflow-hidden mb-16">
      <Navbar />

      <main className="flex-1 snap-y snap-always">
        <Hero />

        {/* Testimonial */}
        <section className="relative mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 bg-transparent sm:h-[30vh] flex items-start sm:items-center justify-start sm:justify-center">
          <div>
            <TestimonialCard />
          </div>
          <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 w-10 sm:w-16 bg-gradient-to-r from-background via-background/90 to-transparent" />
        </section>

        {/* Spacer */}
        <div className="bg-gradient-to-tr from-white/0.5 via-black/1 to-amber-900/30 h-8 sm:h-16" />

        {/* KillSub */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14 mt-0 bg-transparent h-[30vh]">
          <div className="mb-6">
            <h2 className="text-xl sm:text-2xl font-regular tracking-tight text-foreground text-end mr-23">KillSub</h2>
            <p className="mt-2 text-sm text-muted text-end">The last subscription killer.</p>
          </div>
        </section>

        {/* Why KillSub */}
        <SnapSection className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14 mt-0 bg-transparent h-[30vh] flex flex-col items-start justify-center">
          <div className="mb-6">
            <h2 className="text-xl sm:text-2xl font-regular tracking-tight text-foreground">Why KillSub</h2>
            <p className="mt-2 text-sm text-muted">Cut waste, avoid surprise renewals, and cancel with guided steps.</p>
          </div>
          <div className="flex flex-col gap-4">
            <Card
              title="Hidden charges"
              description="Find sneaky recurring charges buried in statements before they drain your balance."
              icon={<span aria-hidden className="text-2xl">🔎</span>}
            />
            <Card
              title="Forgotten free trials"
              description="Day‑before alerts so trials don’t convert while you’re not looking."
              icon={<span aria-hidden className="text-2xl">⏰</span>}
            />
            <Card
              title="Guided cancellations"
              description="We send you straight to the right cancellation page and steps."
              icon={<span aria-hidden className="text-2xl">✅</span>}
            />
          </div>
        </SnapSection>

        {/* How it works */}
        <SnapSection className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10 bg-transparent mt-36 flex flex-col items-end justify-center">
          <h2 className="text-xl sm:text-2xl font-regular tracking-tight text-foreground">How it works</h2>
          <div className="flex flex-col gap-4">
            <Card
              title="1) Connect securely"
              description="Link your bank via Plaid or BankID (where supported). We never see or store your credentials."
              icon={<span aria-hidden className="text-2xl">🔐</span>}
            />
            <Card
              title="2) Detect subscriptions"
              description="We scan descriptors and patterns to surface recurring charges you may have missed."
              icon={<span aria-hidden className="text-2xl">🧠</span>}
            />
            <Card
              title="3) Cancel with guidance"
              description="We direct you to the provider’s cancellation page and provide simple steps or templates."
              icon={<span aria-hidden className="text-2xl">🧾</span>}
            />
          </div>
        </SnapSection>

        <Fomo />

        {/* Founder Message */}
        <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10 bg-transparent sm:h-[80vh] flex items-center justify-center">
          <FounderMessage />
        </section>

        <section className="mx-auto sm:h-[60vh] max-w-5xl md:mt-24 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 bg-transparent">
          <FAQ />
        </section>
        
      </main>

      <Footer />
    </div>
  );
}
