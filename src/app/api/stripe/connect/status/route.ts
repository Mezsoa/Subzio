import { NextRequest } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { supabaseService } from "@/lib/supabaseClient";

export async function GET(req: NextRequest) {
  try {
    // Get authenticated user
    const supabase = await supabaseServer();
    let { data: userData } = await supabase.auth.getUser();
    let user = userData?.user;
    
    if (!user) {
      const auth = req.headers.get("authorization");
      const token = auth?.startsWith("Bearer ") ? auth.slice(7) : null;
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

    // Get user's Stripe account from database
    const svc = supabaseService();
    console.log("Checking Stripe account for user:", user.id);
    const { data: account, error } = await svc
      .from("stripe_connect_accounts")
      .select("*")
      .eq("user_id", user.id)
      .single();

    console.log("Stripe account query result:", { account, error });

    if (error || !account) {
      console.log("No Stripe account found, returning not connected");
      return new Response(JSON.stringify({ connected: false }), {
        status: 200,
        headers: {
          "content-type": "application/json",
          "Cache-Control": "no-store, max-age=0",
          "Pragma": "no-cache",
          "Expires": "0",
        },
      });
    }

    return new Response(JSON.stringify({
      connected: true,
      account: {
        id: account.stripe_account_id,
        account_type: account.account_type,
        connected_at: account.connected_at,
      }
    }), {
      status: 200,
      headers: {
        "content-type": "application/json",
        "Cache-Control": "no-store, max-age=0",
        "Pragma": "no-cache",
        "Expires": "0",
      },
    });

  } catch (error) {
    console.error("Stripe Connect status error:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Unknown error" 
    }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
}
