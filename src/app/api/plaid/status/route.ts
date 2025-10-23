import { NextRequest } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { supabaseService } from "@/lib/supabaseClient";

export async function GET(req: NextRequest) {
  try {
    // Try cookie-based auth first
    const supabase = await supabaseServer();
    const { data: userData } = await supabase.auth.getUser();
    let user = userData?.user;
    let userId = user?.id;

    // Fallback to Bearer token if no cookie session
    if (!userId) {
      const authHeader = req.headers.get("Authorization") || req.headers.get("authorization");
      if (authHeader?.startsWith("Bearer ")) {
        const token = authHeader.slice(7);
        const svc = supabaseService();
        const { data: tokenUser } = await svc.auth.getUser(token);
        userId = tokenUser?.user?.id || undefined;
      }
    }

    if (!userId) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "content-type": "application/json" },
      });
    }

    const svc = supabaseService();
    const { data: items, error } = await svc
      .from("plaid_items")
      .select("id, created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1);

    const connected = !error && Array.isArray(items) && items.length > 0;

    return new Response(JSON.stringify({ connected }), {
      status: 200,
      headers: {
        "content-type": "application/json",
        "Cache-Control": "no-store, max-age=0",
        "Pragma": "no-cache",
        "Expires": "0",
      },
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
}


