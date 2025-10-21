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

    // Generate MFA secret and QR code for TOTP setup
    const { data: mfaData, error: mfaError } = await svc.auth.mfa.enroll({
      factorType: 'totp'
    });

    if (mfaError) {
      console.error("[MFA] Error generating MFA secret:", mfaError);
      return NextResponse.json({ 
        error: 'Failed to generate MFA secret',
        message: 'An error occurred while setting up MFA. Please try again.'
      }, { status: 500 });
    }

    // Log MFA setup initiation for audit purposes
    console.log(`[MFA] MFA setup initiated for user: ${user.id} at ${new Date().toISOString()}`);

    return NextResponse.json({ 
      success: true,
      message: 'MFA setup initiated. Please scan the QR code with your authenticator app.',
      qrCode: mfaData.totp?.qr_code,
      secret: mfaData.totp?.secret,
      factorId: mfaData.id
    });

  } catch (error) {
    console.error("[MFA] MFA setup error:", error);
    return NextResponse.json({ 
      error: 'Internal server error',
      message: 'An error occurred while setting up MFA. Please contact support.'
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = await supabaseServer();
    
    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ 
        error: 'Unauthorized',
        message: 'You must be logged in to verify MFA'
      }, { status: 401 });
    }

    const { code, factorId } = await request.json();
    
    if (!code || !factorId) {
      return NextResponse.json({ 
        error: 'Missing verification code or factor ID',
        message: 'Please provide the verification code and factor ID from your authenticator app.'
      }, { status: 400 });
    }

    const svc = supabaseService();

    // Verify the MFA code
    const { data, error } = await svc.auth.mfa.verify({
      factorId: factorId,
      code: code,
      challengeId: factorId // Using factorId as challengeId for simplicity
    });

    if (error) {
      console.error("[MFA] Error verifying MFA code:", error);
      return NextResponse.json({ 
        error: 'Invalid verification code',
        message: 'The verification code is invalid. Please try again.'
      }, { status: 400 });
    }

    // Log MFA verification for audit purposes
    console.log(`[MFA] MFA verified for user: ${user.id} at ${new Date().toISOString()}`);

    return NextResponse.json({ 
      success: true,
      message: 'MFA has been successfully enabled for your account.'
    });

  } catch (error) {
    console.error("[MFA] MFA verification error:", error);
    return NextResponse.json({ 
      error: 'Internal server error',
      message: 'An error occurred while verifying MFA. Please contact support.'
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

    // Get user's MFA factors and unenroll them
    const { data: factors, error: factorsError } = await svc.auth.mfa.listFactors();
    
    if (factorsError) {
      console.error("[MFA] Error fetching MFA factors:", factorsError);
      return NextResponse.json({ 
        error: 'Failed to fetch MFA factors',
        message: 'An error occurred while disabling MFA. Please try again.'
      }, { status: 500 });
    }

    // Unenroll all TOTP factors
    for (const factor of factors.totp || []) {
      try {
        await svc.auth.mfa.unenroll({ factorId: factor.id });
      } catch (unenrollError) {
        console.error("[MFA] Error unenrolling factor:", unenrollError);
      }
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
