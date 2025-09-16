import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { supabaseService } from "@/lib/supabaseClient";

export async function POST(request: NextRequest) {
  try {
    const supabase = await supabaseServer();
    
    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ 
        error: 'Unauthorized',
        message: 'You must be logged in to export your data'
      }, { status: 401 });
    }

    const userId = user.id;
    const svc = supabaseService();

    // Collect all user data
    const userData: any = {
      export_date: new Date().toISOString(),
      user_id: userId,
      user_email: user.email,
      user_created_at: user.created_at,
      data: {}
    };

    // Get user profile data
    try {
      const { data: profile } = await svc.auth.admin.getUserById(userId);
      userData.data.profile = {
        email: profile?.user?.email,
        created_at: profile?.user?.created_at,
        last_sign_in_at: profile?.user?.last_sign_in_at,
        email_confirmed_at: profile?.user?.email_confirmed_at
      };
    } catch (e) {
      console.error("[GDPR] Error fetching profile:", e);
    }

    // Get bank accounts
    try {
      const { data: bankAccounts } = await svc
        .from("bank_accounts")
        .select("*")
        .eq("user_id", userId);
      userData.data.bank_accounts = bankAccounts || [];
    } catch (e) {
      console.error("[GDPR] Error fetching bank accounts:", e);
    }

    // Get subscriptions
    try {
      const { data: subscriptions } = await svc
        .from("subscriptions")
        .select("*")
        .eq("user_id", userId);
      userData.data.subscriptions = subscriptions || [];
    } catch (e) {
      console.error("[GDPR] Error fetching subscriptions:", e);
    }

    // Get alerts
    try {
      const { data: alerts } = await svc
        .from("alerts")
        .select("*")
        .eq("user_id", userId);
      userData.data.alerts = alerts || [];
    } catch (e) {
      console.error("[GDPR] Error fetching alerts:", e);
    }

    // Get cancellation requests
    try {
      const { data: cancellationRequests } = await svc
        .from("cancellation_requests")
        .select("*")
        .eq("user_id", userId);
      userData.data.cancellation_requests = cancellationRequests || [];
    } catch (e) {
      console.error("[GDPR] Error fetching cancellation requests:", e);
    }

    // Get usage data
    try {
      const { data: usage } = await svc
        .from("user_usage")
        .select("*")
        .eq("user_id", userId);
      userData.data.usage = usage || [];
    } catch (e) {
      console.error("[GDPR] Error fetching usage:", e);
    }

    // Get subscription billing data
    try {
      const { data: userSubscriptions } = await svc
        .from("user_subscriptions")
        .select("*")
        .eq("user_id", userId);
      userData.data.user_subscriptions = userSubscriptions || [];
    } catch (e) {
      console.error("[GDPR] Error fetching user subscriptions:", e);
    }

    // Note: We don't export sensitive tokens (Plaid/BankID access tokens)
    // as these are not useful to the user and pose security risks

    // Log the export for audit purposes
    console.log(`[GDPR] Data export completed for user: ${userId} at ${new Date().toISOString()}`);

    return NextResponse.json({ 
      success: true,
      data: userData,
      message: 'Your data has been exported successfully. This export contains all your personal data stored in our system.'
    });

  } catch (error) {
    console.error("[GDPR] Data export error:", error);
    return NextResponse.json({ 
      error: 'Internal server error',
      message: 'An error occurred while exporting your data. Please contact support.'
    }, { status: 500 });
  }
}
