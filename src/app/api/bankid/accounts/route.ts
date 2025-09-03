export const runtime = "nodejs";

import { NextRequest } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { supabaseService } from "@/lib/supabaseClient";

export async function GET(req: NextRequest) {
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

  const svc = supabaseService();
  const { data: item, error } = await svc
    .from("bankid_items")
    .select("access_token")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();
  if (error || !item) return new Response("No Tink token", { status: 404 });

  const tinkRes = await fetch("https://api.tink.com/data/v2/accounts", {
    headers: { Authorization: `Bearer ${item.access_token}`, Accept: "application/json" },
  });
  if (!tinkRes.ok) {
    const text = await tinkRes.text();
    return new Response(text || "Tink accounts error", { status: tinkRes.status });
  }
  const payload = await tinkRes.json();
  const accounts = payload?.accounts ?? payload ?? [];

  return new Response(JSON.stringify({ accounts }), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
}