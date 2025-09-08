import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';
import { isFeatureAllowed } from '@/lib/stripe';
import { getAuthenticatedUser } from '@/lib/authUtils';

interface Subscription {
  name: string;
  cadence?: string;
  lastAmount?: number;
  lastDate?: string;
  count?: number;
  confidence?: number;
  provider_emoji?: string;
}

interface Insight {
  id: string;
  type: 'savings_opportunity' | 'spending_trend' | 'duplicate_service' | 'price_optimization' | 'usage_pattern';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  potential_savings?: number;
  confidence_score: number;
  action_items: string[];
  category?: string;
}

export async function POST(request: NextRequest) {
  try {
    const { user, error: authError } = await getAuthenticatedUser(request);
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = await supabaseServer();

    // Check if user has access to AI insights
    const { data: subscription } = await supabase
      .from('user_subscriptions')
      .select('plan_id')
      .eq('user_id', user.id)
      .single();

    const planId = subscription?.plan_id || 'free';
    
    if (!isFeatureAllowed(planId, 'advanced_insights')) {
      return NextResponse.json(
        { error: 'AI Insights feature requires Pro or Business plan' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { subscriptions } = body;

    console.log('Insights API: Received subscriptions:', subscriptions);

    if (!subscriptions || !Array.isArray(subscriptions)) {
      console.log('Insights API: Invalid subscriptions data');
      return NextResponse.json(
        { error: 'Invalid subscriptions data' },
        { status: 400 }
      );
    }

    // Generate AI insights
    const insights = await generateInsights(subscriptions);
    console.log('Insights API: Generated insights:', insights);

    return NextResponse.json({ insights });
  } catch (error) {
    console.error('Unexpected error in insights generation:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function generateInsights(subscriptions: Subscription[]): Promise<Insight[]> {
  const insights: Insight[] = [];

  // Calculate total monthly spending
  const totalMonthly = subscriptions.reduce((sum, sub) => {
    const amount = sub.lastAmount || 0;
    const multiplier = sub.cadence === 'Weekly' ? 4.33 : 
                     sub.cadence === 'Daily' ? 30 : 1;
    return sum + (amount * multiplier);
  }, 0);

  // 1. High spending subscriptions (potential savings)
  const expensiveSubscriptions = subscriptions
    .map(sub => ({
      ...sub,
      monthlyAmount: (sub.lastAmount || 0) * (
        sub.cadence === 'Weekly' ? 4.33 : 
        sub.cadence === 'Daily' ? 30 : 1
      )
    }))
    .filter(sub => sub.monthlyAmount > 20)
    .sort((a, b) => b.monthlyAmount - a.monthlyAmount);

  if (expensiveSubscriptions.length > 0) {
    const topExpensive = expensiveSubscriptions[0];
    insights.push({
      id: `savings-${Date.now()}`,
      type: 'savings_opportunity',
      title: `High-Cost Subscription: ${topExpensive.name}`,
      description: `${topExpensive.name} costs $${topExpensive.monthlyAmount.toFixed(0)}/month, which is ${Math.round((topExpensive.monthlyAmount / totalMonthly) * 100)}% of your total subscription spending.`,
      impact: topExpensive.monthlyAmount > 50 ? 'high' : 'medium',
      potential_savings: Math.round(topExpensive.monthlyAmount * 0.5), // Assume 50% potential savings
      confidence_score: 85,
      action_items: [
        'Review usage and consider downgrading to a lower tier',
        'Look for alternative services with similar features',
        'Check if annual billing offers significant discounts',
        'Cancel if not actively using the service'
      ],
      category: 'cost_optimization'
    });
  }

  // 2. Detect potential duplicate services
  const serviceCategories = categorizeSubscriptions(subscriptions);
  for (const [category, services] of Object.entries(serviceCategories)) {
    if (services.length > 1) {
      const totalCategorySpend = services.reduce((sum, service) => {
        const monthlyAmount = (service.lastAmount || 0) * (
          service.cadence === 'Weekly' ? 4.33 : 
          service.cadence === 'Daily' ? 30 : 1
        );
        return sum + monthlyAmount;
      }, 0);

      insights.push({
        id: `duplicate-${category}-${Date.now()}`,
        type: 'duplicate_service',
        title: `Multiple ${category} Services Detected`,
        description: `You have ${services.length} ${category} subscriptions costing $${totalCategorySpend.toFixed(0)}/month total. Consider consolidating to one primary service.`,
        impact: totalCategorySpend > 30 ? 'high' : 'medium',
        potential_savings: Math.round(totalCategorySpend * 0.6), // Keep cheapest, cancel others
        confidence_score: 75,
        action_items: [
          `Compare features across your ${services.length} ${category} subscriptions`,
          'Choose the one that best meets your needs',
          'Cancel redundant subscriptions',
          'Consider family/team plans if applicable'
        ],
        category: 'consolidation'
      });
    }
  }

  // 3. Spending trend analysis
  if (totalMonthly > 100) {
    insights.push({
      id: `spending-trend-${Date.now()}`,
      type: 'spending_trend',
      title: 'High Monthly Subscription Spending',
      description: `Your monthly subscription spending of $${totalMonthly.toFixed(0)} represents $${(totalMonthly * 12).toFixed(0)} annually. This is above average for most users.`,
      impact: totalMonthly > 200 ? 'high' : 'medium',
      potential_savings: Math.round(totalMonthly * 0.3),
      confidence_score: 90,
      action_items: [
        'Set a monthly subscription budget',
        'Review and cancel unused subscriptions',
        'Look for bundle deals to reduce overall costs',
        'Consider sharing family plans with household members'
      ],
      category: 'budget_management'
    });
  }

  // 4. Low-confidence subscriptions (might be incorrectly detected)
  const lowConfidenceSubscriptions = subscriptions.filter(sub => 
    sub.confidence && sub.confidence < 0.7
  );

  if (lowConfidenceSubscriptions.length > 0) {
    insights.push({
      id: `low-confidence-${Date.now()}`,
      type: 'usage_pattern',
      title: 'Verify Subscription Detections',
      description: `${lowConfidenceSubscriptions.length} subscription(s) were detected with lower confidence. Please verify these are actual recurring subscriptions.`,
      impact: 'low',
      confidence_score: 60,
      action_items: [
        'Review flagged transactions in your dashboard',
        'Mark false positives to improve future detection',
        'Check your email for subscription confirmations',
        'Verify with your bank statements'
      ],
      category: 'accuracy'
    });
  }

  // 5. Subscription frequency optimization
  const weeklySubscriptions = subscriptions.filter(sub => sub.cadence === 'Weekly');
  if (weeklySubscriptions.length > 0) {
    const weeklyTotal = weeklySubscriptions.reduce((sum, sub) => 
      sum + ((sub.lastAmount || 0) * 4.33), 0
    );

    insights.push({
      id: `frequency-${Date.now()}`,
      type: 'price_optimization',
      title: 'Weekly Subscription Optimization',
      description: `You have ${weeklySubscriptions.length} weekly subscription(s) costing $${weeklyTotal.toFixed(0)}/month. Consider switching to monthly or annual billing for potential savings.`,
      impact: 'medium',
      potential_savings: Math.round(weeklyTotal * 0.15), // Assume 15% savings with different billing
      confidence_score: 70,
      action_items: [
        'Check if monthly billing is available for weekly subscriptions',
        'Look for annual subscription discounts',
        'Calculate total cost differences',
        'Switch to the most cost-effective billing cycle'
      ],
      category: 'billing_optimization'
    });
  }

  return insights.slice(0, 8); // Limit to top 8 insights
}

function categorizeSubscriptions(subscriptions: Subscription[]): Record<string, Subscription[]> {
  const categories: Record<string, Subscription[]> = {};

  // Simple categorization based on service names
  const categoryKeywords = {
    'streaming': ['netflix', 'hulu', 'disney', 'prime', 'spotify', 'apple music', 'youtube', 'paramount', 'hbo'],
    'productivity': ['microsoft', 'google', 'adobe', 'notion', 'slack', 'zoom', 'dropbox', 'office'],
    'fitness': ['peloton', 'fitness', 'gym', 'yoga', 'nike', 'strava', 'myfitnesspal'],
    'news': ['news', 'times', 'post', 'journal', 'magazine', 'subscription'],
    'cloud_storage': ['dropbox', 'icloud', 'google drive', 'onedrive', 'box'],
    'software': ['adobe', 'microsoft', 'autodesk', 'jetbrains', 'github']
  };

  subscriptions.forEach(subscription => {
    const name = subscription.name.toLowerCase();
    let categorized = false;

    for (const [category, keywords] of Object.entries(categoryKeywords)) {
      if (keywords.some(keyword => name.includes(keyword))) {
        if (!categories[category]) categories[category] = [];
        categories[category].push(subscription);
        categorized = true;
        break;
      }
    }

    if (!categorized) {
      if (!categories['other']) categories['other'] = [];
      categories['other'].push(subscription);
    }
  });

  return categories;
}
