import { NextRequest } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { supabaseService } from "@/lib/supabaseClient";

export const runtime = "nodejs";

type TinkAccount = { id?: string; name?: string; type?: string; currency?: string } & Record<string, any>;
type TinkTxn = {
  id?: string;
  accountId?: string;
  amount?: number | { value?: number };
  date?: string;
  description?: string;
  merchantName?: string;
  reference?: string;
} & Record<string, any>;

export async function POST(req: NextRequest) {
  try {
    // Identify user (cookie, then Bearer fallback)
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
    if (!userId) return new Response(JSON.stringify({ ok: false, error: "Unauthorized" }), { status: 401 });

    const svc = supabaseService();
    const { data: item } = await svc
      .from("bankid_items")
      .select("access_token")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (!item) return new Response(JSON.stringify({ ok: true, accounts: 0, tx: 0, subs: 0 }), { status: 200 });

    const accessToken = item.access_token as string;

    // Fetch accounts
    const accRes = await fetch("https://api.tink.com/data/v2/accounts", {
      headers: { Authorization: `Bearer ${accessToken}`, Accept: "application/json" },
    });
    const accJson = accRes.ok ? await accRes.json() : { accounts: [] };
    const accounts: TinkAccount[] = accJson?.accounts ?? accJson ?? [];

    // Upsert accounts
    let upAcc = 0;
    for (const a of accounts) {
      const providerId = (a as any).id || (a as any).accountId || (a as any).externalId;
      if (!providerId) continue;
      const { error } = await svc.from("bank_accounts").upsert(
        {
          user_id: userId,
          provider_account_id: providerId,
          name: (a as any).name || null,
          type: (a as any).type || null,
          currency: (a as any).currency || null,
          raw: a as any,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id,provider_account_id" }
      );
      if (!error) upAcc++;
    }

    // Fetch transactions (180d)
    const now = new Date();
    const start = new Date();
    start.setDate(start.getDate() - 180);
    const startISO = start.toISOString().slice(0, 10);
    const endISO = now.toISOString().slice(0, 10);
    const txRes = await fetch(`https://api.tink.com/data/v2/transactions?start=${startISO}&end=${endISO}&limit=1000&offset=0`, {
      headers: { Authorization: `Bearer ${accessToken}`, Accept: "application/json" },
    });
    const txJson = txRes.ok ? await txRes.json() : { transactions: [] };
    const txns: TinkTxn[] = txJson?.transactions ?? txJson ?? [];

    let upTx = 0;
    for (const t of txns) {
      const providerTxnId = (t as any).id || (t as any).transactionId || (t as any).externalId;
      if (!providerTxnId) continue;
      const amountValue = typeof t.amount === "number" ? t.amount : (t.amount as any)?.value;
      const dateStr = (t as any).date || (t as any).bookingDate || (t as any).transactionDate;
      const { error } = await svc.from("bank_transactions").upsert(
        {
          user_id: userId,
          provider_txn_id: providerTxnId,
          account_id: null,
          amount: amountValue ?? null,
          date: dateStr ? dateStr.slice(0, 10) : null,
          description: (t as any).description || (t as any).reference || null,
          merchant: (t as any).merchantName || null,
          raw: t as any,
        },
        { onConflict: "user_id,provider_txn_id" }
      );
      if (!error) upTx++;
    }

    // Detect subscriptions from fetched transactions then store
    const subs = detectRecurring(
      txns.map((t) => ({
        id: (t as any).id,
        amount: typeof t.amount === "number" ? t.amount : (t.amount as any)?.value,
        date: (t as any).date || (t as any).bookingDate || (t as any).transactionDate,
        description: t.description,
        merchantName: (t as any).merchantName,
        reference: (t as any).reference,
      }))
    );

    // Replace user's detected_subscriptions
    await svc.from("detected_subscriptions").delete().eq("user_id", userId);
    for (const s of subs) {
      await svc.from("detected_subscriptions").insert({
        user_id: userId,
        name: s.name,
        cadence: s.cadence,
        last_amount: s.lastAmount,
        last_date: s.lastDate,
        count: s.count,
      });
    }

    return new Response(
      JSON.stringify({ ok: true, accounts: upAcc, tx: upTx, subs: subs.length }),
      { status: 200, headers: { "content-type": "application/json" } }
    );
  } catch (e) {
    return new Response(JSON.stringify({ ok: false }), { status: 500 });
  }
}

function detectRecurring(txns: any[]) {
  // Normalize
  const normalized = txns
    .map((t) => {
      const dateStr = t.date || null;
      const date = dateStr ? new Date(dateStr) : null;
      const amount = typeof t.amount === "number" ? t.amount : null;
      const desc = t.merchantName || t.description || t.reference || "";
      return date && typeof amount === "number" ? { date, amount: Math.abs(amount), desc } : null;
    })
    .filter(Boolean) as { date: Date; amount: number; desc: string }[];

  if (normalized.length === 0) return [] as any[];
  const groups = new Map<string, { date: Date; amount: number; raw: string }[]>();
  for (const t of normalized) {
    const key = makeKey(t.desc);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push({ date: t.date, amount: t.amount, raw: t.desc });
  }
  const results: any[] = [];
  groups.forEach((arr, key) => {
    if (arr.length < 2) return;
    arr.sort((a, b) => a.date.getTime() - b.date.getTime());
    const diffs: number[] = [];
    for (let i = 1; i < arr.length; i++) {
      diffs.push(Math.round((arr[i].date.getTime() - arr[i - 1].date.getTime()) / (1000 * 60 * 60 * 24)));
    }
    if (!diffs.length) return;
    const cadence = inferCadence(diffs);
    if (!cadence) return;
    const amounts = arr.map((x) => x.amount).sort((a, b) => a - b);
    const median = amounts[Math.floor(amounts.length / 2)];
    const mad = medianAbsDeviation(amounts, median);
    if (mad > Math.max(1, median * 0.15)) return;
    const last = arr[arr.length - 1];
    results.push({ name: denormalizeKey(key, last.raw), cadence, lastAmount: last.amount, lastDate: last.date.toISOString().slice(0, 10), count: arr.length });
  });
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
  const sorted = diffs.slice().sort((a, b) => a - b);
  const med = sorted[Math.floor(sorted.length / 2)];
  if (approx(med, 30, 8)) return "Monthly";
  if (approx(med, 7, 2)) return "Weekly";
  if (approx(med, 14, 3)) return "Biweekly";
  if (approx(med, 365, 30)) return "Yearly";
  return null;
}
function approx(value: number, target: number, tol: number) { return Math.abs(value - target) <= tol; }
function medianAbsDeviation(values: number[], median: number) {
  const devs = values.map((v) => Math.abs(v - median)).sort((a, b) => a - b);
  return devs[Math.floor(devs.length / 2)] || 0;
}

