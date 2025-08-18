type TestimonialCardProps = {
  quote: string;
  name?: string;
  role?: string;
};

export default function TestimonialCard({ quote, name = "Your Future Customer", role = "Early adopter" }: TestimonialCardProps) {
  return (
    <div className="rounded-xl border border-black/10 p-6 bg-white max-w-xl">
      <p className="text-base text-black/80">“{quote}”</p>
      <div className="mt-4 flex items-center gap-3">
        <div className="h-9 w-9 rounded-full bg-black/5" />
        <div>
          <div className="text-sm font-medium">{name}</div>
          <div className="text-xs text-black/60">{role}</div>
        </div>
      </div>
    </div>
  );
}

