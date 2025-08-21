type CardProps = {
  title: string;
  description: string;
  icon?: React.ReactNode;
};

export default function Card({ title, description, icon }: CardProps) {
  return (
    <div className="group rounded-xl p-6 bg-gradient-to-tr from-orange-950/80 via-black/90 to-black text-white hover:shadow-[0_8px_40px_rgba(0,0,0,0.06)] transition">
      {icon && <div className="mb-4 text-card-muted">{icon}</div>}
      <h3 className="text-base font-semibold tracking-tight text-foreground">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

