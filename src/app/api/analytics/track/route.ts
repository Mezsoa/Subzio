import { NextRequest } from "next/server";
import { supabaseService } from "@/lib/supabaseClient";

export async function POST(req: NextRequest) {
  try {
    const eventData = await req.json();
    const {
      event,
      properties = {},
      userId,
      sessionId,
      timestamp,
      url,
      userAgent
    } = eventData;

    const svc = supabaseService();
    
    // Store analytics event in database
    const { error } = await svc.from('analytics_events').insert({
      event_name: event,
      properties,
      user_id: userId,
      session_id: sessionId,
      timestamp: timestamp || new Date().toISOString(),
      url,
      user_agent: userAgent,
      ip_address: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown',
    });

    if (error) {
      console.error('Error storing analytics event:', error);
      // Don't fail the request if analytics storage fails
    }

    // Track key conversion events
    if (event === 'subscription_created') {
      await trackConversion('subscription', properties.value || 0, userId);
    } else if (event === 'user_signed_up') {
      await trackConversion('signup', 0, userId);
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  } catch (error: any) {
    console.error('Analytics tracking error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
}

async function trackConversion(type: string, value: number, userId?: string) {
  try {
    const svc = supabaseService();
    
    await svc.from('conversions').insert({
      conversion_type: type,
      value,
      user_id: userId,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error tracking conversion:', error);
  }
}
