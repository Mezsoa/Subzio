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
    
    // First, check if this Stripe account is already connected to another user
    const { data: existingAccount, error: checkError } = await svc
      .from("stripe_connect_accounts")
      .select("user_id")
      .eq("stripe_account_id", connectedAccountId)
      .single();

    if (checkError && checkError.code !== 'PGRST116') { // PGRST116 = no rows found
      console.error("Error checking existing Stripe account:", checkError);
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

    // If account exists and belongs to a different user, show error
    if (existingAccount && existingAccount.user_id !== userId) {
      console.error("Stripe account already connected to another user:", existingAccount.user_id);
      return new Response(null, {
        status: 302,
        headers: { 
          Location: "/dashboard?stripe_error=account_already_connected",
          "Cache-Control": "no-cache, no-store, must-revalidate",
          "Pragma": "no-cache",
          "Expires": "0"
        },
      });
    }

    // Use upsert to handle both insert and update cases
    const { error: dbError } = await svc.from("stripe_connect_accounts").upsert({
      user_id: userId,
      stripe_account_id: connectedAccountId,
      access_token: accessToken,
      account_type: "oauth",
      connected_at: new Date().toISOString(),
    }, {
      onConflict: 'user_id,stripe_account_id'
    });

    if (dbError) {
      console.error("Database error storing Stripe account:", dbError);
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

    console.log("Stripe account stored successfully for user:", userId);
    
    // If session is not valid, we still want to show success but redirect to signin
    if (!isSessionValid) {
      console.log("Session expired but Stripe account connected successfully. User will need to sign in again.");
    }

    // Always redirect to success page first, then let the success page handle the redirect
    const redirectUrl = `/stripe/success?connected=true&user_id=${userId}`;
    
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
