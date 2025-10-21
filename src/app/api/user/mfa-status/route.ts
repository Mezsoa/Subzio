import { NextRequest, NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { supabaseService } from "@/lib/supabaseClient";

export async function GET(request: NextRequest) {
  try {
    const supabase = await supabaseServer();
    
    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ 
        error: 'Unauthorized',
        message: 'You must be logged in to check MFA status'
      }, { status: 401 });
    }

    const svc = supabaseService();

    // Check if user has MFA factors enrolled
    const { data: factors, error: factorsError } = await svc.auth.mfa.listFactors();
    
    if (factorsError) {
      console.error("[MFA] Error fetching MFA factors:", factorsError);
      return NextResponse.json({ 
        error: 'Failed to fetch MFA status',
        message: 'An error occurred while checking MFA status.'
      }, { status: 500 });
    }

    // Check if user has any TOTP factors enrolled
    const hasTotpFactors = factors.totp && factors.totp.length > 0;
    
    return NextResponse.json({ 
      enabled: hasTotpFactors,
      factors: factors.totp || [],
      message: hasTotpFactors ? 'MFA is enabled' : 'MFA is not enabled'
    });

  } catch (error) {
    console.error("[MFA] MFA status check error:", error);
    return NextResponse.json({ 
      error: 'Internal server error',
      message: 'An error occurred while checking MFA status. Please contact support.'
    }, { status: 500 });
  }
}
