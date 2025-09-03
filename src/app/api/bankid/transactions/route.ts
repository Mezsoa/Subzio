export const runtime = "nodejs";

import { NextRequest } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { supabaseService } from "@/lib/supabaseClient";

export async function GET(req: NextRequest) {
  // 1) Identify user
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
  if (!userId) return new Response("Unauthorized", { status: 401 });

  // 2) Get token
  const svc = supabaseService();
  const { data: item, error } = await svc
    .from("bankid_items")
    .select("access_token")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error || !item) return new Response("No Tink token", { status: 404 });
  const accessToken = item.access_token as string;

  // 3) Build date range (last 90 days for demo)
  const now = new Date();
  const start = new Date();
  start.setDate(start.getDate() - 90);
  const startISO = start.toISOString().slice(0, 10);
  const endISO = now.toISOString().slice(0, 10);

  // 4) Call Tink Transactions endpoint
  // NOTE: Confirm exact endpoint and params in Tink docs.
  const endpoint = `https://api.tink.com/data/v2/transactions?start=${startISO}&end=${endISO}&limit=100&offset=0`;
  const tinkRes = await fetch(endpoint, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: "application/json",
    },
  });
  if (!tinkRes.ok) {
    const text = await tinkRes.text();
    return new Response(text || "Tink transactions error", { status: tinkRes.status });
  }
  const transactions = await tinkRes.json();

  // 5) Return to client
  return new Response(JSON.stringify({ transactions }), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
}