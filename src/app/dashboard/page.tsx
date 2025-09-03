"use client";
import { useEffect, useState } from "react";
import { authedFetch, AuthError } from "@/lib/authedFetch";
import SidebarNav from "@/components/SidebarNav";
import RequireAuth from "@/components/auth/RequireAuth";



type TinkAccount = {
  name?: string;
  displayName?: string;
  account?: { name?: string } | null;
  institutionName?: string;
  providerName?: string;
  financialInstitutionId?: string;
  type?: string;
  accountType?: string;
  categoryType?: string;
  balances?: {
    available?: { value?: number; currencyCode?: string };
    current?: { value?: number; currencyCode?: string };
  };
  balance?: number;
  accountBalance?: { value?: number };
  iban?: string;
  accountNumber?: string;
  mask?: string;
};
type TinkAmount =
  | number
  | {
      value?: number | { unscaledValue?: string; scale?: string | number };
      currencyCode?: string;
    };
type TinkTransaction = {
  date?: string;
  bookingDate?: string;
  transactionDate?: string;
  time?: string;
  dates?: { booked?: string; valueDate?: string };
  merchantName?: string;
  description?: string;
  reference?: string;
  remittanceInformation?: string;
  descriptions?: { display?: string; original?: string };
  counterparty?: { name?: string };
  payerOrPayee?: { name?: string };
  payee?: { name?: string; displayName?: string };
  merchant?: { name?: string };
  creditorName?: string;
  debtorName?: string;
  message?: string;
  amount?: TinkAmount;
  currency?: string;
  category?: string;
  categoryCode?: string;
  type?: string;
  classification?: { category?: string; detailedCategory?: string };
  transactionAmount?: { value?: number | string; currencyCode?: string };
  types?: { type?: string };
  status?: string;
  identifiers?: { providerTransactionId?: string };
};
type SubscriptionItem = { name: string; cadence: string; lastAmount: number; lastDate: string; count: number };



