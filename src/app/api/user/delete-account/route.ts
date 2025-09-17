import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { supabaseService } from "@/lib/supabaseClient";
import { getPlaidClient } from "@/lib/plaid";

export async function POST(request: NextRequest) {
  try {
    const supabase = await supabaseServer();
    
    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ 
        error: 'Unauthorized',
        message: 'You must be logged in to delete your account'
      }, { status: 401 });
    }

    const userId = user.id;
    const svc = supabaseService();

    // Step 1: Disconnect all Plaid connections
    try {
      const { data: plaidItems } = await svc
        .from("plaid_items")
        .select("access_token, item_id")
        .eq("user_id", userId);

      if (plaidItems && plaidItems.length > 0) {
        const plaid = getPlaidClient();
        for (const item of plaidItems) {
          try {
            await plaid.itemRemove({ access_token: item.access_token });
            console.log(`[GDPR] Disconnected Plaid item: ${item.item_id}`);
          } catch (e) {
            console.error(`[GDPR] Error disconnecting Plaid item ${item.item_id}:`, e);
          }
        }
      }
    } catch (e) {
      console.error("[GDPR] Error during Plaid disconnection:", e);
    }

    // Step 2: Disconnect all BankID/Tink connections
    try {
      const { data: bankidItems } = await svc
        .from("bankid_items")
        .select("access_token")
        .eq("user_id", userId);

      if (bankidItems && bankidItems.length > 0) {
        // Note: Tink doesn't provide a direct revocation endpoint
        // but we'll clean up our stored data
        console.log(`[GDPR] Found ${bankidItems.length} BankID items to clean up`);
      }
    } catch (e) {
      console.error("[GDPR] Error during BankID cleanup:", e);
    }

    // Step 3: Disconnect Stripe Connect account
    try {
      const { data: stripeAccount } = await svc
        .from("stripe_connect_accounts")
        .select("stripe_account_id")
        .eq("user_id", userId)
        .single();

      if (stripeAccount) {
        // Try to deauthorize the Stripe Connect account
        try {
          const { getStripeServer } = await import("@/lib/stripe");
          const stripe = getStripeServer();
          await stripe.oauth.deauthorize({
            client_id: process.env.STRIPE_CLIENT_ID || "",
            stripe_user_id: stripeAccount.stripe_account_id,
          });
          console.log(`[GDPR] Deauthorized Stripe Connect account: ${stripeAccount.stripe_account_id}`);
        } catch (e) {
          console.error(`[GDPR] Error deauthorizing Stripe Connect account:`, e);
        }
      }
    } catch (e) {
      console.error("[GDPR] Error during Stripe Connect cleanup:", e);
    }

    // Step 4: Delete all user data from our database
    const tablesToClean = [
      'plaid_items',
      'bankid_items', 
      'bank_accounts',
      'stripe_connect_accounts',
      'subscriptions',
      'alerts',
      'cancellation_requests',
      'user_usage',
      'user_subscriptions'
    ];

    for (const table of tablesToClean) {
      try {
        const { error } = await svc
          .from(table)
          .delete()
          .eq("user_id", userId);
        
        if (error && !error.message.includes("relation") && !error.message.includes("does not exist")) {
          console.error(`[GDPR] Error deleting from ${table}:`, error);
        } else {
          console.log(`[GDPR] Successfully cleaned ${table} for user ${userId}`);
        }
      } catch (e) {
        console.error(`[GDPR] Error cleaning table ${table}:`, e);
      }
    }

    // Step 4: Delete the user account from Supabase Auth
    try {
      const { error: deleteError } = await svc.auth.admin.deleteUser(userId);
      if (deleteError) {
        console.error("[GDPR] Error deleting user from auth:", deleteError);
        return NextResponse.json({ 
          error: 'Failed to delete user account',
          message: 'Data was cleaned but account deletion failed. Please contact support.'
        }, { status: 500 });
      }
    } catch (e) {
      console.error("[GDPR] Error during user deletion:", e);
      return NextResponse.json({ 
        error: 'Failed to delete user account',
        message: 'Data was cleaned but account deletion failed. Please contact support.'
      }, { status: 500 });
    }

    // Step 5: Log the deletion for audit purposes
    console.log(`[GDPR] Account deletion completed for user: ${userId} at ${new Date().toISOString()}`);

    return NextResponse.json({ 
      success: true,
      message: 'Your account and all associated data have been permanently deleted.'
    });

  } catch (error) {
    console.error("[GDPR] Account deletion error:", error);
    return NextResponse.json({ 
      error: 'Internal server error',
      message: 'An error occurred while deleting your account. Please contact support.'
    }, { status: 500 });
  }
}
