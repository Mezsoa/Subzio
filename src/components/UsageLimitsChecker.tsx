"use client";
import { useState, useEffect } from 'react';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { getPlanLimits, checkUsageLimit, formatLimitMessage, getUpgradeMessage, type UsageStats, type UsagePlanId, type UsageLimits } from '@/lib/usageLimits';
import { 
  AlertTriangle, 
  CheckCircle, 
  TrendingUp,
  Users,
  Bell,
  Download,
  Phone,
  CreditCard
} from 'lucide-react';

interface UsageLimitsCheckerProps {
  feature?: 'bankAccounts' | 'subscriptions' | 'alerts' | 'cancellationRequests' | 'dataExports';
  showUpgradePrompt?: boolean;
  className?: string;
}

export default function UsageLimitsChecker({ 
  feature, 
  showUpgradePrompt = true, 
  className = "" 
}: UsageLimitsCheckerProps) {
  const [usage, setUsage] = useState<UsageStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { plan } = useSubscription();

  useEffect(() => {
    fetchUsage();
  }, []);

  const fetchUsage = async () => {
    try {
      const { authedFetch } = await import('@/lib/authedFetch');
      const response = await authedFetch('/api/usage');
      if (response.ok) {
        const data = await response.json();
        setUsage(data.usage);
      }
    } catch (error) {
      console.error('Error fetching usage:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={`animate-pulse bg-background-light-mid/50 rounded-lg p-4 ${className}`}>
        <div className="h-4 bg-background-light-mid rounded w-3/4"></div>
      </div>
    );
  }

  if (!usage) return null;

  const limits = getPlanLimits((plan?.id || 'free') as UsagePlanId);
  
  // If no specific feature, show overview
  if (!feature) {
    return <UsageOverview usage={usage} limits={limits} className={className} />;
  }

  const limitCheck = checkUsageLimit(usage, limits, feature);
  
  if (limitCheck.allowed && limitCheck.remaining !== undefined && limitCheck.remaining > 5) {
    return null; // Don't show if user has plenty of usage left
  }

  const featureIcons = {
    bankAccounts: <CreditCard className="w-4 h-4" />,
    subscriptions: <TrendingUp className="w-4 h-4" />,
    alerts: <Bell className="w-4 h-4" />,
    cancellationRequests: <Phone className="w-4 h-4" />,
    dataExports: <Download className="w-4 h-4" />
  };

  const icon = featureIcons[feature];
  const message = limitCheck.limit ? formatLimitMessage(feature, limitCheck.limit, limitCheck.remaining || 0) : '';
  const upgradeMessage = getUpgradeMessage(plan?.id || 'free', feature);

  return (
    <div className={`border rounded-lg p-4 ${
      limitCheck.allowed 
        ? 'border-amber-200 bg-amber-50' 
        : 'border-red-200 bg-red-50'
    } ${className}`}>
      <div className="flex items-start gap-3">
        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
          limitCheck.allowed 
            ? 'bg-amber-100 text-amber-600' 
            : 'bg-red-100 text-red-600'
        }`}>
          {limitCheck.allowed ? <AlertTriangle className="w-4 h-4" /> : icon}
        </div>
        
        <div className="flex-1">
          <div className={`font-medium ${
            limitCheck.allowed ? 'text-amber-800' : 'text-red-800'
          }`}>
            {limitCheck.allowed ? 'Usage Limit Warning' : 'Usage Limit Reached'}
          </div>
          
          <p className={`text-sm mt-1 ${
            limitCheck.allowed ? 'text-amber-700' : 'text-red-700'
          }`}>
            {message}
          </p>
          
          {showUpgradePrompt && (
            <p className={`text-xs mt-2 ${
              limitCheck.allowed ? 'text-amber-600' : 'text-red-600'
            }`}>
              {upgradeMessage}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

interface UsageOverviewProps {
  usage: UsageStats;
  limits: UsageLimits;
  className?: string;
}

function UsageOverview({ usage, limits, className }: UsageOverviewProps) {
  const features = [
    { key: 'bankAccounts', name: 'Bank Accounts', icon: <CreditCard className="w-4 h-4" />, current: usage.bankAccountsConnected },
    { key: 'subscriptions', name: 'Subscriptions', icon: <TrendingUp className="w-4 h-4" />, current: usage.subscriptionsDetected },
    { key: 'alerts', name: 'Alerts', icon: <Bell className="w-4 h-4" />, current: usage.alertsCreated },
    { key: 'cancellationRequests', name: 'Cancel Requests', icon: <Phone className="w-4 h-4" />, current: usage.cancellationRequests },
    { key: 'dataExports', name: 'Data Exports', icon: <Download className="w-4 h-4" />, current: usage.dataExports },
  ];

  return (
    <div className={`bg-gradient-to-br from-card-bg-start-light to-card-bg-end-light border border-border-light rounded-xl p-6 ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        <Users className="w-5 h-5 text-primary" />
        <h3 className="text-lg font-semibold text-foreground-black">Usage Overview</h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((feature) => {
          const limit = limits[feature.key as keyof typeof limits];
          const isUnlimited = limit === -1;
          const percentage = isUnlimited ? 0 : (feature.current / limit) * 100;
          const isNearLimit = percentage > 80;
          const isAtLimit = percentage >= 100;

          return (
            <div key={feature.key} className="bg-background-light-mid/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  {feature.icon}
                  <span className="text-sm font-medium text-foreground-black">{feature.name}</span>
                </div>
                {isAtLimit && <AlertTriangle className="w-4 h-4 text-red-500" />}
                {isNearLimit && !isAtLimit && <AlertTriangle className="w-4 h-4 text-amber-500" />}
                {!isNearLimit && <CheckCircle className="w-4 h-4 text-green-500" />}
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-light">Used:</span>
                  <span className="font-medium text-foreground-black">
                    {feature.current}{isUnlimited ? '' : ` / ${limit}`}
                  </span>
                </div>
                
                {!isUnlimited && (
                  <div className="w-full bg-background-light rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-300 ${
                        isAtLimit ? 'bg-red-500' : 
                        isNearLimit ? 'bg-amber-500' : 
                        'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    ></div>
                  </div>
                )}
                
                <div className="text-xs text-muted-light">
                  {isUnlimited ? 'Unlimited' : 
                   isAtLimit ? 'Limit reached' :
                   isNearLimit ? `${limit - feature.current} remaining` :
                   'Within limits'
                  }
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
