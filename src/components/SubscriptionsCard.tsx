type Subscription = {
  name: string;
  plan: string;
  price: string;
  lastCharge: string;
  status: "Active" | "Trial" | "Canceled";
};

const subscriptions: Subscription[] = [
  {
    name: "Netflix",
    plan: "Premium 4K",
    price: "$19.99/mo",
    lastCharge: "Aug 3, 2025",
    status: "Active",
  },
  {
    name: "Spotify",
    plan: "Family",
    price: "$15.99/mo",
    lastCharge: "Aug 1, 2025",
    status: "Trial",
  },
  {
    name: "Adobe",
    plan: "Creative Cloud",
    price: "$54.99/mo",
    lastCharge: "Jul 24, 2025",
    status: "Active",
  },
  {
    name: "Amazon",
    plan: "Prime",
    price: "$14.99/mo",
    lastCharge: "Aug 1, 2025",
    status: "Trial",
  },
  {
    name: "World of Warcraft",
    plan: "Battle.net",
    price: "$14.99/mo",
    lastCharge: "Aug 1, 2025",
    status: "Canceled",
  },
  {
    name: "Apple", 
    plan: "Apple Music",
    price: "$9.99/mo",
    lastCharge: "Aug 1, 2025",
    status: "Canceled",
  },
];

function StatusBadge({ status }: { status: Subscription["status"] }) {
  const styles =
    status === "Active"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200 w-14 text-center text-xs flex items-center justify-center"
      : status === "Trial"  
      ? "bg-amber-50 text-amber-800 border-amber-200 w-14 text-center text-xs flex items-center justify-center"
      : "bg-zinc-100 text-zinc-700 border-zinc-200 w-16 text-center text-xs flex items-center justify-center";
  return (
    <span className={`inline-flex items-center h-6 px-2 rounded-md text-xs font-medium border ${styles}`}>
      {status}
    </span>
  );
}

export default function SubscriptionsCard() {
  return (
      <div className="mt-12 h-[30vh] mx-auto max-w-3xl rounded-2xl border border-card-border bg-card text-card-foreground shadow-sm mb-16 overflow-hidden">
      <div className="p-4 sm:p-6 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-base sm:text-lg font-semibold tracking-tight">Your subscriptions</h3>
          <p className="text-xs sm:text-sm text-card-muted">Automatically detected from your transactions</p>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-sm">
          <span className="text-card-muted">Potential savings</span>
          <span className="font-medium">$68/mo</span>
        </div>
      </div>

      <div className="h-[calc(100%-80px)] overflow-y-auto scrollbar-thin scrollbar-color-card-border px-4 sm:px-6 pb-4">
        <div className="divide-y divide-card-border/70">
        {subscriptions.map((s) => (
          <div key={s.name} className="py-4 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
            <div className="flex-1 min-w-0 flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-card-foreground/10 flex items-center justify-center text-[10px] font-semibold">
                {s.name.charAt(0)}
              </div>
              <div className="min-w-0 flex flex-col gap-1 items-start justify-center text-left">
                <div className="text-sm font-medium truncate">{s.name}</div>
                <div className="text-xs text-card-muted truncate">{s.plan}</div>
              </div>
            </div>

            <div className="sm:w-52 min-w-0 grid grid-cols-2 sm:grid-cols-1 gap-1">
              <div className="text-sm font-medium">{s.price}</div>
              <div className="text-xs text-card-muted">Last charge {s.lastCharge}</div>
            </div>

            <div className="sm:w-56 flex items-center justify-between sm:justify-end gap-2">
              <StatusBadge status={s.status} />
              <a
                className="inline-flex items-center justify-center h-6 px-3 rounded-md bg-primary text-on-primary text-xs sm:text-sm font-regular hover:bg-primary/90 transition"
                href={`https://www.google.com/search?q=${encodeURIComponent(s.name + " cancel subscription")}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Cancel
              </a>
            </div>
          </div>
        ))}
        </div>
      </div>
    </div>
  );
}

