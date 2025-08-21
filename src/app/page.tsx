import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Card from "@/components/Card";
// import PricingCard from "@/components/PricingCard";
import TestimonialCard from "@/components/TestimonialCard";
import Footer from "@/components/Footer";
import Fomo from "@/components/Fomo";
import FAQ from "@/components/FAQ";
import FounderMessage from "@/components/FounderMessage";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-white via-black/20 to-amber-900/30 text-foreground overflow-hidden mb-16">
      <Navbar />

      <main className="flex-1">
        <Hero />
        
        <section className="mx-auto px-4 sm:px-6 lg:px-8 py-8 bg-transparent h-[30vh] flex items-center justify-center h-full">
          <div className="">
            <TestimonialCard />
          </div>
        </section>



        <div className="bg-gradient-to-tr from-white/0.5 via-black/1 to-amber-900/30 h-16" />

        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 mt-0 bg-transparent">
          <div className="mb-6">
            <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">Why SubKill</h2>
            <p className="mt-2 text-sm text-muted">Cut waste, avoid surprise renewals, and cancel without the hassle.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
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
              title="One‑click cancellations"
              description="We navigate the fine print and handle emails and forms for you."
              icon={<span aria-hidden className="text-2xl">✅</span>}
            />
          </div>
        </section>

        <section className="mx-auto h-[50vh] max-w-7xl px-4 sm:px-6 lg:px-8 py-10 bg-transparent">
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight text-foreground">How it works</h2>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <Card
              title="1) Connect securely"
              description="Link your bank or PayPal via Plaid. We never see or store your credentials."
              icon={<span aria-hidden className="text-2xl">🔐</span>}
            />
            <Card
              title="2) Detect subscriptions"
              description="We scan descriptors and patterns to surface recurring charges you may have missed."
              icon={<span aria-hidden className="text-2xl">🧠</span>}
            />
            <Card
              title="3) Cancel in one click"
              description="Authorize once—emails, forms, and follow‑ups handled. You get confirmation."
              icon={<span aria-hidden className="text-2xl">🧾</span>}
            />
          </div>
        </section>

        <Fomo />

        <section className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-10 bg-transparent h-[80vh] flex items-center justify-center">
          <FounderMessage />
        </section>

        <section className="mx-auto h-[60vh] max-w-5xl md:mt-24 px-4 sm:px-6 lg:px-8 py-8 bg-transparent">
          <FAQ />
        </section>
        
      </main>

      <Footer />
    </div>
  );
}
