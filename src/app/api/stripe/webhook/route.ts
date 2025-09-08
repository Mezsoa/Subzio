import { NextRequest } from "next/server";
import { getStripeServer } from "@/lib/stripe";
import { supabaseService } from "@/lib/supabaseClient";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: NextRequest) {
  console.log('🔔 Stripe webhook received!');
  try {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature')!;
    console.log('📝 Webhook signature present:', !!signature);
    console.log('🔐 Webhook secret configured:', !!webhookSecret);

    let event;
    try {
      const stripe = getStripeServer();
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
      console.log('✅ Webhook signature verified, event type:', event.type);
    } catch (err: any) {
      console.error('❌ Webhook signature verification failed:', err.message);
      return new Response(`Webhook Error: ${err.message}`, { status: 400 });
    }

    const supabase = supabaseService();

    switch (event.type) {
      case 'checkout.session.completed': {
        console.log('🎉 Processing checkout.session.completed');
        const session = event.data.object;
        const { userId, planId } = session.metadata!;
        console.log('👤 User ID:', userId, 'Plan ID:', planId);
        
        // Get subscription details from Stripe to get proper trial/billing dates
        const stripe = getStripeServer();
        console.log('🔍 Retrieving subscription details from Stripe...');
        const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
        console.log('📋 Stripe subscription status:', subscription.status);
        
        // Determine subscription status - if in trial, mark as 'trialing'
        const subscriptionStatus = subscription.status === 'trialing' ? 'trialing' : 'active';
        
        // Create or update user subscription with proper dates from Stripe
        console.log('💾 Inserting subscription into database...');
        console.log('🔍 Raw Stripe subscription data:', {
          current_period_start: (subscription as any).current_period_start,
          current_period_end: (subscription as any).current_period_end,
          trial_end: (subscription as any).trial_end
        });
        
        const subscriptionData = {
          user_id: userId,
          stripe_customer_id: session.customer,
          stripe_subscription_id: session.subscription,
          plan_id: planId,
          status: subscriptionStatus,
          current_period_start: (subscription as any).current_period_start ? 
            new Date((subscription as any).current_period_start * 1000).toISOString() : 
            new Date().toISOString(),
          current_period_end: (subscription as any).current_period_end ? 
            new Date((subscription as any).current_period_end * 1000).toISOString() : 
            null,
          trial_end: (subscription as any).trial_end ? 
            new Date((subscription as any).trial_end * 1000).toISOString() : 
            null,
        };
        console.log('📊 Subscription data to insert:', subscriptionData);
        
        const { data, error } = await supabase.from('user_subscriptions').upsert(subscriptionData);
        
        if (error) {
          console.error('❌ Database error:', error);
          throw error;
        }
        
        console.log('✅ Subscription saved to database:', data);
        
        console.log(`Subscription ${subscriptionStatus} for user:`, userId, {
          trial_end: (subscription as any).trial_end ? new Date((subscription as any).trial_end * 1000) : null,
          current_period_end: new Date((subscription as any).current_period_end * 1000)
        });
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        const userId = subscription.metadata.userId;
        
        if (userId) {
          await supabase.from('user_subscriptions').update({
            status: subscription.status,
            current_period_start: new Date((subscription as any).current_period_start * 1000).toISOString(),
            current_period_end: new Date((subscription as any).current_period_end * 1000).toISOString(),
          }).eq('stripe_subscription_id', subscription.id);
          
          console.log('Subscription updated for user:', userId);
        }
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        const userId = subscription.metadata.userId;
        
        if (userId) {
          await supabase.from('user_subscriptions').update({
            status: 'canceled',
            canceled_at: new Date().toISOString(),
          }).eq('stripe_subscription_id', subscription.id);
          
          console.log('Subscription canceled for user:', userId);
        }
        break;
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object;
        if ((invoice as any).subscription) {
          // Log successful payment
          console.log('Payment succeeded for subscription:', (invoice as any).subscription);
        }
        break;
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object;
        if ((invoice as any).subscription) {
          // Handle failed payment - maybe send email notification
          console.log('Payment failed for subscription:', (invoice as any).subscription);
        }
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  } catch (error: any) {
    console.error('Webhook error:', error);
    return new Response(`Webhook Error: ${error.message}`, { status: 400 });
  }
}
