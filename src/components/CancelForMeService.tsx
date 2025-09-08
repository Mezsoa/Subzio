"use client";
import { useState, useEffect } from 'react';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { 
  Phone, 
  Clock, 
  CheckCircle, 
  XCircle, 
  User, 
  DollarSign,
  AlertTriangle,
  Calendar,
  MessageSquare,
  Shield,
  Zap
} from 'lucide-react';
import UpgradePrompt from './UpgradePrompt';

interface CancellationRequest {
  id: string;
  subscription_name: string;
  subscription_details: {
    provider: string;
    amount: number;
    billing_cycle: string;
    account_info?: string;
  };
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'cancelled';
  priority: 'normal' | 'urgent';
  assigned_to?: string;
  created_at: string;
  completed_at?: string;
  notes?: string;
  estimated_completion?: string;
}

interface CancelForMeServiceProps {
  subscriptions?: any[];
  inline?: boolean;
}

export default function CancelForMeService({ subscriptions = [], inline = false }: CancelForMeServiceProps) {
  const [requests, setRequests] = useState<CancellationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState<any>(null);
  const [monthlyUsage, setMonthlyUsage] = useState(0);
  const { plan } = useSubscription();

  const canUseCancelService = plan?.id === 'business';
  const monthlyLimit = 5; // Business plan gets 5 free cancellations per month

  useEffect(() => {
    if (canUseCancelService) {
      fetchCancellationRequests();
      fetchUsage();
    } else {
      setLoading(false);
    }
  }, [canUseCancelService]);

  const fetchCancellationRequests = async () => {
    try {
      const response = await fetch('/api/cancellation-requests');
      if (response.ok) {
        const data = await response.json();
        setRequests(data.requests || []);
      }
    } catch (error) {
      console.error('Error fetching cancellation requests:', error);
    }
  };

  const fetchUsage = async () => {
    try {
      const response = await fetch('/api/cancellation-requests/usage');
      if (response.ok) {
        const data = await response.json();
        setMonthlyUsage(data.monthly_usage || 0);
      }
    } catch (error) {
      console.error('Error fetching usage:', error);
    } finally {
      setLoading(false);
    }
  };

  const submitCancellationRequest = async (subscriptionData: any, priority: 'normal' | 'urgent') => {
    try {
      const response = await fetch('/api/cancellation-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subscription_name: subscriptionData.name,
          subscription_details: {
            provider: subscriptionData.name,
            amount: subscriptionData.lastAmount || 0,
            billing_cycle: subscriptionData.cadence || 'Monthly',
            account_info: 'Will be collected via secure form'
          },
          priority
        }),
      });

      if (response.ok) {
        const newRequest = await response.json();
        setRequests([newRequest, ...requests]);
        setShowRequestForm(false);
        setSelectedSubscription(null);
        setMonthlyUsage(monthlyUsage + 1);
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to submit cancellation request');
      }
    } catch (error) {
      console.error('Error submitting cancellation request:', error);
      alert('Failed to submit request. Please try again.');
    }
  };

  if (!canUseCancelService) {
    return (
      <UpgradePrompt 
        feature="cancel-for-me service"
        limit="Professional cancellation service is exclusive to Business plan"
        inline={inline}
      />
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const statusColors = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    in_progress: 'bg-blue-100 text-blue-800 border-blue-200',
    completed: 'bg-green-100 text-green-800 border-green-200',
    failed: 'bg-red-100 text-red-800 border-red-200',
    cancelled: 'bg-gray-100 text-gray-800 border-gray-200'
  };

  const statusIcons = {
    pending: <Clock className="w-4 h-4" />,
    in_progress: <User className="w-4 h-4" />,
    completed: <CheckCircle className="w-4 h-4" />,
    failed: <XCircle className="w-4 h-4" />,
    cancelled: <XCircle className="w-4 h-4" />
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Phone className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-semibold text-foreground-black">Cancel-for-Me Service</h2>
          <div className="flex items-center gap-1 px-2 py-1 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 rounded-full text-xs">
            <Zap className="w-3 h-3" />
            Business Exclusive
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-sm text-muted-light">This Month</div>
          <div className="text-lg font-semibold text-foreground-black">
            {monthlyUsage}/{monthlyLimit} used
          </div>
        </div>
      </div>

      {/* Usage Status */}
      <div className="bg-gradient-to-br from-card-bg-start-light to-card-bg-end-light border border-border-light rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-foreground-black">Service Status</h3>
          <div className={`px-3 py-1 rounded-full text-sm ${
            monthlyUsage < monthlyLimit ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'
          }`}>
            {monthlyUsage < monthlyLimit ? 'Available' : 'Limit Reached'}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-background-light-mid/50 rounded-lg">
            <DollarSign className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <div className="font-semibold text-foreground-black">Free Cancellations</div>
            <div className="text-2xl font-bold text-green-600">{monthlyLimit - monthlyUsage}</div>
            <div className="text-sm text-muted-light">remaining this month</div>
          </div>
          
          <div className="text-center p-4 bg-background-light-mid/50 rounded-lg">
            <Clock className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <div className="font-semibold text-foreground-black">Avg. Time</div>
            <div className="text-2xl font-bold text-blue-600">24h</div>
            <div className="text-sm text-muted-light">to complete</div>
          </div>
          
          <div className="text-center p-4 bg-background-light-mid/50 rounded-lg">
            <Shield className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <div className="font-semibold text-foreground-black">Success Rate</div>
            <div className="text-2xl font-bold text-purple-600">98%</div>
            <div className="text-sm text-muted-light">cancellation success</div>
          </div>
        </div>
      </div>

      {/* How It Works */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-blue-800 mb-4">How Our Cancel-for-Me Service Works</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <MessageSquare className="w-6 h-6 text-blue-600" />
            </div>
            <h4 className="font-semibold text-blue-800 mb-2">1. Submit Request</h4>
            <p className="text-sm text-blue-700">Choose a subscription and provide basic details</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Phone className="w-6 h-6 text-blue-600" />
            </div>
            <h4 className="font-semibold text-blue-800 mb-2">2. We Handle It</h4>
            <p className="text-sm text-blue-700">Our team contacts the provider and handles the cancellation</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <CheckCircle className="w-6 h-6 text-blue-600" />
            </div>
            <h4 className="font-semibold text-blue-800 mb-2">3. Confirmation</h4>
            <p className="text-sm text-blue-700">Get confirmation and refund details if applicable</p>
          </div>
        </div>
      </div>

      {/* Request New Cancellation */}
      {monthlyUsage < monthlyLimit && subscriptions.length > 0 && (
        <div className="bg-gradient-to-br from-card-bg-start-light to-card-bg-end-light border border-border-light rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-foreground-black">Request Cancellation</h3>
            <button
              onClick={() => setShowRequestForm(true)}
              className="px-4 py-2 bg-gradient-to-r from-cta-start to-cta-end text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
            >
              New Request
            </button>
          </div>
          
          <p className="text-muted-light mb-4">
            Select a subscription you'd like our team to cancel for you. We'll handle all the communication with the provider.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {subscriptions.slice(0, 6).map((sub, index) => (
              <button
                key={index}
                onClick={() => {
                  setSelectedSubscription(sub);
                  setShowRequestForm(true);
                }}
                className="text-left p-3 border border-border-light rounded-lg hover:bg-card-hover-light transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="text-lg">{sub.provider_emoji || '💳'}</div>
                  <div>
                    <div className="font-medium text-foreground-black">{sub.name}</div>
                    <div className="text-sm text-muted-light">
                      ${sub.lastAmount || 0}/{sub.cadence || 'month'}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Current Requests */}
      <div className="bg-gradient-to-br from-card-bg-start-light to-card-bg-end-light border border-border-light rounded-xl p-6">
        <h3 className="text-lg font-semibold text-foreground-black mb-4">Your Cancellation Requests</h3>
        
        {requests.length === 0 ? (
          <div className="text-center py-8">
            <Phone className="w-16 h-16 text-muted-light mx-auto mb-4" />
            <h4 className="text-lg font-semibold text-foreground-black mb-2">No Requests Yet</h4>
            <p className="text-muted-light">
              Submit your first cancellation request and let our team handle the hassle for you.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {requests.map((request) => (
              <div key={request.id} className="border border-border-light rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="text-lg">💳</div>
                    <div>
                      <h4 className="font-semibold text-foreground-black">{request.subscription_name}</h4>
                      <div className="text-sm text-muted-light">
                        ${request.subscription_details.amount}/{request.subscription_details.billing_cycle}
                      </div>
                    </div>
                  </div>
                  
                  <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs border ${statusColors[request.status]}`}>
                    {statusIcons[request.status]}
                    {request.status.replace('_', ' ')}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-muted-light">Submitted:</span>
                    <div className="font-medium text-foreground-black">
                      {new Date(request.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  
                  {request.assigned_to && (
                    <div>
                      <span className="text-muted-light">Assigned to:</span>
                      <div className="font-medium text-foreground-black">{request.assigned_to}</div>
                    </div>
                  )}
                  
                  {request.estimated_completion && (
                    <div>
                      <span className="text-muted-light">Est. Completion:</span>
                      <div className="font-medium text-foreground-black">
                        {new Date(request.estimated_completion).toLocaleDateString()}
                      </div>
                    </div>
                  )}
                </div>
                
                {request.notes && (
                  <div className="mt-3 p-3 bg-background-light-mid/50 rounded-lg">
                    <div className="text-xs text-muted-light mb-1">Notes:</div>
                    <div className="text-sm text-foreground-black">{request.notes}</div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Request Form Modal */}
      {showRequestForm && (
        <CancellationRequestModal
          subscription={selectedSubscription}
          onSubmit={submitCancellationRequest}
          onCancel={() => {
            setShowRequestForm(false);
            setSelectedSubscription(null);
          }}
        />
      )}
    </div>
  );
}

interface CancellationRequestModalProps {
  subscription: any;
  onSubmit: (subscription: any, priority: 'normal' | 'urgent') => void;
  onCancel: () => void;
}

function CancellationRequestModal({ subscription, onSubmit, onCancel }: CancellationRequestModalProps) {
  const [priority, setPriority] = useState<'normal' | 'urgent'>('normal');
  const [additionalInfo, setAdditionalInfo] = useState('');

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background-light rounded-xl p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold text-foreground-black mb-4">
          Request Cancellation
        </h3>
        
        {subscription && (
          <div className="bg-background-light-mid/50 rounded-lg p-4 mb-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="text-lg">{subscription.provider_emoji || '💳'}</div>
              <div>
                <div className="font-medium text-foreground-black">{subscription.name}</div>
                <div className="text-sm text-muted-light">
                  ${subscription.lastAmount || 0}/{subscription.cadence || 'month'}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground-black mb-2">
              Priority Level
            </label>
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="priority"
                  value="normal"
                  checked={priority === 'normal'}
                  onChange={(e) => setPriority(e.target.value as 'normal')}
                  className="w-4 h-4 text-primary focus:ring-primary border-border-light"
                />
                <span className="text-foreground-black">Normal (24-48 hours)</span>
              </label>
              
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="priority"
                  value="urgent"
                  checked={priority === 'urgent'}
                  onChange={(e) => setPriority(e.target.value as 'urgent')}
                  className="w-4 h-4 text-primary focus:ring-primary border-border-light"
                />
                <span className="text-foreground-black">Urgent (Same day - $10 fee)</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground-black mb-2">
              Additional Information (Optional)
            </label>
            <textarea
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              className="w-full px-3 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              rows={3}
              placeholder="Any specific instructions or account details..."
            />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-blue-700">
                <strong>What happens next:</strong>
                <ul className="mt-1 space-y-1">
                  <li>• Our team will contact the service provider</li>
                  <li>• You'll receive updates via email</li>
                  <li>• We'll confirm the cancellation and any refunds</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-3 pt-6">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-2 border border-border-light text-foreground-black rounded-lg hover:bg-card-hover-light transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => subscription && onSubmit(subscription, priority)}
            className="flex-1 px-4 py-2 bg-gradient-to-r from-cta-start to-cta-end text-white rounded-lg hover:opacity-90 transition-opacity"
          >
            Submit Request
          </button>
        </div>
      </div>
    </div>
  );
}
