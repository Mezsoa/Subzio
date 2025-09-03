import { NextRequest } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { supabaseService } from "@/lib/supabaseClient";

export const runtime = "nodejs";

type TinkTxn = {
  id?: string;
  amount?: number | { value?: number };
  date?: string;
  description?: string;
  merchantName?: string;
  reference?: string;
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
  // Normalize transactions
  const normalized = txns
    .map((t) => {
      const dateStr = (t as any).date || (t as any).bookingDate || (t as any).transactionDate || null;
      const date = dateStr ? new Date(dateStr) : null;
      const amountValue = typeof t.amount === "number" ? t.amount : (t.amount as any)?.value;
      const amount = typeof amountValue === "number" ? amountValue : null;
      const desc = t.merchantName || t.description || t.reference || "";
      return date && typeof amount === "number"
        ? { date, amount, desc }
        : null;
    })
    .filter(Boolean) as { date: Date; amount: number; desc: string }[];

  if (normalized.length === 0) return [] as any[];

  // Group by merchant-ish key
  const groups = new Map<string, { date: Date; amount: number; raw: string }[]>();
  for (const t of normalized) {
    const key = makeKey(t.desc);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push({ date: t.date, amount: Math.abs(t.amount), raw: t.desc });
  }

  const results: any[] = [];
  groups.forEach((arr, key) => {
    if (arr.length < 2) return; // need at least two
    // sort by date asc
    arr.sort((a, b) => a.date.getTime() - b.date.getTime());
    // diffs in days
    const diffs = [] as number[];
    for (let i = 1; i < arr.length; i++) {
      const d = (arr[i].date.getTime() - arr[i - 1].date.getTime()) / (1000 * 60 * 60 * 24);
      diffs.push(Math.round(d));
    }
    if (diffs.length === 0) return;

    const cadence = inferCadence(diffs);
    if (!cadence) return; // not recurring enough

    // amount stability: median absolute deviation below threshold
    const amounts = arr.map((x) => x.amount).sort((a, b) => a - b);
    const median = amounts[Math.floor(amounts.length / 2)];
    const mad = medianAbsDeviation(amounts, median);
    const stable = mad <= Math.max(1, median * 0.15); // allow 15% variation or <= 1 unit
    if (!stable) return;

    const last = arr[arr.length - 1];
    results.push({
      name: denormalizeKey(key, last.raw),
      cadence,
      lastAmount: last.amount,
      lastDate: last.date.toISOString().slice(0, 10),
      count: arr.length,
    });
  });

  // Sort by last date desc
  results.sort((a, b) => (a.lastDate < b.lastDate ? 1 : -1));
  return results.slice(0, 50);
}

function makeKey(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim().replace(/\s+/g, " ");
}
function denormalizeKey(key: string, fallback: string) {
  const cap = key.replace(/\b\w/g, (c) => c.toUpperCase());
  return cap || fallback;
}
function inferCadence(diffs: number[]) {
  // use median diff
  const sorted = diffs.slice().sort((a, b) => a - b);
  const med = sorted[Math.floor(sorted.length / 2)];
  if (approx(med, 30, 8)) return "Monthly";
  if (approx(med, 7, 2)) return "Weekly";
  if (approx(med, 14, 3)) return "Biweekly";
  if (approx(med, 365, 30)) return "Yearly";
  return null;
}
function approx(value: number, target: number, tol: number) {
  return Math.abs(value - target) <= tol;
}
function medianAbsDeviation(values: number[], median: number) {
  const devs = values.map((v) => Math.abs(v - median)).sort((a, b) => a - b);
  return devs[Math.floor(devs.length / 2)] || 0;
}

