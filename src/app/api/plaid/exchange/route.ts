import { NextRequest } from "next/server";
import { getPlaidClient } from "@/lib/plaid";
import { supabaseServer } from "@/lib/supabaseServer";
import { supabaseService } from "@/lib/supabaseClient";

export async function POST(req: NextRequest) {
  try {
    // Identify current user (cookie first, then Authorization: Bearer fallback)
    const supabase = await supabaseServer();
    let { data: userData } = await supabase.auth.getUser();
    let user = userData?.user;
    if (!user) {
      const auth = req.headers.get("authorization") || req.headers.get("Authorization");
      const token = auth?.toLowerCase().startsWith("bearer ") ? auth.slice(7) : null;
      if (token) {
        const svc = supabaseService();
        const via = await svc.auth.getUser(token);
        user = via.data.user || null;
      }
    }
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "content-type": "application/json" },
      });
    }

    const body = await req.json();
    const publicToken: string | undefined = body?.public_token;
    if (!publicToken) {
      return new Response(JSON.stringify({ error: "Missing public_token" }), {
        status: 400,
        headers: { "content-type": "application/json" },
      });
    }

    const plaid = getPlaidClient();
    const { data } = await plaid.itemPublicTokenExchange({ public_token: publicToken });

    // Persist access_token securely to Supabase linked to the user
    const svc = supabaseService();
    const insertRes = await svc
      .from("plaid_items")
      .insert({
        user_id: user.id,
        item_id: data.item_id,
        access_token: data.access_token,
      })
      .select("id")
      .single();
    if (insertRes.error) {
      return new Response(JSON.stringify({ error: insertRes.error.message }), {
        status: 500,
        headers: { "content-type": "application/json" },
      });
    }

    console.log("[Plaid] Exchange success", { user_id: user.id, item_id: data.item_id });

    return new Response(
      JSON.stringify({ ok: true, item_id: data.item_id }),
      { status: 200, headers: { "content-type": "application/json" } }
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
}

