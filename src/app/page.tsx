import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TestimonialCard from "@/components/TestimonialCard";
import Footer from "@/components/Footer";
import Fomo from "@/components/Fomo";
import FAQ from "@/components/FAQ";
import FounderMessage from "@/components/FounderMessage";
import SnapSection from "@/components/SnapSection";
import GlassFeature from "@/components/GlassFeature";
import Reveal from "@/components/animations/Reveal";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-[radial-gradient(1200px_600px_at_10%_0%,_rgba(29,155,240,0.12),_transparent_60%),_linear-gradient(to_bottom,_rgba(11,18,32,1),_rgba(11,18,32,1))] text-foreground overflow-hidden mb-16">
      <Navbar />

      <main className="flex-1 snap-y snap-always">
        <Hero />

        {/* Testimonial */}
        <section className="relative mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 bg-transparent sm:h-[30vh] flex items-start sm:items-center justify-start sm:justify-center">
          <div>
            <TestimonialCard />
          </div>
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 w-10 sm:w-16 bg-gradient-to-r from-background via-background/90 to-transparent"
          />
        </section>

        {/* Spacer */}
        <div className="bg-[radial-gradient(600px_200px_at_90%_50%,_rgba(29,155,240,0.12),_transparent_60%)] h-8 sm:h-16" />

        {/* KillSub */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14 mt-0 bg-transparent h-[30vh]">
          <Reveal className="mb-6">
            <h2 className="text-xl sm:text-2xl font-regular tracking-tight text-foreground text-end mr-23">
              KillSub
            </h2>
            <p className="mt-2 text-sm text-muted text-end">
              The last subscription killer.
            </p>
          </Reveal>
        </section>

        {/* Why KillSub */}
        <SnapSection className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 bg-transparent flex flex-col items-center justify-center text-center">
          <div className="mb-16">
            <h2 className="text-xl sm:text-2xl font-regular tracking-tight text-foreground text-center">
              Why KillSub
            </h2>
            <p className="mt-3 text-sm text-muted max-w-2xl mx-auto">
              Cut waste, avoid surprise renewals, and cancel with guided steps.
            </p>
          </div>
          <div className="w-full grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-6">
            <GlassFeature
              title="Hidden charges"
              description="Find sneaky recurring charges buried in statements before they drain your balance."
              icon={
                <span aria-hidden className="text-2xl">
                  🔎
                </span>
              }
              accent="emerald"
              className="md:col-span-3"
            />
            <GlassFeature
              title="Forgotten free trials"
              description="Day‑before alerts so trials don’t convert while you’re not looking."
              icon={
                <span aria-hidden className="text-2xl">
                  ⏰
                </span>
              }
              accent="amber"
              className="md:col-span-2"
            />
            <GlassFeature
              title="Guided cancellations"
              description="We send you straight to the right cancellation page and steps."
              icon={
                <span aria-hidden className="text-2xl">
                  ✅
                </span>
              }
              accent="violet"
              className="md:col-span-2"
            />
            <GlassFeature
              title="Privacy‑first"
              description="Bank‑grade security. Disconnect anytime."
              icon={
                <span aria-hidden className="text-2xl">
                  🔒
                </span>
              }
              accent="zinc"
              className="md:col-span-3"
            />
          </div>
        </SnapSection>

        {/* How it works */}
        <SnapSection className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-16 bg-transparent flex flex-col items-center justify-center text-center">
          <h2 className="text-xl sm:text-2xl font-regular tracking-tight text-foreground text-center mb-16">
            How it works
          </h2>
          <div className="w-full grid grid-cols-1 md:grid-cols-5 gap-4 md:gap-6">
            <GlassFeature
              title="Connect securely"
              description="Link your bank via Plaid or BankID (where supported). We never see or store your credentials."
              icon={
                <span aria-hidden className="text-2xl">
                  🔐
                </span>
              }
              accent="sky"
              className="md:col-span-2"
            />
            <GlassFeature
              title="Detect subscriptions"
              description="We scan descriptors and patterns to surface recurring charges you may have missed."
              icon={
                <span aria-hidden className="text-2xl">
                  🧠
                </span>
              }
              accent="emerald"
              className="md:col-span-3"
            />
            <GlassFeature
              title="Cancel with guidance"
              description="We direct you to the provider’s cancellation page and provide simple steps or templates."
              icon={
                <span aria-hidden className="text-2xl">
                  🧾
                </span>
              }
              accent="violet"
              className="md:col-span-3"
            />
            <GlassFeature
              title="Start killing subscriptions"
              description="Start killing subscriptions now. It's free to try."
              icon={
                <span aria-hidden className="text-2xl">
                  🚀
                </span>
              }
              accent="zinc"
              className="md:col-span-2"
            />
          </div>
        </SnapSection>
       
        <Fomo />

        {/* Founder Message */}
        <SnapSection className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10 bg-transparent sm:h-[80vh] flex items-center justify-center">
          <FounderMessage />
        </SnapSection>

        <SnapSection className="mx-auto sm:h-[60vh] max-w-5xl md:mt-24 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 bg-transparent">
          <FAQ />
        </SnapSection>
      </main>

      <Footer />
    </div>
  );
}
