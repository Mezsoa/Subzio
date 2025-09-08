import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';

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
        { error: 'Advanced analytics feature requires Business plan' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { subscriptions, transactions, timeRange } = body;

    // Generate advanced analytics
    const analytics = generateAdvancedAnalytics(subscriptions, transactions, timeRange);

    return NextResponse.json({ analytics });
  } catch (error) {
    console.error('Analytics generation error:', error);
    return NextResponse.json({ error: 'Analytics generation failed' }, { status: 500 });
  }
}

function generateAdvancedAnalytics(subscriptions: any[], transactions: any[], timeRange: string) {
  const now = new Date();
  const monthsBack = timeRange === '3m' ? 3 : timeRange === '6m' ? 6 : timeRange === '1y' ? 12 : 24;

  // Generate monthly spending trends
  const monthlyTrends = [];
  for (let i = monthsBack - 1; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthName = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
    
    // Calculate spending for this month (simulated)
    const baseAmount = subscriptions.reduce((sum, sub) => {
      const amount = sub.lastAmount || 0;
      const multiplier = sub.cadence === 'Weekly' ? 4.33 : 
                       sub.cadence === 'Daily' ? 30 : 1;
      return sum + (amount * multiplier);
    }, 0);
    
    // Add some realistic variation
    const variation = (Math.random() - 0.5) * 0.3; // ±15% variation
    const monthAmount = baseAmount * (1 + variation);
    
    // Calculate change from previous month
    const prevAmount = monthlyTrends.length > 0 ? monthlyTrends[monthlyTrends.length - 1].amount : monthAmount;
    const change = prevAmount > 0 ? ((monthAmount - prevAmount) / prevAmount) * 100 : 0;
    
    monthlyTrends.push({
      month: monthName,
      amount: monthAmount,
      change: change
    });
  }

  // Categorize subscriptions
  const categories = categorizeSubscriptions(subscriptions);
  const categoryBreakdown = Object.entries(categories).map(([category, subs]) => {
    const totalAmount = subs.reduce((sum, sub) => {
      const amount = sub.lastAmount || 0;
      const multiplier = sub.cadence === 'Weekly' ? 4.33 : 
                       sub.cadence === 'Daily' ? 30 : 1;
      return sum + (amount * multiplier);
    }, 0);
    
    const totalMonthly = subscriptions.reduce((sum, sub) => {
      const amount = sub.lastAmount || 0;
      const multiplier = sub.cadence === 'Weekly' ? 4.33 : 
                       sub.cadence === 'Daily' ? 30 : 1;
      return sum + (amount * multiplier);
    }, 0);
    
    return {
      category: category.replace('_', ' '),
      amount: totalAmount,
      percentage: totalMonthly > 0 ? (totalAmount / totalMonthly) * 100 : 0
    };
  }).filter(cat => cat.amount > 0);

  // Frequency distribution
  const frequencyMap = subscriptions.reduce((acc, sub) => {
    const frequency = sub.cadence || 'Monthly';
    if (!acc[frequency]) {
      acc[frequency] = { count: 0, totalAmount: 0 };
    }
    acc[frequency].count++;
    
    const monthlyAmount = (sub.lastAmount || 0) * (
      sub.cadence === 'Weekly' ? 4.33 : 
      sub.cadence === 'Daily' ? 30 : 1
    );
    acc[frequency].totalAmount += monthlyAmount;
    
    return acc;
  }, {} as Record<string, { count: number; totalAmount: number }>);

  const frequencyDistribution = Object.entries(frequencyMap).map(([frequency, data]) => ({
    frequency,
    count: data.count,
    total_amount: data.totalAmount
  }));

  // Current monthly spending
  const currentMonthlySpending = subscriptions.reduce((sum, sub) => {
    const amount = sub.lastAmount || 0;
    const multiplier = sub.cadence === 'Weekly' ? 4.33 : 
                     sub.cadence === 'Daily' ? 30 : 1;
    return sum + (amount * multiplier);
  }, 0);

  // Generate forecasting
  const nextMonthEstimate = currentMonthlySpending * 1.02; // 2% growth assumption
  const annualProjection = currentMonthlySpending * 12 * 1.05; // 5% annual growth

  // Generate savings opportunities
  const savingsOpportunities = [];
  
  // High-cost subscriptions
  const expensiveSubscriptions = subscriptions.filter(sub => {
    const monthlyAmount = (sub.lastAmount || 0) * (
      sub.cadence === 'Weekly' ? 4.33 : 
      sub.cadence === 'Daily' ? 30 : 1
    );
    return monthlyAmount > 50;
  });

  if (expensiveSubscriptions.length > 0) {
    const totalExpensive = expensiveSubscriptions.reduce((sum, sub) => {
      const monthlyAmount = (sub.lastAmount || 0) * (
        sub.cadence === 'Weekly' ? 4.33 : 
        sub.cadence === 'Daily' : 30 : 1
      );
      return sum + monthlyAmount;
    }, 0);

    savingsOpportunities.push({
      opportunity: `Review ${expensiveSubscriptions.length} high-cost subscription(s)`,
      potential_savings: totalExpensive * 0.3 // 30% potential savings
    });
  }

  // Duplicate categories
  const duplicateCategories = Object.entries(categories).filter(([_, subs]) => subs.length > 1);
  if (duplicateCategories.length > 0) {
    const duplicateSavings = duplicateCategories.reduce((sum, [_, subs]) => {
      const categoryTotal = subs.reduce((catSum, sub) => {
        const monthlyAmount = (sub.lastAmount || 0) * (
          sub.cadence === 'Weekly' ? 4.33 : 
          sub.cadence === 'Daily' ? 30 : 1
        );
        return catSum + monthlyAmount;
      }, 0);
      return sum + (categoryTotal * 0.5); // Keep cheapest, save 50% on others
    }, 0);

    savingsOpportunities.push({
      opportunity: 'Consolidate duplicate services',
      potential_savings: duplicateSavings
    });
  }

  // Weekly billing optimization
  const weeklySubscriptions = subscriptions.filter(sub => sub.cadence === 'Weekly');
  if (weeklySubscriptions.length > 0) {
    const weeklySavings = weeklySubscriptions.reduce((sum, sub) => {
      const monthlyAmount = (sub.lastAmount || 0) * 4.33;
      return sum + (monthlyAmount * 0.15); // 15% savings with annual billing
    }, 0);

    savingsOpportunities.push({
      opportunity: 'Switch weekly subscriptions to annual billing',
      potential_savings: weeklySavings
    });
  }

  return {
    spending_trends: {
      monthly: monthlyTrends,
      categories: categoryBreakdown
    },
    subscription_lifecycle: {
      new_this_month: Math.floor(Math.random() * 3), // Simulated
      canceled_this_month: Math.floor(Math.random() * 2), // Simulated
      price_changes: generatePriceChanges(subscriptions) // Simulated price changes
    },
    usage_patterns: {
      peak_spending_months: ['November', 'December', 'January'], // Holiday season
      seasonal_trends: [
        { season: 'Spring', avg_amount: currentMonthlySpending * 0.95 },
        { season: 'Summer', avg_amount: currentMonthlySpending * 1.1 },
        { season: 'Fall', avg_amount: currentMonthlySpending * 1.05 },
        { season: 'Winter', avg_amount: currentMonthlySpending * 1.15 }
      ],
      frequency_distribution: frequencyDistribution
    },
    forecasting: {
      next_month_estimate: nextMonthEstimate,
      annual_projection: annualProjection,
      savings_opportunities: savingsOpportunities
    }
  };
}

