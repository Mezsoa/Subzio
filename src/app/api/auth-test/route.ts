import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';

export async function GET(request: NextRequest) {
  try {
    const supabase = await supabaseServer();
    
    // Debug: Log cookies
    const cookies = request.headers.get('cookie');
    console.log('🔍 GET /api/auth-test - Cookies received:', cookies ? 'Yes' : 'No');
    console.log('🔍 Cookie details:', cookies);
    
    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    // Debug: Log auth details
    console.log('🔍 Auth error:', authError);
    console.log('🔍 User found:', user ? `Yes (${user.id})` : 'No');
    
    return NextResponse.json({
      authenticated: !!user,
      user: user ? {
        id: user.id,
        email: user.email,
        created_at: user.created_at
      } : null,
      authError: authError?.message || null,
      hasCookies: !!cookies,
      cookieCount: cookies ? cookies.split(';').length : 0
    });
  } catch (error) {
    console.error('Unexpected error in auth-test:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
