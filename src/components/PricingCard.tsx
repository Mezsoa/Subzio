type PricingCardProps = {
  price: string;
  ctaHref?: string;
  ctaText?: string;
};

export default function PricingCard({ price, ctaHref = "#waitlist", ctaText = "Join waitlist" }: PricingCardProps) {
  return (
    <div className="rounded-2xl border border-black/10 p-8 bg-white max-w-md w-full">
      <h3 className="text-xl font-semibold tracking-tight">One subscription that pays for itself</h3>
      <div className="mt-4 flex items-baseline gap-2">
        <span className="text-4xl font-semibold">{price}</span>
        <span className="text-sm text-black/60">/ month</span>
      </div>
      <ul className="mt-4 text-sm text-black/70 space-y-2">
        <li>Cancel unlimited subscriptions</li>
        <li>Automatic detection & alerts</li>
        <li>Privacy-first, bank-grade security</li>
      </ul>
      <a
        href={ctaHref}
        className="mt-6 inline-flex w-full items-center justify-center h-11 px-5 rounded-md bg-black text-white text-sm font-semibold hover:bg-black/90 transition"
      >
        {ctaText}
      </a>
    </div>
  );
}

