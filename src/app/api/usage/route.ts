import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';
import { getAuthenticatedUser } from '@/lib/authUtils';

export async function GET(request: NextRequest) {
  try {
    const { user, error: authError } = await getAuthenticatedUser(request);
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = await supabaseServer();

    // Get user's current usage stats
    const { data: usage, error } = await supabase
      .from('user_usage')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116 = no rows found
      console.error('Error fetching usage stats:', error);
      return NextResponse.json({ error: 'Failed to fetch usage stats' }, { status: 500 });
    }

    // If no usage record exists, create one with default values
    if (!usage) {
      const { data: newUsage, error: insertError } = await supabase
        .from('user_usage')
        .insert({
          user_id: user.id,
          bank_accounts_connected: 0,
          subscriptions_detected: 0,
          alerts_created: 0,
          cancellation_requests: 0,
          last_reset_date: new Date().toISOString().split('T')[0]
        })
        .select()
        .single();

      if (insertError) {
        console.error('Error creating usage record:', insertError);
        return NextResponse.json({ error: 'Failed to create usage record' }, { status: 500 });
      }

      return NextResponse.json({
        usage: {
          bankAccountsConnected: newUsage.bank_accounts_connected,
          subscriptionsDetected: newUsage.subscriptions_detected,
          alertsCreated: newUsage.alerts_created,
          cancellationRequests: newUsage.cancellation_requests,
          dataExports: 0
        }
      });
    }

    // Check if we need to reset monthly counters
    const lastReset = new Date(usage.last_reset_date);
    const now = new Date();
    const shouldReset = lastReset.getMonth() !== now.getMonth() || lastReset.getFullYear() !== now.getFullYear();

    if (shouldReset) {
      // Reset monthly counters
      const { data: resetUsage, error: resetError } = await supabase
        .from('user_usage')
        .update({
          alerts_created: 0,
          cancellation_requests: 0,
          last_reset_date: now.toISOString().split('T')[0],
          updated_at: now.toISOString()
        })
        .eq('user_id', user.id)
        .select()
        .single();

      if (resetError) {
        console.error('Error resetting usage counters:', resetError);
        return NextResponse.json({ error: 'Failed to reset usage counters' }, { status: 500 });
      }

      return NextResponse.json({
        usage: {
          bankAccountsConnected: resetUsage.bank_accounts_connected,
          subscriptionsDetected: resetUsage.subscriptions_detected,
          alertsCreated: resetUsage.alerts_created,
          cancellationRequests: resetUsage.cancellation_requests,
          dataExports: 0 // This would come from a separate table in real implementation
        }
      });
    }

    return NextResponse.json({
      usage: {
        bankAccountsConnected: usage.bank_accounts_connected,
        subscriptionsDetected: usage.subscriptions_detected,
        alertsCreated: usage.alerts_created,
        cancellationRequests: usage.cancellation_requests,
        dataExports: 0 // This would come from a separate table in real implementation
      }
    });
  } catch (error) {
    console.error('Unexpected error in usage GET:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
