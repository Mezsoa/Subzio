import { NextRequest } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { supabaseService } from "@/lib/supabaseClient";

export async function GET(req: NextRequest) {
  try {
    // Only allow admin users to access analytics dashboard
    const supabase = await supabaseServer();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "content-type": "application/json" },
      });
    }

    // Check if user is admin (you can implement your own admin check)
    const isAdmin = user.email === 'johnmessoa@gmail.com'; // Replace with your admin logic
    
    if (!isAdmin) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { "content-type": "application/json" },
      });
    }

    const svc = supabaseService();
    
    // Get analytics data for the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    // User metrics
    const { data: userStats } = await svc.rpc('get_user_stats');
    
    // Event metrics
    const { data: eventStats } = await svc
      .from('analytics_events')
      .select('event_name, timestamp')
      .gte('timestamp', thirtyDaysAgo.toISOString())
      .order('timestamp', { ascending: false });

    // Conversion metrics
    const { data: conversionStats } = await svc
      .from('conversions')
      .select('*')
      .gte('timestamp', thirtyDaysAgo.toISOString());

    // Subscription metrics
    const { data: subscriptionStats } = await svc
      .from('user_subscriptions')
      .select('plan_id, status, created_at')
      .gte('created_at', thirtyDaysAgo.toISOString());

    // Process the data
    const analytics = {
      overview: {
        totalUsers: userStats?.total_users || 0,
        activeUsers: userStats?.active_users || 0,
        paidUsers: subscriptionStats?.filter((s: any) => s.status === 'active' && s.plan_id !== 'free').length || 0,
        totalRevenue: subscriptionStats?.reduce((sum: number, s: any) => {
          if (s.status === 'active' && s.plan_id === 'pro') return sum + 9.99;
          if (s.status === 'active' && s.plan_id === 'business') return sum + 19.99;
          return sum;
        }, 0) || 0,
      },
      
      events: processEventStats(eventStats || []),
      conversions: processConversionStats(conversionStats || []),
      subscriptions: processSubscriptionStats(subscriptionStats || []),
      
      funnel: calculateFunnelMetrics(eventStats || []),
    };

    return new Response(JSON.stringify({ analytics }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  } catch (error: any) {
    console.error('Analytics dashboard error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
}

function processEventStats(events: any[]) {
  const eventCounts: Record<string, number> = {};
  const dailyEvents: Record<string, number> = {};
  
  events.forEach(event => {
    // Count by event type
    eventCounts[event.event_name] = (eventCounts[event.event_name] || 0) + 1;
    
    // Count by day
    const day = event.timestamp.split('T')[0];
    dailyEvents[day] = (dailyEvents[day] || 0) + 1;
  });
  
  return {
    byType: Object.entries(eventCounts).map(([name, count]) => ({ name, count })),
    byDay: Object.entries(dailyEvents).map(([date, count]) => ({ date, count })),
    total: events.length,
  };
}

function processConversionStats(conversions: any[]) {
  const byType = conversions.reduce((acc: Record<string, number>, conv) => {
    acc[conv.conversion_type] = (acc[conv.conversion_type] || 0) + 1;
    return acc;
  }, {});
  
  const totalValue = conversions.reduce((sum, conv) => sum + (conv.value || 0), 0);
  
  return {
    byType: Object.entries(byType).map(([type, count]) => ({ type, count })),
    totalValue,
    total: conversions.length,
  };
}

function processSubscriptionStats(subscriptions: any[]) {
  const byPlan = subscriptions.reduce((acc: Record<string, number>, sub) => {
    acc[sub.plan_id] = (acc[sub.plan_id] || 0) + 1;
    return acc;
  }, {});
  
  const active = subscriptions.filter(s => s.status === 'active').length;
  const canceled = subscriptions.filter(s => s.status === 'canceled').length;
  
  return {
    byPlan: Object.entries(byPlan).map(([plan, count]) => ({ plan, count })),
    active,
    canceled,
    total: subscriptions.length,
  };
}

function calculateFunnelMetrics(events: any[]) {
  const funnelSteps = [
    'user_signed_up',
    'onboarding_started',
    'onboarding_completed',
    'bank_connection_started',
    'bank_connection_completed',
    'subscriptions_detected',
    'subscription_created'
  ];
  
  const stepCounts = funnelSteps.map(step => ({
    step,
    count: events.filter(e => e.event_name === step).length,
  }));
  
  return stepCounts;
}
