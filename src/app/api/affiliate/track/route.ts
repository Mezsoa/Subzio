import { NextRequest } from "next/server";
import { supabaseService } from "@/lib/supabaseClient";

export async function POST(req: NextRequest) {
  try {
    const { userId, partnerId, subscriptionName } = await req.json();
    
    const svc = supabaseService();
    
    // Track the affiliate click
    const { error } = await svc.from('affiliate_clicks').insert({
      user_id: userId,
      subscription_name: subscriptionName,
      affiliate_url: partnerId, // Store partner ID for now
      clicked_at: new Date().toISOString(),
      converted: false,
    });

    if (error) {
      console.error('Error tracking affiliate click:', error);
      return new Response(JSON.stringify({ error: "Failed to track click" }), {
        status: 500,
        headers: { "content-type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  } catch (error: any) {
    console.error('Affiliate tracking error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
}
