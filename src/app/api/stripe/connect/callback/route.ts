import { NextRequest } from "next/server";
import { getStripeServer } from "@/lib/stripe";
import { supabaseService } from "@/lib/supabaseClient";
import { supabaseServer } from "@/lib/supabaseServer";
import { decryptSessionState } from "@/lib/sessionUtils";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const error = searchParams.get("error");

    if (error) {
      return new Response(null, {
        status: 302,
        headers: { 
          Location: "/dashboard?stripe_error=true",
          "Cache-Control": "no-cache, no-store, must-revalidate",
          "Pragma": "no-cache",
          "Expires": "0"
        },
      });
    }

    if (!code || !state) {
      return new Response(null, {
        status: 302,
        headers: { 
          Location: "/dashboard?stripe_error=missing_params",
          "Cache-Control": "no-cache, no-store, must-revalidate",
          "Pragma": "no-cache",
          "Expires": "0"
        },
      });
    }

    // Decrypt the state parameter to get user info and refresh token
    const sessionState = decryptSessionState(state);
    if (!sessionState) {
      return new Response(null, {
        status: 302,
        headers: { 
          Location: "/auth/signin?error=invalid_state&message=Invalid session state. Please sign in again.",
          "Cache-Control": "no-cache, no-store, must-revalidate",
          "Pragma": "no-cache",
          "Expires": "0"
        },
      });
    }

    // Try to restore the user session using the refresh token
    const supabase = await supabaseServer();
    const userId = sessionState.userId;
    let isSessionValid = false;

    try {
      // Attempt to restore session using refresh token
      const { data: { session }, error: sessionError } = await supabase.auth.setSession({
        access_token: '', // We don't have this, but Supabase will use refresh_token
        refresh_token: sessionState.refreshToken,
      });

      if (session && !sessionError) {
        isSessionValid = true;
      }
    } catch {
      // Session restoration failed, but we can still proceed with the user ID
    }

    const stripe = getStripeServer();

    // Exchange code for access token
    const responseToken = await stripe.oauth.token({
      grant_type: "authorization_code",
      code: code,
    });

    const connectedAccountId = responseToken.stripe_user_id;
    const accessToken = responseToken.access_token;

    // Store connected account in the database (upsert on stripe_account_id)
    const svc = supabaseService();
    const { error: dbError } = await svc
      .from("stripe_connect_accounts")
      .upsert(
        {
          user_id: userId,
          stripe_account_id: connectedAccountId,
          access_token: accessToken,
          account_type: "oauth",
          connected_at: new Date().toISOString(),
        },
        { onConflict: "stripe_account_id" }
      );

    if (dbError) {
      return new Response(null, {
        status: 302,
        headers: { 
          Location: "/dashboard?stripe_error=database_error",
          "Cache-Control": "no-cache, no-store, must-revalidate",
          "Pragma": "no-cache",
          "Expires": "0"
        },
      });
    }
    
    // Redirect to success page
    const redirectUrl = `/stripe/success?connected=true&user_id=${userId}&session_restored=${isSessionValid}`;
    
    return new Response(null, {
      status: 302,
      headers: { 
        Location: redirectUrl,
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Pragma": "no-cache",
        "Expires": "0",
        "X-Stripe-Connected": "true",
        "X-User-ID": userId || "unknown"
      },
    });
  } catch {
    return new Response(null, {
      status: 302,
      headers: { 
        Location: "/dashboard?stripe_error=callback_failed",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Pragma": "no-cache",
        "Expires": "0"
      },
    });
  }
}
