import { NextRequest } from "next/server";
import { getPlaidClient } from "@/lib/plaid";
import { supabaseServer } from "@/lib/supabaseServer";
import { supabaseService } from "@/lib/supabaseClient";

export async function POST(_req: NextRequest) {
  try {
    // Identify user via cookie session only (dev helper)
    const sb = await supabaseServer();
    const { data } = await sb.auth.getUser();
    const user = data?.user;
    if (!user) return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { "content-type": "application/json" } });

    const plaid = getPlaidClient();

    // Create sandbox public_token (First Platypus Bank, transactions)
    const pub = await plaid.sandboxPublicTokenCreate({
      institution_id: "ins_3", // First Platypus Bank
      initial_products: ["transactions" as any],
      options: { override_username: "user_good", override_password: "pass_good" } as any,
    } as any);

    const public_token = pub.data.public_token;

    const exch = await plaid.itemPublicTokenExchange({ public_token });

    const svc = supabaseService();
    const insertRes = await svc
      .from("plaid_items")
      .insert({ user_id: user.id, item_id: exch.data.item_id, access_token: exch.data.access_token })
      .select("id")
      .single();
    if (insertRes.error) {
      return new Response(JSON.stringify({ error: insertRes.error.message }), { status: 500, headers: { "content-type": "application/json" } });
    }

    return new Response(JSON.stringify({ ok: true, item_id: exch.data.item_id }), { status: 200, headers: { "content-type": "application/json" } });
  } catch (e: unknown) {
    const m = e instanceof Error ? e.message : "Unknown error";
    return new Response(JSON.stringify({ error: m }), { status: 500, headers: { "content-type": "application/json" } });
  }
}


