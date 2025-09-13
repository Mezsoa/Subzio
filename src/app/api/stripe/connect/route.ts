import { NextRequest } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { supabaseService } from "@/lib/supabaseClient";
import { getStripeServer } from "@/lib/stripe";

export async function POST(req: NextRequest) {
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

    // Create OAuth URL for stripe connect
    const oauthUrl = stripe.oauth.authorizeUrl({
      response_type: "code",
      scope: "read_write",
      client_id: process.env.STRIPE_CLIENT_ID || "",
      redirect_uri: process.env.STRIPE_REDIRECT_URI,
      state: user.id,
    });
    return new Response(JSON.stringify({ oauthUrl }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  } catch (error) {
    console.error("[Stripe Connect OAuth] Error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
}

