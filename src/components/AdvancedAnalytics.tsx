"use client";
import { useState, useEffect } from 'react';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { isFeatureAllowed } from '@/lib/stripe';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Calendar, 
  DollarSign,
  PieChart,
  LineChart,
  Target,
  Zap,
  ArrowUp,
  ArrowDown,
  Minus
} from 'lucide-react';
import UpgradePrompt from './UpgradePrompt';

interface AnalyticsData {
  spending_trends: {
    monthly: Array<{ month: string; amount: number; change: number }>;
    categories: Array<{ category: string; amount: number; percentage: number }>;
  };
  subscription_lifecycle: {
    new_this_month: number;
    canceled_this_month: number;
    price_changes: Array<{ name: string; old_price: number; new_price: number; change: number }>;
  };
  usage_patterns: {
    peak_spending_months: string[];
    seasonal_trends: Array<{ season: string; avg_amount: number }>;
    frequency_distribution: Array<{ frequency: string; count: number; total_amount: number }>;
  };
  forecasting: {
    next_month_estimate: number;
    annual_projection: number;
    savings_opportunities: Array<{ opportunity: string; potential_savings: number }>;
  };
}

interface AdvancedAnalyticsProps {
  subscriptions?: any[];
  transactions?: any[];
  inline?: boolean;
}

