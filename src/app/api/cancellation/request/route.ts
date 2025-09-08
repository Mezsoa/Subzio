import { NextRequest } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { supabaseService } from "@/lib/supabaseClient";

export async function POST(req: NextRequest) {
  try {
    const {
      subscriptionName,
      subscriptionDetails,
      urgency = 'normal',
      notes
    } = await req.json();

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

    // Check if user has business plan or available cancellation credits
    const svc = supabaseService();
    const { data: subscription } = await svc
      .from('user_subscriptions')
      .select('plan_id')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single();

    if (!subscription || subscription.plan_id !== 'business') {
      return new Response(JSON.stringify({ 
        error: "Cancel-for-me service requires Business plan",
        upgradeRequired: true 
      }), {
        status: 403,
        headers: { "content-type": "application/json" },
      });
    }

    // Check usage limits for business plan
    const { data: usage } = await svc
      .from('user_usage')
      .select('cancellation_requests')
      .eq('user_id', user.id)
      .single();

    const currentMonth = new Date().getMonth();
    const monthlyLimit = 5; // Business plan gets 5 free cancellations per month
    
    if (usage && usage.cancellation_requests >= monthlyLimit) {
      return new Response(JSON.stringify({ 
        error: `Monthly limit of ${monthlyLimit} cancellation requests reached`,
        limitReached: true 
      }), {
        status: 403,
        headers: { "content-type": "application/json" },
      });
    }

    // Create cancellation request
    const { data: request, error } = await svc
      .from('cancellation_requests')
      .insert({
        user_id: user.id,
        subscription_name: subscriptionName,
        subscription_details: subscriptionDetails,
        status: 'pending',
        urgency,
        notes,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating cancellation request:', error);
      return new Response(JSON.stringify({ error: "Failed to create request" }), {
        status: 500,
        headers: { "content-type": "application/json" },
      });
    }

    // Update usage counter
    await svc.rpc('increment_usage', {
      user_id_param: user.id,
      field_name: 'cancellation_requests',
      increment_by: 1
    });

    // Send notification to admin/support team
    await sendCancellationNotification(request);

    return new Response(JSON.stringify({ 
      success: true, 
      requestId: request.id,
      estimatedCompletion: getEstimatedCompletion(urgency)
    }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  } catch (error: any) {
    console.error('Cancellation request error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
}

export async function GET(req: NextRequest) {
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

    // Get user's cancellation requests
    const svc = supabaseService();
    const { data: requests, error } = await svc
      .from('cancellation_requests')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching cancellation requests:', error);
      return new Response(JSON.stringify({ error: "Failed to fetch requests" }), {
        status: 500,
        headers: { "content-type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ requests: requests || [] }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  } catch (error: any) {
    console.error('Cancellation request fetch error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
}

async function sendCancellationNotification(request: any) {
  try {
    // In a real implementation, you would:
    // 1. Send email to support team
    // 2. Create ticket in support system
    // 3. Send Slack notification
    // 4. Update CRM
    
    console.log('New cancellation request:', {
      id: request.id,
      user_id: request.user_id,
      subscription: request.subscription_name,
      urgency: request.urgency,
    });

    // For now, just log it
    // TODO: Implement actual notification system
  } catch (error) {
    console.error('Error sending cancellation notification:', error);
  }
}

function getEstimatedCompletion(urgency: string): string {
  const now = new Date();
  let hours = 24; // Default 24 hours
  
  switch (urgency) {
    case 'urgent':
      hours = 4;
      break;
    case 'high':
      hours = 8;
      break;
    case 'normal':
      hours = 24;
      break;
    case 'low':
      hours = 48;
      break;
  }
  
  const completion = new Date(now.getTime() + hours * 60 * 60 * 1000);
  return completion.toISOString();
}
