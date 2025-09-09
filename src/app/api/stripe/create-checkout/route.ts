import { NextRequest } from "next/server";
import { getStripeServer, getPlanById } from "@/lib/stripe";
import { supabaseServer } from "@/lib/supabaseServer";

export async function POST(req: NextRequest) {
  try {
    const { planId, email } = await req.json();
      const authorization = req.headers.get('authorization');
      let user = null;
    // For preorder, we don't require authentication
    if (planId !== 'preorder') {
      // Get authenticated user from authorization header for regular plans
      if (!authorization?.startsWith('Bearer ')) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { "content-type": "application/json" },
        });
      }

      const token = authorization.split(' ')[1];
      const supabase = await supabaseServer();
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser(token);
      
      if (authError || !authUser) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401,
          headers: { "content-type": "application/json" },
        });
      }
      user = authUser;
    } else {
      user = {
        email: email,
        id: 'preorder',
      };
    }

    const plan = getPlanById(planId);
    console.log('Plan lookup:', { planId, plan, priceId: plan?.priceId });
    
    if (!plan || !plan.priceId) {
      return new Response(JSON.stringify({ 
        error: `Invalid plan: ${planId}. Price ID: ${plan?.priceId || 'missing'}` 
      }), {
        status: 400,
        headers: { "content-type": "application/json" },
      });
    }

    // Create Stripe checkout session
    const stripe = getStripeServer();
    
    // For preorders, we use a different configuration
    if (planId === 'preorder') {
      const session = await stripe.checkout.sessions.create({
        customer_email: email,
        payment_method_types: ['card'],
        mode: 'subscription',
        line_items: [
          {
            price: plan.priceId,
            quantity: 1,
          },
        ],
        success_url: `${req.headers.get('origin')}/dashboard?success=true&session_id={CHECKOUT_SESSION_ID}&type=preorder`,
        cancel_url: `${req.headers.get('origin')}/?canceled=true`,
        allow_promotion_codes: true,
        metadata: {
          planId: planId,
          type: 'preorder',
          email: email,
        },
      });
      
      return new Response(JSON.stringify({ sessionId: session.id }), {
        status: 200,
        headers: { "content-type": "application/json" },
      });
    }
    
    // Regular subscription checkout with 7-day free trial
    const session = await stripe.checkout.sessions.create({
      customer_email: user.email,
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: plan.priceId,
          quantity: 1,
        },
      ],
      success_url: `${req.headers.get('origin')}/dashboard?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${req.headers.get('origin')}/dashboard?canceled=true`,
      allow_promotion_codes: true, // Allow users to enter promo codes
      metadata: {
        userId: user.id,
        planId: planId,
      },
      subscription_data: {
        trial_period_days: 7, // 7-day free trial
        metadata: {
          userId: user.id,
          planId: planId,
        },
      },
    });

    return new Response(JSON.stringify({ sessionId: session.id }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  } catch (error: any) {
    console.error('Stripe checkout error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
}
