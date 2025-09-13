import { NextRequest } from "next/server";
import { getStripeServer } from "@/lib/stripe";
import { supabaseService } from "@/lib/supabaseClient";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const error = searchParams.get("error");

    if (error) {
      console.error("Stripe OAuth error:", error);
      return new Response(null, {
        status: 302,
        headers: { Location: "/dashboard?stripe_error=true" },
      });
    }

    if (!code || !state) {
      return new Response(null, {
        status: 302,
        headers: { Location: "/dashboard?stripe_error=missing_params" },
      });
    }

    const stripe = getStripeServer();

    // Exchange code for access token
    const responseToken = await stripe.oauth.token({
      grant_type: "authorization_code",
      code: code,
    });

    const connectedAccountId = responseToken.stripe_user_id;
    const accessToken = responseToken.access_token;

    // Store connected account in the database
    const svc = supabaseService();
    await svc.from("stripe_connect_accounts").upsert({
      user_id: state, // User ID from state param
      stripe_account_id: connectedAccountId,
      access_token: accessToken,
      account_type: "oauth",
      connected_at: new Date().toISOString(),
    });

    return new Response(null, {
      status: 302,
      headers: { Location: "/stripe/success" },
    });
  } catch (error) {
    console.error("Stripe OAuth callback error:", error);
    return new Response(null, {
      status: 302,
      headers: { Location: "/dashboard?stripe_error=callback_failed" },
    });
  }
}
