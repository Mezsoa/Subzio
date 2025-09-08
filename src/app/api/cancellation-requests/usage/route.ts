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

    // Check if user has Business plan
    const { data: subscription } = await supabase
      .from('user_subscriptions')
      .select('plan_id')
      .eq('user_id', user.id)
      .single();

    const planId = subscription?.plan_id || 'free';
    
    if (planId !== 'business') {
      return NextResponse.json(
        { error: 'Cancel-for-Me service requires Business plan' },
        { status: 403 }
      );
    }

    // Get current month usage
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const { count } = await supabase
      .from('cancellation_requests')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .gte('created_at', startOfMonth.toISOString());

    return NextResponse.json({ 
      monthly_usage: count || 0,
      monthly_limit: 5,
      remaining: Math.max(0, 5 - (count || 0))
    });
  } catch (error) {
    console.error('Unexpected error in usage GET:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
