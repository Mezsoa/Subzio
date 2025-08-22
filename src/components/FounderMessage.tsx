import Image from "next/image";

export default function FounderMessage() {
  return (
    <div className="rounded-2xl bg-transparent p-6 sm:p-10 shadow-xl">
      <h3 className="text-lg sm:text-xl font-semibold tracking-tight text-foreground text-center mb-16">Founder’s message</h3>
      <div className="mt-4 flex flex-col items-center gap-4">
        <div className="flex-shrink-0 w-20 h-20 rounded-full bg-white/10 text-white/80 flex items-center justify-center text-sm font-semibold overflow-hidden">
          <Image src="/founder/founder.webp" alt="Founder" width={100} height={100} className="rounded-full" />
        </div>
        <div className="space-y-3 mt-16">
          <p className="text-sm sm:text-base text-muted leading-relaxed text-center">
            I built KillSub after getting hit by surprise renewals and “free trials” that quietly turned paid. Too many subscriptions were buried in statements or intentionally hard to cancel.
          </p>
          <p className="text-sm sm:text-base text-muted leading-relaxed text-center mt-4">
            KillSub connects securely, finds recurring charges with AI, sends day‑before alerts, and guides you through cancelling—so you keep more of your money with less hassle.
          </p>
          <p className="text-sm text-white/80 text-center">— John, Founder of KillSub</p>
        </div>
      </div>
    </div>
  );
}

