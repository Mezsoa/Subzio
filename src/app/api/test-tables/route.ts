import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';

export async function GET(request: NextRequest) {
  try {
    const supabase = await supabaseServer();
    
    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Test if alerts table exists by trying to query it
    const { data: alerts, error: alertsError } = await supabase
      .from('alerts')
      .select('count')
      .limit(1);

    // Test other tables
    const { data: subscriptions, error: subsError } = await supabase
      .from('detected_subscriptions')
      .select('count')
      .limit(1);

    const { data: accounts, error: accountsError } = await supabase
      .from('bank_accounts')
      .select('count')
      .limit(1);

    return NextResponse.json({
      user: { id: user.id, email: user.email },
      tables: {
        alerts: {
          exists: !alertsError,
          error: alertsError?.message
        },
        detected_subscriptions: {
          exists: !subsError,
          error: subsError?.message
        },
        bank_accounts: {
          exists: !accountsError,
          error: accountsError?.message
        }
      }
    });
  } catch (error) {
    console.error('Unexpected error in test-tables:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
