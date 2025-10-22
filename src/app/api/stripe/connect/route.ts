import { NextRequest } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { supabaseService } from "@/lib/supabaseClient";
import { getStripeServer } from "@/lib/stripe";
import { encryptSessionState } from "@/lib/sessionUtils";

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

    // Validate environment variables
    if (!process.env.STRIPE_CLIENT_ID) {
      return new Response(JSON.stringify({ error: "Stripe configuration error" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (!process.env.STRIPE_REDIRECT_URI) {
      return new Response(JSON.stringify({ error: "Stripe configuration error" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Get user's current session to extract refresh token
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.refresh_token) {
      return new Response(JSON.stringify({ error: "No active session found" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Create encrypted state with user info and refresh token
    const sessionState = {
      userId: user.id,
      refreshToken: session.refresh_token,
      timestamp: Date.now(),
    };

    const encryptedState = encryptSessionState(sessionState);

    // Create OAuth URL for stripe connect
    try {
      const baseUrl = "https://connect.stripe.com/oauth/v2/authorize";
      const params = new URLSearchParams({
        response_type: "code",
        scope: "read_write",
        client_id: process.env.STRIPE_CLIENT_ID,
        redirect_uri: process.env.STRIPE_REDIRECT_URI,
        state: encryptedState,
      });
      
      const oauthUrl = `${baseUrl}?${params.toString()}`;

      return new Response(JSON.stringify({ oauthUrl }), {
        status: 200,
        headers: { "content-type": "application/json" },
      });
    } catch (oauthError) {
      return new Response(JSON.stringify({ 
        error: "Failed to generate OAuth URL",
        details: oauthError instanceof Error ? oauthError.message : "Unknown error"
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  } catch (error) {
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
}
