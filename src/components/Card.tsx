type CardProps = {
  title: string;
  description: string;
  icon?: React.ReactNode;
};

export default function Card({ title, description, icon }: CardProps) {
  return (
    <div className="group rounded-xl border border-black/10 p-6 bg-white hover:shadow-[0_8px_40px_rgba(0,0,0,0.06)] transition">
      {icon && <div className="mb-4 text-black/70">{icon}</div>}
      <h3 className="text-base font-semibold tracking-tight">{title}</h3>
      <p className="mt-2 text-sm text-black/60">{description}</p>
    </div>
  );
}

