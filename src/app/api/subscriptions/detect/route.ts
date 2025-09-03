import { NextRequest } from "next/server";
import { matchProvider } from "@/lib/subscriptionProviders";
import { supabaseServer } from "@/lib/supabaseServer";
import { supabaseService } from "@/lib/supabaseClient";

export const runtime = "nodejs";

type BigDecimal = { unscaledValue?: string; scale?: string | number };
type TinkAmount = number | { value?: number | BigDecimal; currencyCode?: string };
type TinkTxn = {
  id?: string;
  amount?: TinkAmount;
  transactionAmount?: { value?: number | string; currencyCode?: string };
  currency?: string;
  date?: string;
  bookingDate?: string;
  transactionDate?: string;
  dates?: { booked?: string; valueDate?: string };
  description?: string;
  descriptions?: { display?: string; original?: string };
  merchantName?: string;
  merchant?: { name?: string };
  payee?: { name?: string; displayName?: string };
  counterparty?: { name?: string };
  payerOrPayee?: { name?: string };
  reference?: string;
  remittanceInformation?: string;
  message?: string;
  category?: string;
  categoryCode?: string;
  classification?: { category?: string; detailedCategory?: string };
  types?: { type?: string };
  status?: string;
};

export async function GET(req: NextRequest) {
  try {
    // Identify user (cookie then Bearer fallback)
    const sb = await supabaseServer();
    const { data } = await sb.auth.getUser();
    let userId = data?.user?.id || null;
    if (!userId) {
      const auth = req.headers.get("authorization") || req.headers.get("Authorization");
      const token = auth?.toLowerCase().startsWith("bearer ") ? auth.slice(7) : null;
      if (token) {
        const svc = supabaseService();
        const via = await svc.auth.getUser(token);
        userId = via.data.user?.id || null;
      }
    }
    if (!userId) return new Response(JSON.stringify({ subscriptions: [] }), { status: 200 });

    // Load access token
    const svc = supabaseService();
    const { data: item } = await svc
      .from("bankid_items")
      .select("access_token")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (!item) return new Response(JSON.stringify({ subscriptions: [] }), { status: 200 });

    // Fetch recent transactions (180d)
    const now = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 180);
    const startISO = start.toISOString().slice(0, 10);
    const endISO = now.toISOString().slice(0, 10);
    const endpoint = `https://api.tink.com/data/v2/transactions?start=${startISO}&end=${endISO}&limit=500&offset=0`;
    const tinkRes = await fetch(endpoint, {
      headers: { Authorization: `Bearer ${item.access_token}`, Accept: "application/json" },
    });
    if (!tinkRes.ok) {
      // On error, return empty; UI can show none
      return new Response(JSON.stringify({ subscriptions: [] }), { status: 200 });
    }
    const payload = await tinkRes.json();
    const txns: TinkTxn[] = payload?.transactions ?? payload ?? [];

    const subs = detectRecurring(txns);
    return new Response(JSON.stringify({ subscriptions: subs }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  } catch {
    return new Response(JSON.stringify({ subscriptions: [] }), { status: 200 });
  }
}

function detectRecurring(txns: TinkTxn[]) {
  const normalized = txns
    .map((t) => normalizeTxn(t))
    .filter(Boolean) as { date: Date; amountAbs: number; rawAmount: number; desc: string }[];

  if (normalized.length === 0) return [] as any[];

  // Group by normalized merchant key
  const groups = new Map<string, { date: Date; amountAbs: number; rawAmount: number; rawDesc: string }[]>();
  for (const t of normalized) {
    const key = makeKey(t.desc);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push({ date: t.date, amountAbs: t.amountAbs, rawAmount: t.rawAmount, rawDesc: t.desc });
  }

  const results: any[] = [];
  groups.forEach((arr, key) => {
    if (arr.length < 2) return; // need at least two to be recurring
    arr.sort((a, b) => a.date.getTime() - b.date.getTime());

    // diffs in days
    const diffs: number[] = [];
    for (let i = 1; i < arr.length; i++) {
      const d = (arr[i].date.getTime() - arr[i - 1].date.getTime()) / (1000 * 60 * 60 * 24);
      diffs.push(Math.round(d));
    }
    if (diffs.length === 0) return;

    const cadenceInfo = inferCadenceWithScore(diffs);
    if (!cadenceInfo) return;

    // Amount stability
    const amounts = arr.map((x) => x.amountAbs).sort((a, b) => a - b);
    const median = amounts[Math.floor(amounts.length / 2)];
    const mad = medianAbsDeviation(amounts, median);
    const stabilityScore = computeStabilityScore(median, mad);

    // Count score (more occurrences => higher confidence)
    const count = arr.length;
    const countScore = Math.max(0, Math.min(1, (count - 2) / 6)); // 2→0, 8→1

    // Keyword/vendor score
    const vendorName = denormalizeKey(key, arr[arr.length - 1].rawDesc);
    const providerMatch = matchProvider(vendorName);
    const keywordScore = providerMatch?.score ?? computeKeywordScore(vendorName);

    // Overall confidence (weights sum to 1)
    const confidence = clamp01(
      cadenceInfo.score * 0.45 +
      stabilityScore * 0.30 +
      countScore * 0.15 +
      keywordScore * 0.10
    );

    const last = arr[arr.length - 1];
    results.push({
      name: providerMatch?.provider.displayName || vendorName,
      cadence: cadenceInfo.label,
      lastAmount: last.amountAbs,
      lastDate: last.date.toISOString().slice(0, 10),
      count,
      confidence: Number(confidence.toFixed(2)),
      reasons: buildReasons({ cadenceInfo, stabilityScore, count, keywordScore }),
      cancelUrl: providerMatch?.provider.cancelUrl,
      providerEmoji: providerMatch?.provider.logoEmoji,
    });
  });

  // Sort by confidence desc, then last date desc
  results.sort((a, b) => (b.confidence - a.confidence) || (a.lastDate < b.lastDate ? 1 : -1));
  return results.slice(0, 100);
}

function normalizeTxn(t: TinkTxn) {
  const dateStr = t.date || t.bookingDate || t.transactionDate || t.dates?.booked || t.dates?.valueDate || null;
  const date = dateStr ? new Date(dateStr) : null;
  const amount = parseAmount(t);
  const desc = getTxnDesc(t);
  if (!date || amount == null) return null;
  return { date, amountAbs: Math.abs(amount), rawAmount: amount, desc };
}

function parseAmount(t: TinkTxn): number | null {
  if (typeof t.amount === "number") return t.amount;
  const nested = t.amount && typeof t.amount === "object" ? (t.amount as any).value : undefined;
  if (typeof nested === "number") return nested;
  if (nested && typeof nested === "object") {
    const u = (nested as BigDecimal).unscaledValue;
    const s = (nested as BigDecimal).scale;
    if (typeof u === "string") {
      const scaleNum = typeof s === "string" ? parseInt(s, 10) : (typeof s === "number" ? s : 0);
      const intVal = parseInt(u, 10);
      if (!Number.isNaN(intVal)) return intVal / Math.pow(10, scaleNum || 0);
    }
  }
  const alt = t.transactionAmount?.value;
  if (typeof alt === "number") return alt;
  if (typeof alt === "string") {
    const p = parseFloat(alt);
    return Number.isNaN(p) ? null : p;
  }
  return null;
}

function getTxnDesc(t: TinkTxn): string {
  return (
    t.merchantName ||
    t.descriptions?.display ||
    t.descriptions?.original ||
    t.merchant?.name ||
    t.payee?.displayName ||
    t.payee?.name ||
    t.counterparty?.name ||
    t.payerOrPayee?.name ||
    t.description ||
    t.reference ||
    t.remittanceInformation ||
    t.message ||
    ""
  );
}

function makeKey(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim().replace(/\s+/g, " ");
}
function denormalizeKey(key: string, fallback: string) {
  const cap = key.replace(/\b\w/g, (c) => c.toUpperCase());
  return cap || fallback;
}
function inferCadence(diffs: number[]) {
  // kept for compatibility; not used directly
  const sorted = diffs.slice().sort((a, b) => a - b);
  const med = sorted[Math.floor(sorted.length / 2)];
  if (approx(med, 30, 8)) return "Monthly";
  if (approx(med, 7, 2)) return "Weekly";
  if (approx(med, 14, 3)) return "Biweekly";
  if (approx(med, 365, 30)) return "Yearly";
  return null;
}

function inferCadenceWithScore(diffs: number[]) {
  // Use median and IQR to score regularity
  const sorted = diffs.slice().sort((a, b) => a - b);
  const med = sorted[Math.floor(sorted.length / 2)];
  const label = approx(med, 7, 2)
    ? "Weekly"
    : approx(med, 14, 3)
    ? "Biweekly"
    : approx(med, 30, 8)
    ? "Monthly"
    : approx(med, 365, 30)
    ? "Yearly"
    : null;
  if (!label) return null;

  // Regularity score: lower spread => higher
  const q1 = sorted[Math.floor(sorted.length * 0.25)];
  const q3 = sorted[Math.floor(sorted.length * 0.75)];
  const iqr = Math.max(0, (q3 ?? med) - (q1 ?? med));
  const tol = label === "Weekly" ? 2 : label === "Biweekly" ? 3 : label === "Monthly" ? 8 : 30;
  const reg = clamp01(1 - iqr / (tol * 2));
  return { label, score: reg };
}
function approx(value: number, target: number, tol: number) {
  return Math.abs(value - target) <= tol;
}
function medianAbsDeviation(values: number[], median: number) {
  const devs = values.map((v) => Math.abs(v - median)).sort((a, b) => a - b);
  return devs[Math.floor(devs.length / 2)] || 0;
}
function computeStabilityScore(median: number, mad: number) {
  if (!isFinite(median) || median === 0) return 0;
  // full score when mad <= 5% of median; zero when >= 30%
  const ratio = mad / Math.abs(median);
  if (ratio <= 0.05) return 1;
  if (ratio >= 0.3) return 0;
  return clamp01(1 - (ratio - 0.05) / (0.25));
}

const KNOWN_VENDORS: { pattern: RegExp; weight: number }[] = [
  { pattern: /spotify|netflix|youtube premium|disney\+|hbo|viaplay/i, weight: 1 },
  { pattern: /apple music|apple tv|icloud/i, weight: 1 },
  { pattern: /amazon prime|audible/i, weight: 1 },
  { pattern: /tidal|deezer/i, weight: 0.8 },
  { pattern: /patreon|onlyfans/i, weight: 0.6 },
  { pattern: /gym|fitness|ifitness|sats|actic/i, weight: 0.6 },
  { pattern: /telia|tele2|comviq|tre|halebop|telenor/i, weight: 0.8 },
  { pattern: /abonnemang|prenumeration|subscription/i, weight: 0.7 },
];
function computeKeywordScore(name: string): number {
  const hit = KNOWN_VENDORS.find((v) => v.pattern.test(name));
  return hit ? hit.weight : 0;
}
function buildReasons(args: { cadenceInfo: { label: string; score: number }; stabilityScore: number; count: number; keywordScore: number }) {
  const reasons: string[] = [];
  reasons.push(`${args.cadenceInfo.label} cadence pattern`);
  if (args.stabilityScore > 0.6) reasons.push("Stable charge amount");
  if (args.count >= 3) reasons.push(`${args.count} occurrences`);
  if (args.keywordScore > 0) reasons.push("Known subscription provider");
  return reasons;
}
function clamp01(x: number) { return Math.max(0, Math.min(1, x)); }

