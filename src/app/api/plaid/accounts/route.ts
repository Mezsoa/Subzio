import { NextRequest } from "next/server";
import { getPlaidClient } from "@/lib/plaid";
import { supabaseServer } from "@/lib/supabaseServer";
import { supabaseService } from "@/lib/supabaseClient";

export async function GET(req: NextRequest) {
  try {
    console.log("[Plaid Accounts] Request received");
    
    // Try cookie-based auth first
    const supabase = await supabaseServer();
    const { data: userData } = await supabase.auth.getUser();
    let user = userData?.user;
    let userId = user?.id;
    console.log("[Plaid Accounts] Cookie auth - userId:", userId ? "found" : "not found");

    // Fallback to Bearer token if no cookie session
    if (!userId) {
      const authHeader = req.headers.get("Authorization");
      console.log("[Plaid Accounts] Checking Bearer token:", authHeader ? "present" : "missing");
      if (authHeader?.startsWith("Bearer ")) {
        const token = authHeader.slice(7);
        const svc = supabaseService();
        const { data: tokenUser } = await svc.auth.getUser(token);
        userId = tokenUser?.user?.id;
        console.log("[Plaid Accounts] Bearer auth - userId:", userId ? "found" : "not found");
      }
    }

    if (!userId) {
      console.log("[Plaid Accounts] No valid authentication found");
      return new Response("Unauthorized", { status: 401 });
    }

    const svc = supabaseService();
    const { data: item, error } = await svc
      .from("plaid_items")
      .select("access_token")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1)
      .single();
    
    console.log("[Plaid Accounts] Database query - error:", error?.message || "none", "item:", item ? "found" : "not found");
    if (error || !item) return new Response("No item", { status: 404 });

    const plaid = getPlaidClient();
    const { data } = await plaid.accountsGet({ access_token: item.access_token });
    console.log("[Plaid Accounts] Success - found", data.accounts.length, "accounts");
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

