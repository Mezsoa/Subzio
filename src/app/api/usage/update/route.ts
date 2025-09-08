import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';

export async function POST(request: NextRequest) {
  try {
    const supabase = await supabaseServer();
    
    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { feature, increment = 1 } = body;

    if (!feature) {
      return NextResponse.json({ error: 'Feature is required' }, { status: 400 });
    }

    // Map feature names to database columns
    const featureColumnMap: Record<string, string> = {
      bankAccountsConnected: 'bank_accounts_connected',
      subscriptionsDetected: 'subscriptions_detected',
      alertsCreated: 'alerts_created',
      cancellationRequests: 'cancellation_requests'
    };

    const columnName = featureColumnMap[feature];
    if (!columnName) {
      return NextResponse.json({ error: 'Invalid feature' }, { status: 400 });
    }

    // Get current usage
    const { data: currentUsage, error: fetchError } = await supabase
      .from('user_usage')
      .select(columnName)
      .eq('user_id', user.id)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error fetching current usage:', fetchError);
      return NextResponse.json({ error: 'Failed to fetch current usage' }, { status: 500 });
    }

    const currentValue = (currentUsage as any)?.[columnName] || 0;
    const newValue = currentValue + increment;

    // Update usage
    const { error: updateError } = await supabase
      .from('user_usage')
      .upsert({
        user_id: user.id,
        [columnName]: newValue,
        updated_at: new Date().toISOString(),
        last_reset_date: new Date().toISOString().split('T')[0]
      }, {
        onConflict: 'user_id'
      });

    if (updateError) {
      console.error('Error updating usage:', updateError);
      return NextResponse.json({ error: 'Failed to update usage' }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      newValue,
      feature,
      increment 
    });
  } catch (error) {
    console.error('Unexpected error in usage update:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
