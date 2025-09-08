import { NextRequest } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { supabaseService } from "@/lib/supabaseClient";

export async function POST(req: NextRequest) {
  try {
    // Get authenticated user from authorization header
    const authorization = req.headers.get('authorization');
    if (!authorization?.startsWith('Bearer ')) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "content-type": "application/json" },
      });
    }

    const token = authorization.split(' ')[1];
    const supabase = await supabaseServer();
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "content-type": "application/json" },
      });
    }

    const { planId } = await req.json();
    
    // Simulate what the webhook should do
    const svc = supabaseService();
    const subscriptionData = {
      user_id: user.id,
      stripe_customer_id: 'test_customer_123',
      stripe_subscription_id: 'test_sub_123',
      plan_id: planId,
      status: 'trialing',
      current_period_start: new Date().toISOString(),
      current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      trial_end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
    };
    
    console.log('🧪 Test: Creating subscription:', subscriptionData);
    
    const { data, error } = await svc.from('user_subscriptions').upsert(subscriptionData);
    
    if (error) {
      console.error('❌ Test: Database error:', error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { "content-type": "application/json" },
      });
    }
    
    console.log('✅ Test: Subscription created:', data);
    
    return new Response(JSON.stringify({ 
      success: true, 
      subscription: subscriptionData,
      message: 'Test subscription created successfully'
    }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  } catch (error: any) {
    console.error('❌ Test subscription error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
}
