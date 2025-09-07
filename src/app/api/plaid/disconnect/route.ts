import { NextRequest } from "next/server";
import { getPlaidClient } from "@/lib/plaid";
import { supabaseServer } from "@/lib/supabaseServer";
import { supabaseService } from "@/lib/supabaseClient";

export async function POST(req: NextRequest) {
  try {
    // Try cookie-based auth first
    const supabase = await supabaseServer();
    const { data: userData } = await supabase.auth.getUser();
    let user = userData?.user;
    let userId = user?.id;

    // Fallback to Bearer token if no cookie session
    if (!userId) {
      const authHeader = req.headers.get("Authorization");
      if (authHeader?.startsWith("Bearer ")) {
        const token = authHeader.slice(7);
        const svc = supabaseService();
        const { data: tokenUser } = await svc.auth.getUser(token);
        userId = tokenUser?.user?.id;
      }
    }

    if (!userId) return new Response("Unauthorized", { status: 401 });

    const svc = supabaseService();
    
    // Get all Plaid items for this user
    const { data: items, error: fetchError } = await svc
      .from("plaid_items")
      .select("access_token, item_id")
      .eq("user_id", userId);

    if (fetchError) {
      console.error("[Plaid] Error fetching items:", fetchError);
      return new Response(JSON.stringify({ error: fetchError.message }), {
        status: 500,
        headers: { "content-type": "application/json" },
      });
    }

    const plaid = getPlaidClient();
    const disconnectedItems = [];

    // Remove each Plaid item
    for (const item of items || []) {
      try {
        // Remove the item from Plaid
        await plaid.itemRemove({ access_token: item.access_token });
        disconnectedItems.push(item.item_id);
        console.log("[Plaid] Disconnected item:", item.item_id);
      } catch (e) {
        console.error("[Plaid] Error removing item:", item.item_id, e);
        // Continue with other items even if one fails
      }
    }

    // Delete all Plaid items from our database
    const { error: deleteError } = await svc
      .from("plaid_items")
      .delete()
      .eq("user_id", userId);

    if (deleteError) {
      console.error("[Plaid] Error deleting from database:", deleteError);
      return new Response(JSON.stringify({ error: deleteError.message }), {
        status: 500,
        headers: { "content-type": "application/json" },
      });
    }

    console.log("[Plaid] Disconnected all items for user:", userId);

    return new Response(JSON.stringify({ 
      ok: true, 
      disconnected_items: disconnectedItems.length,
      message: `Disconnected ${disconnectedItems.length} Plaid items` 
    }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    console.error("[Plaid] Disconnect error:", message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
}
