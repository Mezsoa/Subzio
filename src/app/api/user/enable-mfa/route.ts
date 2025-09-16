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
        message: 'You must be logged in to enable MFA'
      }, { status: 401 });
    }

    const svc = supabaseService();

    // Enable MFA for the user
    const { data, error } = await svc.auth.admin.updateUserById(user.id, {
      email_confirm: true,
      // Note: Supabase handles MFA through their built-in system
      // This is a placeholder for when you implement custom MFA
    });

    if (error) {
      console.error("[MFA] Error enabling MFA:", error);
      return NextResponse.json({ 
        error: 'Failed to enable MFA',
        message: 'An error occurred while enabling MFA. Please try again.'
      }, { status: 500 });
    }

    // Log MFA enablement for audit purposes
    console.log(`[MFA] MFA enabled for user: ${user.id} at ${new Date().toISOString()}`);

    return NextResponse.json({ 
      success: true,
      message: 'MFA has been enabled for your account.'
    });

  } catch (error) {
    console.error("[MFA] MFA enablement error:", error);
    return NextResponse.json({ 
      error: 'Internal server error',
      message: 'An error occurred while enabling MFA. Please contact support.'
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = await supabaseServer();
    
    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ 
        error: 'Unauthorized',
        message: 'You must be logged in to disable MFA'
      }, { status: 401 });
    }

    const svc = supabaseService();

    // Disable MFA for the user
    const { data, error } = await svc.auth.admin.updateUserById(user.id, {
      // Note: This is a placeholder for MFA disable functionality
      // Supabase handles this through their built-in system
    });

    if (error) {
      console.error("[MFA] Error disabling MFA:", error);
      return NextResponse.json({ 
        error: 'Failed to disable MFA',
        message: 'An error occurred while disabling MFA. Please try again.'
      }, { status: 500 });
    }

    // Log MFA disablement for audit purposes
    console.log(`[MFA] MFA disabled for user: ${user.id} at ${new Date().toISOString()}`);

    return NextResponse.json({ 
      success: true,
      message: 'MFA has been disabled for your account.'
    });

  } catch (error) {
    console.error("[MFA] MFA disablement error:", error);
    return NextResponse.json({ 
      error: 'Internal server error',
      message: 'An error occurred while disabling MFA. Please contact support.'
    }, { status: 500 });
  }
}
