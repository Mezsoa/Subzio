export default function FAQ() {
  const faqs = [
    {
      q: "Is connecting my bank safe?",
      a: "Yes. We use bank-grade encryption and connect via trusted aggregators like Plaid. We never see or store your credentials. You can disconnect anytime and request deletion.",
    },
    {
      q: "How does KillSub detect subscriptions?",
      a: "We analyze transaction patterns and merchant descriptors to flag recurring charges, then surface them for review. We are working on a more accurate way to detect subscriptions.",
    },
    {
      q: "Can you cancel for me?",
      a: "As for now, no. But we will guide you to the correct cancellation page and provide easy steps or templates. We don’t automate cancellations.",
    },
    {
      q: "What does it cost?",
      a: "Nothing! Early access is free and you keep this for life. Cancel anytime.",
    },
    {
      q: "What happens to my data?",
      a: "Your data is encrypted at rest and in transit. We don't store any data on our servers.",
    },
  ];

  return (
    <div className="divide-y divide-border rounded-2xl border border-border bg-background/50">
      {faqs.map((f, i) => (
        <div key={i} className="p-4 sm:p-6">
          <h3 className="text-foreground font-medium">{f.q}</h3>
          <p className="text-sm text-muted mt-2">{f.a}</p>
        </div>
      ))}
    </div>
  );
}

