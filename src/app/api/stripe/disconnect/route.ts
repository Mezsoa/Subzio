import { NextRequest } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { supabaseService } from "@/lib/supabaseClient";
import { getStripeServer } from "@/lib/stripe";

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

    if (!userId) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "content-type": "application/json" },
      });
    }

    const svc = supabaseService();
    
    // Get user's Stripe Connect account
    const { data: stripeAccount, error: fetchError } = await svc
      .from("stripe_connect_accounts")
      .select("stripe_account_id, access_token")
      .eq("user_id", userId)
      .single();

    if (fetchError && !fetchError.message.includes("No rows returned")) {
      console.error("[Stripe] Error fetching account:", fetchError);
      return new Response(JSON.stringify({ error: fetchError.message }), {
        status: 500,
        headers: { "content-type": "application/json" },
      });
    }

    // If no Stripe account found, that's fine - user wasn't connected
    if (!stripeAccount) {
      console.log("[Stripe] No Stripe Connect account found for user:", userId);
      return new Response(JSON.stringify({ 
        ok: true, 
        message: "No Stripe Connect account to disconnect" 
      }), {
        status: 200,
        headers: { "content-type": "application/json" },
      });
    }

    // Try to deauthorize the Stripe Connect account
    try {
      const stripe = getStripeServer();
      await stripe.oauth.deauthorize({
        client_id: process.env.STRIPE_CLIENT_ID || "",
        stripe_user_id: stripeAccount.stripe_account_id,
      });
      console.log("[Stripe] Successfully deauthorized account:", stripeAccount.stripe_account_id);
    } catch (stripeError) {
      console.warn("[Stripe] Error deauthorizing account:", stripeError);
      // Continue with database cleanup even if Stripe deauthorization fails
    }

    // Delete Stripe Connect account from our database
    const { error: deleteError } = await svc
      .from("stripe_connect_accounts")
      .delete()
      .eq("user_id", userId);

    if (deleteError) {
      console.error("[Stripe] Error deleting from database:", deleteError);
      return new Response(JSON.stringify({ error: deleteError.message }), {
        status: 500,
        headers: { "content-type": "application/json" },
      });
    }

    console.log("[Stripe] Disconnected account for user:", userId);

    return new Response(JSON.stringify({ 
      ok: true, 
      message: "Disconnected from Stripe Connect" 
    }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    console.error("[Stripe] Error:", message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
}