export default function AdvancedAnalytics({ subscriptions = [], transactions = [], inline = false }: AdvancedAnalyticsProps) {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'3m' | '6m' | '1y' | '2y'>('6m');
  const { plan } = useSubscription();

  const canUseAdvancedAnalytics = plan?.id === 'business';

  useEffect(() => {
    if (canUseAdvancedAnalytics && subscriptions.length > 0) {
      generateAnalytics();
    } else {
      setLoading(false);
    }
  }, [canUseAdvancedAnalytics, subscriptions, timeRange]);

  const generateAnalytics = async () => {
    setLoading(true);
    try {
      const { authedFetch } = await import('@/lib/authedFetch');
      const response = await authedFetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          subscriptions, 
          transactions, 
          timeRange 
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setAnalyticsData(data.analytics);
      }
    } catch (error) {
      console.error('Error generating analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!canUseAdvancedAnalytics) {
    return (
      <div className="space-y-6">
        {/* Show some basic content even for non-business users */}
        <div className="bg-gradient-to-br from-card-bg-start-light to-card-bg-end-light border border-border-light rounded-xl p-6">
          <div className="text-center py-8">
            <BarChart3 className="w-16 h-16 text-muted-light mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground-black mb-2">Advanced Analytics</h3>
            <p className="text-muted-light mb-6">
              Get detailed insights into your subscription spending patterns, trends, and forecasting.
            </p>
          </div>
        </div>
        
        <UpgradePrompt 
          feature="advanced analytics and trends"
          limit="Advanced analytics is exclusive to Business plan users"
          inline={inline}
        />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <BarChart3 className="w-6 h-6 text-primary absolute top-3 left-3" />
          </div>
          <p className="text-muted-light">Generating advanced analytics...</p>
        </div>
      </div>
    );
  }

  if (subscriptions.length === 0) {
    return (
      <div className="text-center py-12 bg-gradient-to-br from-card-bg-start-light to-card-bg-end-light rounded-xl border border-border-light">
        <BarChart3 className="w-16 h-16 text-muted-light mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-foreground-black mb-2">No Data to Analyze</h3>
        <p className="text-muted-light">
          Connect your bank account and let us detect subscriptions to generate advanced analytics.
        </p>
      </div>
    );
  }

  const getChangeIcon = (change: number) => {
    if (change > 0) return <ArrowUp className="w-4 h-4 text-red-500" />;
    if (change < 0) return <ArrowDown className="w-4 h-4 text-green-500" />;
    return <Minus className="w-4 h-4 text-muted-light" />;
  };

  const getChangeColor = (change: number) => {
    if (change > 0) return 'text-red-500';
    if (change < 0) return 'text-green-500';
    return 'text-muted-light';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-semibold text-foreground-black">Advanced Analytics</h2>
          <div className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 rounded-full text-xs">
            <Zap className="w-3 h-3" />
            Business Exclusive
          </div>
        </div>
        
        <select
          value={timeRange}
          onChange={(e) => setTimeRange(e.target.value as typeof timeRange)}
          className="px-3 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm"
        >
          <option value="3m">Last 3 Months</option>
          <option value="6m">Last 6 Months</option>
          <option value="1y">Last Year</option>
          <option value="2y">Last 2 Years</option>
        </select>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-br from-card-bg-start-light to-card-bg-end-light border border-border-light rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-blue-500" />
            <span className="font-medium text-foreground-black">Monthly Trend</span>
          </div>
          <div className="text-2xl font-bold text-foreground-black">
            {analyticsData?.spending_trends.monthly.length > 0 ? 
              `${analyticsData.spending_trends.monthly[analyticsData.spending_trends.monthly.length - 1].change > 0 ? '+' : ''}${analyticsData.spending_trends.monthly[analyticsData.spending_trends.monthly.length - 1].change.toFixed(1)}%`
              : 'N/A'
            }
          </div>
          <div className="text-sm text-muted-light">vs previous month</div>
        </div>

        <div className="bg-gradient-to-br from-card-bg-start-light to-card-bg-end-light border border-border-light rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-5 h-5 text-green-500" />
            <span className="font-medium text-foreground-black">Active Subs</span>
          </div>
          <div className="text-2xl font-bold text-foreground-black">{subscriptions.length}</div>
          <div className="text-sm text-green-600">
            +{analyticsData?.subscription_lifecycle.new_this_month || 0} this month
          </div>
        </div>

        <div className="bg-gradient-to-br from-card-bg-start-light to-card-bg-end-light border border-border-light rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-5 h-5 text-purple-500" />
            <span className="font-medium text-foreground-black">Next Month</span>
          </div>
          <div className="text-2xl font-bold text-foreground-black">
            ${analyticsData?.forecasting.next_month_estimate?.toFixed(0) || '0'}
          </div>
          <div className="text-sm text-muted-light">Projected spending</div>
        </div>

        <div className="bg-gradient-to-br from-card-bg-start-light to-card-bg-end-light border border-border-light rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-5 h-5 text-amber-500" />
            <span className="font-medium text-foreground-black">Annual</span>
          </div>
          <div className="text-2xl font-bold text-foreground-black">
            ${analyticsData?.forecasting.annual_projection?.toFixed(0) || '0'}
          </div>
          <div className="text-sm text-muted-light">Projected total</div>
        </div>
      </div>

      {/* Spending Trends Chart */}
      <div className="bg-gradient-to-br from-card-bg-start-light to-card-bg-end-light border border-border-light rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <LineChart className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground-black">Spending Trends</h3>
        </div>
        
        {analyticsData?.spending_trends.monthly && analyticsData.spending_trends.monthly.length > 0 ? (
          <div className="space-y-4">
            {/* Simple bar chart representation */}
            <div className="grid grid-cols-1 gap-2">
              {analyticsData.spending_trends.monthly.slice(-6).map((month, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-16 text-sm text-muted-light">{month.month}</div>
                  <div className="flex-1 bg-background-light-mid/50 rounded-full h-6 relative">
                    <div 
                      className="bg-gradient-to-r from-primary to-primary/70 h-6 rounded-full flex items-center justify-end pr-2"
                      style={{ width: `${Math.min((month.amount / Math.max(...analyticsData.spending_trends.monthly.map(m => m.amount))) * 100, 100)}%` }}
                    >
                      <span className="text-xs text-white font-medium">${month.amount.toFixed(0)}</span>
                    </div>
                  </div>
                  <div className={`flex items-center gap-1 text-sm ${getChangeColor(month.change)}`}>
                    {getChangeIcon(month.change)}
                    {Math.abs(month.change).toFixed(1)}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-light">
            Not enough historical data to show trends
          </div>
        )}
      </div>

      {/* Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-card-bg-start-light to-card-bg-end-light border border-border-light rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <PieChart className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground-black">Category Breakdown</h3>
          </div>
          
          {analyticsData?.spending_trends.categories && analyticsData.spending_trends.categories.length > 0 ? (
            <div className="space-y-3">
              {analyticsData.spending_trends.categories.map((category, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full bg-primary" style={{ 
                      backgroundColor: `hsl(${(index * 360) / analyticsData.spending_trends.categories.length}, 70%, 50%)` 
                    }}></div>
                    <span className="text-foreground-black capitalize">{category.category}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-foreground-black">${category.amount.toFixed(0)}</div>
                    <div className="text-xs text-muted-light">{category.percentage.toFixed(1)}%</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-light">
              No category data available
            </div>
          )}
        </div>

        {/* Frequency Distribution */}
        <div className="bg-gradient-to-br from-card-bg-start-light to-card-bg-end-light border border-border-light rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground-black">Billing Frequency</h3>
          </div>
          
          {analyticsData?.usage_patterns.frequency_distribution && analyticsData.usage_patterns.frequency_distribution.length > 0 ? (
            <div className="space-y-3">
              {analyticsData.usage_patterns.frequency_distribution.map((freq, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-foreground-black">{freq.frequency}</span>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-foreground-black">{freq.count} subs</div>
                    <div className="text-xs text-muted-light">${freq.total_amount.toFixed(0)}/mo</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-light">
              No frequency data available
            </div>
          )}
        </div>
      </div>

      {/* Forecasting & Opportunities */}
      <div className="bg-gradient-to-br from-card-bg-start-light to-card-bg-end-light border border-border-light rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-5 h-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground-black">Savings Opportunities</h3>
        </div>
        
        {analyticsData?.forecasting.savings_opportunities && analyticsData.forecasting.savings_opportunities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analyticsData.forecasting.savings_opportunities.map((opportunity, index) => (
              <div key={index} className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <DollarSign className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-green-800 mb-1">{opportunity.opportunity}</h4>
                    <p className="text-sm text-green-700">
                      Potential savings: <span className="font-semibold">${opportunity.potential_savings.toFixed(0)}/month</span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-light">
            No specific savings opportunities identified at this time
          </div>
        )}
      </div>

      {/* Price Changes */}
      {analyticsData?.subscription_lifecycle.price_changes && analyticsData.subscription_lifecycle.price_changes.length > 0 && (
        <div className="bg-gradient-to-br from-card-bg-start-light to-card-bg-end-light border border-border-light rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="w-5 h-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground-black">Recent Price Changes</h3>
          </div>
          
          <div className="space-y-3">
            {analyticsData.subscription_lifecycle.price_changes.map((change, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-background-light-mid/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    change.change > 0 ? 'bg-red-100' : 'bg-green-100'
                  }`}>
                    {change.change > 0 ? 
                      <TrendingUp className="w-4 h-4 text-red-600" /> : 
                      <TrendingDown className="w-4 h-4 text-green-600" />
                    }
                  </div>
                  <div>
                    <div className="font-medium text-foreground-black">{change.name}</div>
                    <div className="text-sm text-muted-light">
                      ${change.old_price.toFixed(2)} → ${change.new_price.toFixed(2)}
                    </div>
                  </div>
                </div>
                <div className={`text-right ${change.change > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  <div className="font-semibold">
                    {change.change > 0 ? '+' : ''}${Math.abs(change.change).toFixed(2)}
                  </div>
                  <div className="text-xs">
                    {change.change > 0 ? '+' : ''}{((change.change / change.old_price) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
