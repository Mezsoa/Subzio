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

    // Fetch user's alerts
    const { data: alerts, error } = await supabase
      .from('alerts')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching alerts:', error);
      return NextResponse.json({ error: 'Failed to fetch alerts' }, { status: 500 });
    }

    return NextResponse.json({ alerts: alerts || [] });
  } catch (error) {
    console.error('Unexpected error in alerts GET:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await supabaseServer();
    
    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, type, condition, enabled } = body;

    // Validate required fields
    if (!name || !type || !condition) {
      return NextResponse.json(
        { error: 'Missing required fields: name, type, condition' },
        { status: 400 }
      );
    }

    // Check user's subscription plan to enforce limits
    const { data: subscription } = await supabase
      .from('subscriptions')
      .select('plan_id')
      .eq('user_id', user.id)
      .single();

    const planId = subscription?.plan_id || 'free';

    // Free users can only have 1 alert
    if (planId === 'free') {
      const { count } = await supabase
        .from('alerts')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id);

      if (count && count >= 1) {
        return NextResponse.json(
          { error: 'Free plan allows only 1 alert. Upgrade to Pro for unlimited alerts.' },
          { status: 403 }
        );
      }
    }

    // Create the alert
    const { data: newAlert, error } = await supabase
      .from('alerts')
      .insert({
        user_id: user.id,
        name,
        type,
        condition,
        enabled: enabled ?? true,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating alert:', error);
      return NextResponse.json({ error: 'Failed to create alert' }, { status: 500 });
    }

    return NextResponse.json(newAlert, { status: 201 });
  } catch (error) {
    console.error('Unexpected error in alerts POST:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
