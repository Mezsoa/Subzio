import { NextRequest } from "next/server";
import { getStripeServer } from "@/lib/stripe";
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
    const { data: account, error } = await svc
      .from("stripe_connect_accounts")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (error || !account) {
      return new Response(JSON.stringify({ connected: false }), {
        status: 200,
        headers: { "content-type": "application/json" },
      });
    }

    // Get fresh account details from Stripe
    const stripe = getStripeServer();
    const stripeAccount = await stripe.accounts.retrieve(account.stripe_account_id);

    // Update our database with latest status
    await svc
      .from("stripe_connect_accounts")
      .update({
        charges_enabled: stripeAccount.charges_enabled,
        payouts_enabled: stripeAccount.payouts_enabled,
        details_submitted: stripeAccount.details_submitted,
        country: stripeAccount.country,
        business_type: stripeAccount.business_type,
        updated_at: new Date().toISOString(),
      })
      .eq("id", account.id);

    return new Response(JSON.stringify({
      connected: true,
      account: {
        id: stripeAccount.id,
        charges_enabled: stripeAccount.charges_enabled,
        payouts_enabled: stripeAccount.payouts_enabled,
        details_submitted: stripeAccount.details_submitted,
        country: stripeAccount.country,
        business_type: stripeAccount.business_type,
      }
    }), {
      status: 200,
      headers: { "content-type": "application/json" },
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