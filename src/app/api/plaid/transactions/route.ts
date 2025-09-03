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
    const now = new Date();
    const start = new Date();
    start.setMonth(start.getMonth() - 12);
    const { data } = await plaid.transactionsGet({
      access_token: item.access_token,
      start_date: start.toISOString().slice(0, 10),
      end_date: now.toISOString().slice(0, 10),
      options: { count: 100, offset: 0 },
    });

    return new Response(JSON.stringify({ transactions: data.transactions }), {
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

