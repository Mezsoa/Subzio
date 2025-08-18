import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Card from "@/components/Card";
import PricingCard from "@/components/PricingCard";
import TestimonialCard from "@/components/TestimonialCard";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-1">
        <Hero />

        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <Card title="Hidden charges" description="Find sneaky recurring charges buried in statements before they drain your balance." />
            <Card title="Forgotten free trials" description="Get alerted before trials convert so you can cancel in time." />
            <Card title="Complicated cancellations" description="We navigate the fine print and cancel subscriptions on your behalf." />
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">How it works</h2>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <Card title="1. Connect your bank/PayPal" description="Securely connect via Plaid or PayPal to scan transactions for recurring charges." />
            <Card title="2. Detect hidden subscriptions" description="We use pattern detection to flag subscriptions you might have missed." />
            <Card title="3. Cancel in one click" description="Authorize us to cancel and we handle the rest—no phone calls or forms." />
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
          <div className="flex flex-col items-center">
            <PricingCard price="$5" />
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <h2 className="text-xl sm:text-2xl font-semibold tracking-tight">What people are saying</h2>
          <div className="mt-6">
            <TestimonialCard quote="I saved $340 in my first week by canceling old trials and duplicate services. SubZIo is a no-brainer." />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
