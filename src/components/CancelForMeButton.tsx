"use client";
import { useState } from 'react';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { UserX, Clock, CheckCircle, AlertTriangle, Crown } from 'lucide-react';

interface CancelForMeButtonProps {
  subscriptionName: string;
  subscriptionDetails?: any;
  onSuccess?: () => void;
}

export default function CancelForMeButton({ 
  subscriptionName, 
  subscriptionDetails,
  onSuccess 
}: CancelForMeButtonProps) {
  const { plan, usage, isFeatureAllowed } = useSubscription();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    urgency: 'normal',
    notes: '',
  });

  const canUseService = isFeatureAllowed('cancel_service');
  const remainingRequests = (plan?.limits as any)?.cancelService ? 
    Math.max(0, (plan?.limits as any)?.cancelService - (usage?.cancellation_requests || 0)) : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/cancellation/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subscriptionName,
          subscriptionDetails,
          urgency: formData.urgency,
          notes: formData.notes,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.upgradeRequired) {
          setError('Cancel-for-me service requires Business plan. Upgrade to unlock this feature.');
        } else if (result.limitReached) {
          setError(result.error);
        } else {
          setError(result.error || 'Failed to submit cancellation request');
        }
        return;
      }

      setSuccess(true);
      onSuccess?.();
      
      // Close modal after 2 seconds
      setTimeout(() => {
        setIsOpen(false);
        setSuccess(false);
      }, 2000);
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!canUseService) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-colors text-sm font-medium"
      >
        <Crown className="w-4 h-4" />
        <span>Cancel For Me</span>
      </button>
    );
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-colors text-sm font-medium"
        disabled={remainingRequests === 0}
      >
        <UserX className="w-4 h-4" />
        <span>Cancel For Me</span>
        {remainingRequests > 0 && (
          <span className="bg-white/20 text-xs px-2 py-1 rounded-full">
            {remainingRequests} left
          </span>
        )}
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-background border border-border rounded-2xl max-w-md w-full p-6">
            
            {success ? (
              // Success State
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Request Submitted Successfully!
                </h3>
                <p className="text-muted text-sm">
                  Our team will handle canceling your {subscriptionName} subscription within 24 hours.
                </p>
              </div>
            ) : (
              // Form State
              <>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-foreground">Cancel For Me Service</h3>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="text-muted hover:text-foreground transition-colors"
                  >
                    ✕
                  </button>
                </div>

                {!canUseService ? (
                  <div className="text-center py-8">
                    <Crown className="w-16 h-16 text-purple-500 mx-auto mb-4" />
                    <h4 className="text-lg font-semibold text-foreground mb-2">
                      Business Plan Required
                    </h4>
                    <p className="text-muted mb-6">
                      Upgrade to Business plan to use our Cancel-for-Me service where our team handles cancellations for you.
                    </p>
                    <button className="w-full bg-gradient-to-r from-cta-start to-cta-end text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity">
                      Upgrade to Business
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Subscription to Cancel
                      </label>
                      <div className="p-3 bg-card rounded-lg border border-border">
                        <span className="font-medium text-foreground">{subscriptionName}</span>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Urgency Level
                      </label>
                      <select
                        value={formData.urgency}
                        onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                        className="w-full p-3 bg-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      >
                        <option value="low">Low - 48 hours</option>
                        <option value="normal">Normal - 24 hours</option>
                        <option value="high">High - 8 hours</option>
                        <option value="urgent">Urgent - 4 hours</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">
                        Additional Notes (Optional)
                      </label>
                      <textarea
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        placeholder="Any specific instructions or account details that might help..."
                        className="w-full p-3 bg-background border border-border rounded-lg text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                        rows={3}
                      />
                    </div>

                    {error && (
                      <div className="flex items-start space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                        <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-red-700">{error}</p>
                      </div>
                    )}

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <div className="flex items-start space-x-2">
                        <Clock className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                        <div className="text-sm text-blue-700">
                          <p className="font-medium mb-1">How it works:</p>
                          <ul className="text-xs space-y-1">
                            <li>• Our team will contact the service provider on your behalf</li>
                            <li>• We&apos;ll handle all the cancellation steps and requirements</li>
                            <li>• You&apos;ll receive updates via email throughout the process</li>
                            <li>• Most cancellations complete within 24 hours</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-3">
                      <button
                        type="button"
                        onClick={() => setIsOpen(false)}
                        className="flex-1 px-4 py-3 border border-border text-foreground rounded-lg hover:bg-card transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={loading || remainingRequests === 0}
                        className="flex-1 px-4 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {loading ? 'Submitting...' : 'Submit Request'}
                      </button>
                    </div>

                    {remainingRequests > 0 && (
                      <p className="text-xs text-center text-muted">
                        {remainingRequests} cancellation requests remaining this month
                      </p>
                    )}
                  </form>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