function categorizeSubscriptions(subscriptions: any[]) {
  const categories: Record<string, any[]> = {};

  const categoryKeywords = {
    'streaming': ['netflix', 'hulu', 'disney', 'prime', 'spotify', 'apple music', 'youtube', 'paramount', 'hbo'],
    'productivity': ['microsoft', 'google', 'adobe', 'notion', 'slack', 'zoom', 'dropbox', 'office'],
    'fitness': ['peloton', 'fitness', 'gym', 'yoga', 'nike', 'strava', 'myfitnesspal'],
    'news_media': ['news', 'times', 'post', 'journal', 'magazine', 'subscription'],
    'cloud_storage': ['dropbox', 'icloud', 'google drive', 'onedrive', 'box'],
    'software_tools': ['adobe', 'microsoft', 'autodesk', 'jetbrains', 'github'],
    'financial': ['bank', 'credit', 'investment', 'trading', 'finance'],
    'shopping': ['amazon', 'costco', 'membership', 'delivery', 'grocery']
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

function generatePriceChanges(subscriptions: any[]) {
  // Simulate some price changes for demo purposes
  const priceChanges = [];
  const changedSubs = subscriptions.slice(0, Math.min(3, subscriptions.length));
  
  changedSubs.forEach(sub => {
    const oldPrice = sub.lastAmount || 10;
    const changePercent = (Math.random() - 0.3) * 0.4; // -30% to +10% change
    const newPrice = oldPrice * (1 + changePercent);
    
    if (Math.abs(changePercent) > 0.05) { // Only show changes > 5%
      priceChanges.push({
        name: sub.name,
        old_price: oldPrice,
        new_price: newPrice,
        change: newPrice - oldPrice
      });
    }
  });
  
  return priceChanges;
}
