"use client";
import { useState, useEffect } from 'react';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { isFeatureAllowed } from '@/lib/stripe';
import { 
  Brain, 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  Calendar, 
  Target,
  Lightbulb,
  AlertCircle,
  CheckCircle,
  ArrowRight,
  Zap
} from 'lucide-react';
import UpgradePrompt from './UpgradePrompt';

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

interface AIInsightsProps {
  subscriptions?: any[];
  inline?: boolean;
}

export default function AIInsights({ subscriptions = [], inline = false }: AIInsightsProps) {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInsight, setSelectedInsight] = useState<Insight | null>(null);
  const { plan } = useSubscription();

  const canUseAIInsights = isFeatureAllowed(plan?.id || 'free', 'advanced_insights');

  useEffect(() => {
    if (canUseAIInsights && subscriptions.length > 0) {
      generateInsights();
    } else {
      setLoading(false);
    }
  }, [canUseAIInsights, subscriptions]);

  const generateInsights = async () => {
    try {
      const response = await fetch('/api/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscriptions }),
      });

      if (response.ok) {
        const data = await response.json();
        setInsights(data.insights || []);
      }
    } catch (error) {
      console.error('Error generating insights:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!canUseAIInsights) {
    return (
      <UpgradePrompt 
        feature="advanced AI insights and recommendations"
        limit="Free plan includes basic subscription detection only"
        inline={inline}
      />
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <Brain className="w-6 h-6 text-primary absolute top-3 left-3" />
          </div>
          <p className="text-muted-light">AI is analyzing your subscriptions...</p>
        </div>
      </div>
    );
  }

  if (subscriptions.length === 0) {
    return (
      <div className="text-center py-12 bg-gradient-to-br from-card-bg-start-light to-card-bg-end-light rounded-xl border border-border-light">
        <Brain className="w-16 h-16 text-muted-light mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-foreground-black mb-2">No Subscriptions to Analyze</h3>
        <p className="text-muted-light">
          Connect your bank account to start receiving AI-powered insights about your subscriptions.
        </p>
      </div>
    );
  }

  const impactColors = {
    high: 'text-red-600 bg-red-50 border-red-200',
    medium: 'text-amber-600 bg-amber-50 border-amber-200',
    low: 'text-green-600 bg-green-50 border-green-200'
  };

  const impactIcons = {
    high: <AlertCircle className="w-4 h-4" />,
    medium: <Target className="w-4 h-4" />,
    low: <CheckCircle className="w-4 h-4" />
  };

  const typeIcons = {
    savings_opportunity: <DollarSign className="w-5 h-5 text-green-600" />,
    spending_trend: <TrendingUp className="w-5 h-5 text-blue-600" />,
    duplicate_service: <AlertCircle className="w-5 h-5 text-amber-600" />,
    price_optimization: <Target className="w-5 h-5 text-purple-600" />,
    usage_pattern: <Calendar className="w-5 h-5 text-indigo-600" />
  };

  const totalPotentialSavings = insights.reduce((sum, insight) => 
    sum + (insight.potential_savings || 0), 0
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Brain className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-semibold text-foreground-black">AI Insights</h2>
          <div className="flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
            <Zap className="w-3 h-3" />
            Pro Feature
          </div>
        </div>
        {totalPotentialSavings > 0 && (
          <div className="text-right">
            <div className="text-sm text-muted-light">Potential Annual Savings</div>
            <div className="text-2xl font-bold text-green-600">
              ${(totalPotentialSavings * 12).toLocaleString()}
            </div>
          </div>
        )}
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-card-bg-start-light to-card-bg-end-light border border-border-light rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="w-5 h-5 text-amber-500" />
            <span className="font-medium text-foreground-black">Insights Found</span>
          </div>
          <div className="text-2xl font-bold text-foreground-black">{insights.length}</div>
          <div className="text-sm text-muted-light">
            {insights.filter(i => i.impact === 'high').length} high impact
          </div>
        </div>

        <div className="bg-gradient-to-br from-card-bg-start-light to-card-bg-end-light border border-border-light rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-5 h-5 text-green-500" />
            <span className="font-medium text-foreground-black">Monthly Savings</span>
          </div>
          <div className="text-2xl font-bold text-green-600">
            ${totalPotentialSavings.toFixed(0)}
          </div>
          <div className="text-sm text-muted-light">Potential reduction</div>
        </div>

        <div className="bg-gradient-to-br from-card-bg-start-light to-card-bg-end-light border border-border-light rounded-xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-5 h-5 text-blue-500" />
            <span className="font-medium text-foreground-black">Avg Confidence</span>
          </div>
          <div className="text-2xl font-bold text-foreground-black">
            {insights.length > 0 ? Math.round(insights.reduce((sum, i) => sum + i.confidence_score, 0) / insights.length) : 0}%
          </div>
          <div className="text-sm text-muted-light">AI accuracy score</div>
        </div>
      </div>

      {/* Insights List */}
      {insights.length === 0 ? (
        <div className="text-center py-12 bg-gradient-to-br from-card-bg-start-light to-card-bg-end-light rounded-xl border border-border-light">
          <Brain className="w-16 h-16 text-muted-light mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground-black mb-2">Analysis Complete</h3>
          <p className="text-muted-light">
            Your subscription portfolio looks optimized! Check back after connecting more accounts or when new subscriptions are detected.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {insights.sort((a, b) => {
            const impactOrder = { high: 3, medium: 2, low: 1 };
            return impactOrder[b.impact] - impactOrder[a.impact];
          }).map((insight) => (
            <div
              key={insight.id}
              className="bg-gradient-to-br from-card-bg-start-light to-card-bg-end-light border border-border-light rounded-xl p-6 hover:shadow-md transition-all duration-200 cursor-pointer"
              onClick={() => setSelectedInsight(insight)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    {typeIcons[insight.type]}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-foreground-black">{insight.title}</h3>
                      <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs border ${impactColors[insight.impact]}`}>
                        {impactIcons[insight.impact]}
                        {insight.impact} impact
                      </div>
                    </div>
                    <p className="text-sm text-muted-light mb-2">{insight.description}</p>
                    
                    {/* Confidence Score */}
                    <div className="flex items-center gap-2 text-xs text-muted-light">
                      <span>Confidence: {insight.confidence_score}%</span>
                      {insight.potential_savings && (
                        <>
                          <span>•</span>
                          <span className="text-green-600 font-medium">
                            Save ${insight.potential_savings}/month
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                
                <ArrowRight className="w-5 h-5 text-muted-light" />
              </div>

              {/* Quick Actions Preview */}
              <div className="bg-background-light-mid/30 rounded-lg p-3">
                <div className="text-xs text-muted-light mb-1">Recommended Actions:</div>
                <div className="flex flex-wrap gap-1">
                  {insight.action_items.slice(0, 2).map((action, idx) => (
                    <span key={idx} className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                      {action}
                    </span>
                  ))}
                  {insight.action_items.length > 2 && (
                    <span className="text-xs text-muted-light">
                      +{insight.action_items.length - 2} more
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detailed Insight Modal */}
      {selectedInsight && (
        <InsightDetailModal
          insight={selectedInsight}
          onClose={() => setSelectedInsight(null)}
        />
      )}
    </div>
  );
}

interface InsightDetailModalProps {
  insight: Insight;
  onClose: () => void;
}

function InsightDetailModal({ insight, onClose }: InsightDetailModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background-light rounded-xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-foreground-black">{insight.title}</h3>
          <button
            onClick={onClose}
            className="p-2 text-muted-light hover:text-foreground-black transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="space-y-6">
          {/* Insight Details */}
          <div>
            <h4 className="font-medium text-foreground-black mb-2">Analysis</h4>
            <p className="text-muted-light">{insight.description}</p>
          </div>

          {/* Impact & Savings */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-background-light-mid/50 rounded-lg p-4">
              <h4 className="font-medium text-foreground-black mb-2">Impact Level</h4>
              <div className="text-2xl font-bold capitalize text-foreground-black">
                {insight.impact}
              </div>
              <div className="text-sm text-muted-light">
                Confidence: {insight.confidence_score}%
              </div>
            </div>

            {insight.potential_savings && (
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <h4 className="font-medium text-green-800 mb-2">Potential Savings</h4>
                <div className="text-2xl font-bold text-green-600">
                  ${insight.potential_savings}/month
                </div>
                <div className="text-sm text-green-600">
                  ${(insight.potential_savings * 12).toFixed(0)}/year
                </div>
              </div>
            )}
          </div>

          {/* Action Items */}
          <div>
            <h4 className="font-medium text-foreground-black mb-3">Recommended Actions</h4>
            <div className="space-y-2">
              {insight.action_items.map((action, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 bg-background-light-mid/30 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-foreground-black">{action}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-border-light">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-border-light text-foreground-black rounded-lg hover:bg-card-hover-light transition-colors"
            >
              Close
            </button>
            <button className="flex-1 px-4 py-2 bg-gradient-to-r from-cta-start to-cta-end text-white rounded-lg hover:opacity-90 transition-opacity">
              Take Action
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
