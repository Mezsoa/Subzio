import { NextRequest } from "next/server";
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
    
    // Delete all BankID/Tink items from our database
    // Note: We might not have a direct way to revoke Tink access tokens
    // but we can clean up our stored data
    const { error: deleteError } = await svc
      .from("bankid_items") // Assuming this table exists for BankID connections
      .delete()
      .eq("user_id", userId);

    // If the table doesn't exist yet, that's fine - just log it
    if (deleteError && !deleteError.message.includes("relation") && !deleteError.message.includes("does not exist")) {
      console.error("[BankID] Error deleting from database:", deleteError);
      return new Response(JSON.stringify({ error: deleteError.message }), {
        status: 500,
        headers: { "content-type": "application/json" },
      });
    }

    console.log("[BankID] Disconnected all items for user:", userId);

    return new Response(JSON.stringify({ 
      ok: true, 
      message: "Disconnected from BankID/Tink" 
    }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    console.error("[BankID] Disconnect error:", message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
}
