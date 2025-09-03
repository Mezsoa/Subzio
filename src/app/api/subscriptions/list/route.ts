import { NextRequest } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { supabaseService } from "@/lib/supabaseClient";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  // Identify user (cookie then Bearer)
  const sb = await supabaseServer();
  const { data } = await sb.auth.getUser();
  let userId = (data?.user?.id as string | null) || null;
  if (!userId) {
    const auth = req.headers.get("authorization") || req.headers.get("Authorization");
    const token = auth?.toLowerCase().startsWith("bearer ") ? auth.slice(7) : null;
    if (token) {
      const svc = supabaseService();
      const via = await svc.auth.getUser(token);
      userId = (via.data.user?.id as string | null) || null;
    }
  }
  if (!userId) return new Response(JSON.stringify({ subscriptions: [] }), { status: 200 });

  const svc = supabaseService();
  const { data: rows, error } = await svc
    .from("detected_subscriptions")
    .select("name,cadence,last_amount,last_date,count")
    .eq("user_id", userId)
    .order("last_date", { ascending: false });
  if (error) return new Response(JSON.stringify({ subscriptions: [] }), { status: 200 });

  const subscriptions = (rows || []).map((r) => ({
    name: r.name,
    cadence: r.cadence,
    lastAmount: Number(r.last_amount),
    lastDate: r.last_date,
    count: r.count,
  }));
  return new Response(JSON.stringify({ subscriptions }), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
}