export default function DashboardPage() {
  const [accounts, setAccounts] = useState<TinkAccount[] | null>(null);
  const [tx, setTx] = useState<TinkTransaction[] | null>(null);
  const [subs, setSubs] = useState<SubscriptionItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showRawAccounts, setShowRawAccounts] = useState<boolean>(false);
  const [showRawTransactions, setShowRawTransactions] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      try {
        const ar = await authedFetch("/api/bankid/accounts");
        setAccounts(ar.ok ? (await ar.json()).accounts : []);
        const tr = await authedFetch("/api/bankid/transactions");
        setTx(tr.ok ? (await tr.json()).transactions : []);
        const sr = await authedFetch("/api/subscriptions/detect");
        setSubs(sr.ok ? (await sr.json()).subscriptions : []);
      } catch (e) {
        if (e instanceof AuthError) {
          window.location.href = "/auth/signin";
          return;
        }
        setError("Failed to load data.");
        setAccounts([]);
        setTx([]);
        setSubs([]);
      }
    })();
  }, []);


  return (
    <>
      <RequireAuth>
      <section>
        <SidebarNav />

        <div className="mx-auto px-4 sm:px-6 lg:px-8 py-10 ml-64">
          <div className="mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight">Your money hub</h1>
                <p className="text-sm text-muted mt-1">Private, encrypted, and yours. Connect once, gain clarity forever.</p>
              </div>
              <button
                onClick={async () => {
                  try {
                    const r = await authedFetch("/api/data/refresh", { method: "POST" });
                    if (r.ok) {
                      // Re-pull lightweight lists after refresh
                      const sr = await authedFetch("/api/subscriptions/list");
                      setSubs(sr.ok ? (await sr.json()).subscriptions : []);
                      const ar = await authedFetch("/api/bankid/accounts");
                      setAccounts(ar.ok ? (await ar.json()).accounts : []);
                      const tr = await authedFetch("/api/bankid/transactions");
                      setTx(tr.ok ? (await tr.json()).transactions : []);
                    }
                  } catch {
                    setError("Refresh failed");
                  }
                }}
                className="h-9 px-4 rounded-md border border-white/10 bg-white/5 text-sm hover:bg-white/10"
              >
                Refresh data
              </button>
            </div>
          </div>

          {error && (
            <div className="rounded-xl border border-red-400/20 bg-red-500/10 text-red-200 p-4 mb-6">
              {error}
            </div>
          )}

          {/* Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            <MetricCard
              label="Connection"
              value={accounts ? "Connected" : "Pending"}
              hint={accounts ? "Bank link active" : "Awaiting connection"}
              tone={accounts ? "emerald" : "amber"}
            />
            <MetricCard
              label="Accounts"
              value={Array.isArray(accounts) ? String(accounts.length) : "—"}
              hint="Linked via Tink"
              tone="zinc"
            />
            <MetricCard
              label="Transactions (90d)"
              value={tx === null ? "—" : String(extractTransactionsArray(tx).length)}
              hint="Fetched securely"
              tone="zinc"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GlassPanel title="Accounts" description="Linked accounts returned by your provider.">
              <div className="flex items-center justify-end mb-3">
                <SegmentedToggle
                  value={showRawAccounts ? "raw" : "friendly"}
                  onChange={(v) => setShowRawAccounts(v === "raw")}
                />
              </div>
              {showRawAccounts ? (
                <JsonBlock data={accounts} maxHeight="max-h-[60vh]" />
              ) : (
                <AccountsList accounts={accounts} />
              )}
            </GlassPanel>

            <GlassPanel title="Recent transactions" description="Showing the latest 10 for brevity.">
              <div className="flex items-center justify-end mb-3">
                <SegmentedToggle
                  value={showRawTransactions ? "raw" : "friendly"}
                  onChange={(v) => setShowRawTransactions(v === "raw")}
                />
              </div>
              {showRawTransactions ? (
                <JsonBlock data={(Array.isArray(tx) ? (tx as unknown[]).slice(0, 10) : tx)} />
              ) : (
                <TransactionsTable transactions={tx} />
              )}
            </GlassPanel>
          </div>

          <div className="mt-6">
            <GlassPanel title="Detected subscriptions" description="Rule-based MVP from recent transactions.">
              <SubscriptionsList items={subs} />
            </GlassPanel>
          </div>
        </div>
      </section>
      </RequireAuth>
    </>
  );
}

function MetricCard({ label, value, hint, tone }: { label: string; value: string; hint?: string; tone?: "emerald" | "amber" | "zinc" }) {
  const ring = tone === "emerald" ? "ring-emerald-400/30" : tone === "amber" ? "ring-amber-400/30" : "ring-white/10";
  const dot = tone === "emerald" ? "bg-emerald-400" : tone === "amber" ? "bg-amber-400" : "bg-white/30";
  return (
    <div className={`rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-4 ring-1 ${ring}`}>
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted">{label}</div>
        <span className={`w-2 h-2 rounded-full ${dot}`} />
      </div>
      <div className="mt-2 text-2xl font-semibold">{value}</div>
      {hint && <div className="mt-1 text-xs text-muted">{hint}</div>}
    </div>
  );
}

function GlassPanel({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-5">
      <div className="mb-3">
        <h2 className="font-medium">{title}</h2>
        {description && <p className="text-xs text-muted mt-1">{description}</p>}
      </div>
      {children}
    </div>
  );
}

function JsonBlock({ data, maxHeight }: { data: unknown; maxHeight?: string }) {
  const text = safeStringify(data);
  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
    } catch {}
  }
  return (
    <div className={`relative rounded-xl border border-white/10 bg-black/30 ${maxHeight || "max-h-[60vh]"} overflow-auto p-4`}> 
      <button onClick={copy} className="absolute top-2 right-2 text-xs px-2 py-1 rounded-md border border-white/10 bg-white/10 hover:bg-white/20">
        Copy
      </button>
      <pre className="text-xs whitespace-pre-wrap opacity-90">{text}</pre>
    </div>
  );
}

function safeStringify(value: unknown) {
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

function SegmentedToggle({ value, onChange }: { value: "friendly" | "raw"; onChange: (v: "friendly" | "raw") => void }) {
  const base = "text-xs h-8 px-3 rounded-md border border-white/10";
  const active = "bg-white/20 text-foreground";
  const inactive = "bg-white/5 hover:bg-white/10 text-foreground/80";
  return (
    <div className="inline-flex items-center gap-2">
      <button
        className={`${base} ${value === "friendly" ? active : inactive}`}
        onClick={() => onChange("friendly")}
        aria-pressed={value === "friendly"}
      >
        Friendly
      </button>
      <button
        className={`${base} ${value === "raw" ? active : inactive}`}
        onClick={() => onChange("raw")}
        aria-pressed={value === "raw"}
      >
        Raw JSON
      </button>
    </div>
  );
}

function formatCurrency(amount: number | null | undefined, currency?: string) {
  if (typeof amount !== "number" || isNaN(amount)) return "—";
  try {
    return new Intl.NumberFormat(undefined, { style: "currency", currency: currency || "USD" }).format(amount);
  } catch {
    return `${amount.toFixed(2)} ${currency || ""}`.trim();
  }
}

function extractTransactionsArray(input: unknown): TinkTransaction[] {
  if (Array.isArray(input)) return input as TinkTransaction[];
  if (input && typeof input === "object") {
    const obj = input as { transactions?: unknown; data?: { transactions?: unknown } };
    if (Array.isArray(obj.transactions)) return obj.transactions as TinkTransaction[];
    if (Array.isArray(obj.data?.transactions)) return obj.data!.transactions as TinkTransaction[];
  }
  return [];
}

function getTxnDate(t: TinkTransaction): string {
  return (
    t?.date ||
    t?.bookingDate ||
    t?.transactionDate ||
    t?.time ||
    t?.dates?.booked ||
    t?.dates?.valueDate ||
    ""
  );
}

function getTxnDesc(t: TinkTransaction): string {
  return (
    t?.merchantName ||
    t?.descriptions?.display ||
    t?.descriptions?.original ||
    t?.merchant?.name ||
    t?.payee?.displayName ||
    t?.payee?.name ||
    t?.counterparty?.name ||
    t?.payerOrPayee?.name ||
    t?.creditorName ||
    t?.debtorName ||
    t?.description ||
    t?.reference ||
    t?.remittanceInformation ||
    t?.message ||
    "Transaction"
  );
}

function getTxnCategory(t: TinkTransaction): string {
  return (
    t?.category ||
    t?.classification?.detailedCategory ||
    t?.classification?.category ||
    t?.types?.type ||
    t?.status ||
    t?.categoryCode ||
    t?.type ||
    ""
  );
}

function getTxnAmountAndCurrency(t: TinkTransaction): { amount: number | null; currency: string } {
  const fallbackCurrency = t?.currency || (typeof t?.amount === "object" && t?.amount?.currencyCode) || t?.transactionAmount?.currencyCode || "USD";
  // Try nested shapes first
  const nestedVal = typeof t?.amount === "object" ? t?.amount?.value : undefined;
  const simpleVal = typeof t?.amount === "number" ? t?.amount : undefined;
  const altVal = t?.transactionAmount?.value;
  const parsedAlt = typeof altVal === "string" ? parseFloat(altVal) : altVal;
  // Handle BigDecimal style { value: { unscaledValue, scale } }
  let bigDecimal: number | undefined;
  if (nestedVal && typeof nestedVal === "object") {
    const u = (nestedVal as { unscaledValue?: string }).unscaledValue;
    const s = (nestedVal as { scale?: string | number }).scale;
    if (typeof u === "string") {
      const scaleNum = typeof s === "string" ? parseInt(s, 10) : (typeof s === "number" ? s : 0);
      const intVal = parseInt(u, 10);
      if (!Number.isNaN(intVal)) {
        bigDecimal = intVal / Math.pow(10, scaleNum || 0);
      }
    }
  }
  const value = typeof simpleVal === "number" ? simpleVal : (typeof nestedVal === "number" ? nestedVal : (typeof bigDecimal === "number" ? bigDecimal : (typeof parsedAlt === "number" ? parsedAlt : undefined)));
  return { amount: typeof value === "number" && !isNaN(value) ? value : null, currency: fallbackCurrency || "USD" };
}

function SubscriptionsList({ items }: { items: SubscriptionItem[] | null }) {
  if (!items) return <div className="text-sm text-muted">Loading…</div>;
  if (!items.length) return <div className="text-sm text-muted">None detected yet.</div>;
  return (
    <div className="divide-y divide-white/10">
      {items.map((s, i) => (
        <div key={i} className="py-3 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="text-sm font-medium text-foreground truncate">{s.name}</div>
            <div className="text-xs text-muted">{s.cadence} • {s.count} charges • last {s.lastDate}</div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-sm font-medium">${s.lastAmount?.toFixed?.(2)}</div>
            <a
              className="inline-flex items-center justify-center h-8 px-3 rounded-md bg-primary text-on-primary text-xs font-semibold hover:bg-primary/90"
              href={`https://www.google.com/search?q=${encodeURIComponent(s.name + " cancel subscription")}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              Cancel guide
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}

function AccountsList({ accounts }: { accounts: TinkAccount[] | null }) {
  if (!accounts) return <div className="text-sm text-muted">Loading…</div>;
  if (!Array.isArray(accounts) || accounts.length === 0) return <div className="text-sm text-muted">No accounts yet.</div>;
  return (
    <div className="space-y-3">
      {accounts.map((acc: TinkAccount, idx: number) => {
        const name: string = acc?.name || acc?.displayName || acc?.account?.name || `Account ${idx + 1}`;
        const institution: string = acc?.institutionName || acc?.providerName || acc?.financialInstitutionId || "";
        const type: string = acc?.type || acc?.accountType || acc?.categoryType || "";
        const available = acc?.balances?.available?.value ?? acc?.balances?.current?.value ?? acc?.balance ?? acc?.accountBalance?.value;
        const currency: string | undefined = acc?.balances?.available?.currencyCode || (acc as unknown as { currency?: string })?.currency || acc?.balances?.current?.currencyCode;
        const ibanOrNumber: string = acc?.iban || acc?.accountNumber || acc?.mask || "";
        return (
          <div key={idx} className="rounded-xl border border-white/10 bg-white/5 p-4">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <div className="text-sm font-medium truncate">{name}</div>
                <div className="text-xs text-muted truncate">{[institution, type, ibanOrNumber].filter(Boolean).join(" • ")}</div>
              </div>
              <div className="text-sm font-semibold whitespace-nowrap">{formatCurrency(typeof available === "number" ? available : Number(available), currency)}</div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function TransactionsTable({ transactions }: { transactions: TinkTransaction[] | null }) {
  const items = extractTransactionsArray(transactions).slice(0, 10);
  if (!transactions) return <div className="text-sm text-muted">Loading…</div>;
  if (items.length === 0) return <div className="text-sm text-muted">No recent transactions.</div>;
  return (
    <div className="px-4 py-3 rounded-xl border border-white/10 overflow-hidden">
      <div className="divide-y divide-white/10">
        {items.map((t: TinkTransaction, idx: number) => {
          const date = getTxnDate(t);
          const desc = getTxnDesc(t);
          const category = getTxnCategory(t);
          const { amount, currency } = getTxnAmountAndCurrency(t);
          const signed = amount;
          return (
            <div key={idx} className="grid grid-cols-12 items-center w-[100%] gap-3 px-4 py-3 bg-white/5">
              <div className="col-span-4 min-w-0">
                <div className="text-sm font-medium truncate">{desc}</div>
                <div className="text-xs text-muted truncate">{date}</div>
              </div>
              <div className="col-span-6 text-xs text-muted truncate">{category}</div>
              <div className="col-span-2 text-right text-sm font-semibold">
                {signed != null ? formatCurrency(signed, currency) : "—"}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

