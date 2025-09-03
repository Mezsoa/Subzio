import { NextRequest } from "next/server";
import { getPlaidClient } from "@/lib/plaid";
import { supabaseServer } from "@/lib/supabaseServer";
import { supabaseService } from "@/lib/supabaseClient";

export async function GET(_req: NextRequest) {
  try {
    const supabase = await supabaseServer();
    const { data: userData } = await supabase.auth.getUser();
    const user = userData?.user;
    if (!user) return new Response("Unauthorized", { status: 401 });

    const svc = supabaseService();
    const { data: item, error } = await svc
      .from("plaid_items")
      .select("access_token")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();
    if (error || !item) return new Response("No item", { status: 404 });

    const plaid = getPlaidClient();
    const { data } = await plaid.accountsGet({ access_token: item.access_token });
    return new Response(JSON.stringify({ accounts: data.accounts }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
}

