import Image from "next/image";

export default function FounderMessage() {
  return (
    <div className="rounded-2xl border border-border bg-gradient-to-br from-zinc-900 via-black to-zinc-900 p-6 sm:p-10 shadow-xl">
      <h3 className="text-lg sm:text-xl font-semibold tracking-tight text-foreground">Founder’s message</h3>
      <div className="mt-4 flex items-start gap-4">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white/10 text-white/80 flex items-center justify-center text-sm font-semibold overflow-hidden">
          <Image src="/founder/founder.webp" alt="Founder" width={40} height={40} className="rounded-full" />
        </div>
        <div className="space-y-3">
          <p className="text-sm sm:text-base text-muted leading-relaxed">
            I built SubKill after getting hit by surprise renewals and “free trials” that quietly turned paid. Too many subscriptions were buried in statements or intentionally hard to cancel.
          </p>
          <p className="text-sm sm:text-base text-muted leading-relaxed">
            SubKill finds recurring charges, alerts you before renewals, and cancels in one click—so you keep more of your money with zero hassle.
          </p>
          <p className="text-sm text-white/80">— John, Founder of SubKill</p>
        </div>
      </div>
    </div>
  );
}

