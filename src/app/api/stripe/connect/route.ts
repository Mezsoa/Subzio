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

      // Debug logging
    console.log("STRIPE_CLIENT_ID:", process.env.STRIPE_CLIENT_ID);
    console.log("STRIPE_REDIRECT_URI:", process.env.STRIPE_REDIRECT_URI);
    console.log("User ID:", user.id);
    console.log("User email:", user.email);

    // Validate environment variables
    if (!process.env.STRIPE_CLIENT_ID) {
      console.error("STRIPE_CLIENT_ID is not set");
      return new Response(JSON.stringify({ error: "Stripe configuration error" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!process.env.STRIPE_REDIRECT_URI) {
      console.error("STRIPE_REDIRECT_URI is not set");
      return new Response(JSON.stringify({ error: "Stripe configuration error" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Create OAuth URL for stripe connect
    try {
      // Build OAuth URL manually to avoid SDK issues
      const baseUrl = "https://connect.stripe.com/oauth/v2/authorize";
      const params = new URLSearchParams({
        response_type: "code",
        scope: "read_write",
        client_id: process.env.STRIPE_CLIENT_ID,
        redirect_uri: process.env.STRIPE_REDIRECT_URI,
        state: user.id,
      });
      
      const oauthUrl = `${baseUrl}?${params.toString()}`;

      console.log("Generated OAuth URL:", oauthUrl);
      return new Response(JSON.stringify({ oauthUrl }), {
        status: 200,
        headers: { "content-type": "application/json" },
      });
    } catch (oauthError) {
      console.error("OAuth URL generation error:", oauthError);
      return new Response(JSON.stringify({ 
        error: "Failed to generate OAuth URL",
        details: oauthError instanceof Error ? oauthError.message : "Unknown error"
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (error) {
    console.error("[Stripe Connect OAuth] Error:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
}
