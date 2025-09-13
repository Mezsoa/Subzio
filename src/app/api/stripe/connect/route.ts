import { NextRequest } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { supabaseService } from "@/lib/supabaseClient";
import { getStripeServer } from "@/lib/stripe";

async function POST(req: NextRequest) {
  try {
    // Get authenticated user
    const supabase = await supabaseServer();
    const { data: userData } = await supabase.auth.getUser();
    let user = userData?.user;

    // Im using a Fallback to Bearer token if no cookie session
    if (!user) {
      const auth =
        req.headers.get("authorization") || req.headers.get("Authorization");
      const token = auth?.toLowerCase().startsWith("bearer ")
        ? auth.slice(7)
        : null;
      if (token) {
        const svc = await supabaseService();
        const via = await svc.auth.getUser(token);
        user = via.data.user || null;
      }
    }

    if (!user) {
      return new Response(JSON.stringify({ error: "Not Authorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const stripe = getStripeServer();

    // Step 1: Create Express account (Following Stripe Docs)
    const account = await stripe.accounts.create({
      type: "express",
      country: "US",
      email: user.email,
      capabilities: {
        card_payments: {
          requested: true,
        },
        transfers: {
          requested: true,
        },
      },
      business_profile: {
        url: "https://killsub.com",
      },
    });

    // Step 2: Create account Link for onboarding (Following Stripe Docs)
    const accountLink = await stripe.accountLinks.create({
      account: account.id,
      refresh_url: `${req.headers.get("origin")}/dashboard?stripe_refresh=true`,
      return_url: `${req.headers.get("origin")}/dashboard?stripe_success=true`,
      type: "account_onboarding",
    });

    //Step 3: Store the account in my database
    const svc = await supabaseService();
    await svc.from("stripe_connect_accounts").insert({
      user_id: user.id,
      stripe_account_id: account.id,
      account_type: "express",
      email: user.email,
      country: "US",
    });

    return new Response(
      JSON.stringify({
        accountId: account.id,
        onboardingUrl: accountLink.url,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("[Stripe Connect] Error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
export default POST;
