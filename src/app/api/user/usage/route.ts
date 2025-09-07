import { NextRequest } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { supabaseService } from "@/lib/supabaseClient";

export async function GET(req: NextRequest) {
  try {
    // Get authenticated user
    const supabase = await supabaseServer();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "content-type": "application/json" },
      });
    }

    // Get or create user usage
    const svc = supabaseService();
    let { data: usage, error } = await svc
      .from('user_usage')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error && error.code === 'PGRST116') { // No rows returned
      // Create initial usage record
      const { data: newUsage, error: insertError } = await svc
        .from('user_usage')
        .insert({
          user_id: user.id,
          bank_accounts_connected: 0,
          subscriptions_detected: 0,
          alerts_created: 0,
          cancellation_requests: 0,
        })
        .select()
        .single();
      
      if (insertError) {
        console.error('Error creating usage record:', insertError);
        return new Response(JSON.stringify({ error: "Database error" }), {
          status: 500,
          headers: { "content-type": "application/json" },
        });
      }
      
      usage = newUsage;
    } else if (error) {
      console.error('Error fetching usage:', error);
      return new Response(JSON.stringify({ error: "Database error" }), {
        status: 500,
        headers: { "content-type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ usage }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  } catch (error: any) {
    console.error('Usage fetch error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { action, increment = 1 } = await req.json();
    
    // Get authenticated user
    const supabase = await supabaseServer();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "content-type": "application/json" },
      });
    }

    const svc = supabaseService();
    
    // Update usage based on action
    const updateField = {
      'bank_connected': 'bank_accounts_connected',
      'subscription_detected': 'subscriptions_detected',
      'alert_created': 'alerts_created',
      'cancellation_requested': 'cancellation_requests',
    }[action];

    if (!updateField) {
      return new Response(JSON.stringify({ error: "Invalid action" }), {
        status: 400,
        headers: { "content-type": "application/json" },
      });
    }

    // Increment the usage counter
    const { data, error } = await svc.rpc('increment_usage', {
      user_id_param: user.id,
      field_name: updateField,
      increment_by: increment
    });

    if (error) {
      console.error('Error updating usage:', error);
      return new Response(JSON.stringify({ error: "Database error" }), {
        status: 500,
        headers: { "content-type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  } catch (error: any) {
    console.error('Usage update error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
}
