import { NextRequest } from "next/server";
import { getStripeServer } from "@/lib/stripe";
import { supabaseService } from "@/lib/supabaseClient";
import { supabaseServer } from "@/lib/supabaseServer";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const error = searchParams.get("error");

    // Check if user is still authenticated
    const supabase = await supabaseServer();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    let userId = user?.id;
    let isSessionValid = !!user;
    
    if (authError || !user) {
      console.error("User not authenticated during Stripe callback:", authError);
      console.log("Available state parameter:", state);
      console.log("Request headers:", Object.fromEntries(req.headers.entries()));
      
      // Try to get user from state parameter as fallback
      if (state) {
        console.log("Using state parameter as fallback for user ID:", state);
        userId = state;
        isSessionValid = false; // Mark as session expired
        console.warn("Using state parameter as fallback for user ID - session may have expired");
        
        // Try to refresh the session using the state parameter
        try {
          const { data: { user: refreshedUser } } = await supabase.auth.getUser();
          if (refreshedUser && refreshedUser.id === state) {
            console.log("Session refreshed successfully:", refreshedUser.id);
            userId = refreshedUser.id;
            isSessionValid = true;
          }
        } catch (refreshError) {
          console.error("Failed to refresh session:", refreshError);
        }
      } else {
        console.error("No user ID available from session or state parameter");
        return new Response(null, {
          status: 302,
          headers: { 
            Location: "/auth/signin?error=session_expired&message=Your session expired during Stripe connection. Please sign in again.",
            "Cache-Control": "no-cache, no-store, must-revalidate",
            "Pragma": "no-cache",
            "Expires": "0"
          },
        });
      }
    } else {
      console.log("User authenticated successfully:", user.id);
    }

    if (error) {
      console.error("Stripe OAuth error:", error);
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
    
    console.log("🔥 CALLBACK: Attempting to store Stripe account for user:", userId);
    console.log("🔥 CALLBACK: Stripe account ID:", connectedAccountId);
    
    // Try to insert the Stripe account
    const { error: dbError } = await svc.from("stripe_connect_accounts").insert({
      user_id: userId,
      stripe_account_id: connectedAccountId,
      access_token: accessToken,
      account_type: "oauth",
      connected_at: new Date().toISOString(),
    });

    if (dbError) {
      console.error("🔥 CALLBACK: Database error storing Stripe account:", dbError);
      console.error("🔥 CALLBACK: Error code:", dbError.code);
      console.error("🔥 CALLBACK: Error message:", dbError.message);
      console.error("🔥 CALLBACK: Error details:", dbError.details);
      console.error("🔥 CALLBACK: Error hint:", dbError.hint);
      
      // If it's a duplicate key error, that's actually OK - account already exists
      if (dbError.code === '23505') { // Unique constraint violation
        console.log("🔥 CALLBACK: Stripe account already exists, continuing...");
      } else {
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
    }

    console.log("Stripe account stored successfully for user:", userId);
    
    // Always redirect to success page - let the dashboard handle session validation
    const redirectUrl = `/stripe/success?connected=true&user_id=${userId}`;
    
    if (!isSessionValid) {
      console.log("Session expired during OAuth flow, but Stripe account connected successfully.");
      console.log("User will be redirected to signin after success page.");
    }
    
    console.log("🔥🔥🔥 STRIPE CALLBACK HIT! 🔥🔥🔥");
    console.log("🔥 CALLBACK: Redirecting to:", redirectUrl);
    console.log("🔥 CALLBACK: This should go to success page, NOT dashboard!");
    console.log("🔥🔥🔥 END STRIPE CALLBACK 🔥🔥🔥");
    console.log("Session valid:", isSessionValid, "User ID:", userId);
    console.log("Stripe account connected:", connectedAccountId);
    
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
  } catch (error) {
    console.error("Stripe OAuth callback error:", error);
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
