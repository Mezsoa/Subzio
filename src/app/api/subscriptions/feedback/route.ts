import { NextRequest } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { supabaseService } from "@/lib/supabaseClient";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
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
    if (!userId) return new Response(JSON.stringify({ ok: false }), { status: 401 });

    const body = await req.json().catch(() => ({}));
    const { name, action } = body as { name?: string; action?: "confirm" | "reject" };
    if (!name || (action !== "confirm" && action !== "reject")) {
      return new Response(JSON.stringify({ ok: false, error: "Bad request" }), { status: 400 });
    }

    const svc = supabaseService();
    await svc.from("subscription_feedback").insert({
      user_id: userId,
      name,
      action,
      created_at: new Date().toISOString(),
    });

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  } catch {
    return new Response(JSON.stringify({ ok: false }), { status: 500 });
  }
}


