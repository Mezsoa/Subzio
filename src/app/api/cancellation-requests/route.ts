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

    // Fetch user's cancellation requests
    const { data: requests, error } = await supabase
      .from('cancellation_requests')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching cancellation requests:', error);
      return NextResponse.json({ error: 'Failed to fetch requests' }, { status: 500 });
    }

    return NextResponse.json({ requests: requests || [] });
  } catch (error) {
    console.error('Unexpected error in cancellation requests GET:', error);
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

    const body = await request.json();
    const { subscription_name, subscription_details, priority } = body;

    // Validate required fields
    if (!subscription_name || !subscription_details) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check monthly usage limit (5 free cancellations per month for Business plan)
    const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const { count } = await supabase
      .from('cancellation_requests')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .gte('created_at', startOfMonth.toISOString());

    if (count && count >= 5) {
      return NextResponse.json(
        { error: 'Monthly limit of 5 free cancellations reached. Additional requests will incur a $15 fee.' },
        { status: 403 }
      );
    }

    // Calculate estimated completion time
    const estimatedCompletion = new Date();
    if (priority === 'urgent') {
      estimatedCompletion.setHours(estimatedCompletion.getHours() + 8); // Same day
    } else {
      estimatedCompletion.setDate(estimatedCompletion.getDate() + 2); // 2 days for normal
    }

    // Create the cancellation request
    const { data: newRequest, error } = await supabase
      .from('cancellation_requests')
      .insert({
        user_id: user.id,
        subscription_name,
        subscription_details,
        status: 'pending',
        priority: priority || 'normal',
        estimated_completion: estimatedCompletion.toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating cancellation request:', error);
      return NextResponse.json({ error: 'Failed to create request' }, { status: 500 });
    }

    // Update user usage tracking
    await supabase
      .from('user_usage')
      .upsert({
        user_id: user.id,
        cancellation_requests: (count || 0) + 1,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'user_id'
      });

    return NextResponse.json(newRequest, { status: 201 });
  } catch (error) {
    console.error('Unexpected error in cancellation requests POST:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
