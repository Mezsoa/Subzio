"use client";
import { useState, useEffect } from 'react';
import { useSubscription } from '@/contexts/SubscriptionContext';
import { isFeatureAllowed, PlanId } from '@/lib/stripe';
import { 
  Bell, 
  Plus, 
  Trash2, 
  Edit3, 
  DollarSign, 
  Calendar, 
  TrendingUp,
  AlertTriangle,
  Check
} from 'lucide-react';
import UpgradePrompt from './UpgradePrompt';

interface Alert {
  id: string;
  name: string;
  type: 'spending_limit' | 'new_subscription' | 'price_increase' | 'cancellation_reminder';
  condition: {
    threshold?: number;
    period?: 'daily' | 'weekly' | 'monthly';
    comparison?: 'greater_than' | 'less_than' | 'equal_to';
  };
  enabled: boolean;
  created_at: string;
}

interface AlertsManagerProps {
  inline?: boolean;
}

export default function AlertsManager({ inline = false }: AlertsManagerProps) {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingAlert, setEditingAlert] = useState<Alert | null>(null);
  const [loading, setLoading] = useState(true);
  const { plan, loading: planLoading } = useSubscription();

  const canUseCustomAlerts = isFeatureAllowed(plan?.id || 'free', 'custom_alerts');

  useEffect(() => {
    if (canUseCustomAlerts) {
      fetchAlerts();
    } else {
      setLoading(false);
    }
  }, [canUseCustomAlerts]);

  const fetchAlerts = async () => {
    try {
      // Import supabase client for direct database access
      const { supabaseBrowser } = await import('@/lib/supabaseClient');
      const supabase = supabaseBrowser();
      
      // Get current user
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        console.error('❌ Not authenticated:', authError);
        setLoading(false);
        return;
      }
      
      // Fetch alerts directly via Supabase client
      const { data: alerts, error } = await supabase
        .from('alerts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ Error fetching alerts:', error);
      } else {
        setAlerts(alerts || []);
      }
    } catch (error) {
      console.error('❌ Network error fetching alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  const createAlert = async (alertData: Omit<Alert, 'id' | 'created_at'>) => {
    try {
      console.log('🔍 Creating alert with data:', alertData);
      
      // Import supabase client for direct database access
      const { supabaseBrowser } = await import('@/lib/supabaseClient');
      const supabase = supabaseBrowser();
      
      // Get current user
      const { data: { user }, error: authError } = await supabase.auth.getUser();
      
      if (authError || !user) {
        console.error('❌ Not authenticated:', authError);
        alert('Please log in to create alerts');
        return;
      }
      
      // Create alert directly via Supabase client
      const { data: newAlert, error } = await supabase
        .from('alerts')
        .insert({
          user_id: user.id,
          name: alertData.name,
          type: alertData.type,
          condition: alertData.condition,
          enabled: alertData.enabled ?? true,
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Error creating alert:', error);
        alert(`Failed to create alert: ${error.message}`);
      } else {
        console.log('✅ Alert created successfully:', newAlert);
        setAlerts([...alerts, newAlert]);
        setShowCreateForm(false);
      }
    } catch (error) {
      console.error('❌ Network error creating alert:', error);
      alert('Network error creating alert');
    }
  };

  const updateAlert = async (id: string, updates: Partial<Alert>) => {
    try {
      const response = await fetch(`/api/alerts/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (response.ok) {
        const updatedAlert = await response.json();
        setAlerts(alerts.map(alert => alert.id === id ? updatedAlert : alert));
        setEditingAlert(null);
      }
    } catch (error) {
      console.error('Error updating alert:', error);
    }
  };

  const deleteAlert = async (id: string) => {
    try {
      const response = await fetch(`/api/alerts/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setAlerts(alerts.filter(alert => alert.id !== id));
      }
    } catch (error) {
      console.error('Error deleting alert:', error);
    }
  };

  // Show loading while plan data is being fetched
  if (planLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-light">Loading subscription plan...</p>
        </div>
      </div>
    );
  }

  // Debug info
  console.log('AlertsManager - Plan:', plan, 'Can use alerts:', canUseCustomAlerts);

  if (!canUseCustomAlerts) {
    return (
      <div className="space-y-6">
        {/* Show some basic content even for free users */}
        <div className="bg-gradient-to-br from-card-bg-start-light to-card-bg-end-light border border-border-light rounded-xl p-6">
          <div className="text-center py-8">
            <Bell className="w-16 h-16 text-muted-light mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground-black mb-2">Custom Alerts</h3>
            <p className="text-muted-light mb-6">
              Get notified about spending limits, new subscriptions, and price changes.
            </p>
          </div>
        </div>
        
        <UpgradePrompt 
          feature="custom alerts and notifications"
          limit="Free plan only includes basic notifications"
          inline={inline}
        />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const alertTypeIcons = {
    spending_limit: <DollarSign className="w-5 h-5" />,
    new_subscription: <Plus className="w-5 h-5" />,
    price_increase: <TrendingUp className="w-5 h-5" />,
    cancellation_reminder: <Calendar className="w-5 h-5" />
  };

  const alertTypeNames = {
    spending_limit: 'Spending Limit',
    new_subscription: 'New Subscription',
    price_increase: 'Price Increase',
    cancellation_reminder: 'Cancellation Reminder'
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bell className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-semibold text-foreground-black">Custom Alerts</h2>
        </div>
        <button
          onClick={() => setShowCreateForm(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cta-start to-cta-end text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
        >
          <Plus className="w-4 h-4" />
          New Alert
        </button>
      </div>

      {/* Alerts List */}
      {alerts.length === 0 ? (
        <div className="text-center py-12 bg-gradient-to-br from-card-bg-start-light to-card-bg-end-light rounded-xl border border-border-light">
          <Bell className="w-16 h-16 text-muted-light mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground-black mb-2">No Custom Alerts Yet</h3>
          <p className="text-muted-light mb-4">
            Create alerts to stay informed about your subscription spending and changes.
          </p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="px-6 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Create Your First Alert
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className="bg-gradient-to-br from-card-bg-start-light to-card-bg-end-light border border-border-light rounded-xl p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    alert.enabled ? 'bg-primary/10 text-primary' : 'bg-muted-light/10 text-muted-light'
                  }`}>
                    {alertTypeIcons[alert.type]}
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground-black">{alert.name}</h3>
                    <p className="text-sm text-muted-light">{alertTypeNames[alert.type]}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                    alert.enabled 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {alert.enabled ? (
                      <>
                        <Check className="w-3 h-3" />
                        Active
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-3 h-3" />
                        Inactive
                      </>
                    )}
                  </div>
                  
                  <button
                    onClick={() => setEditingAlert(alert)}
                    className="p-2 text-muted-light hover:text-primary transition-colors"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  
                  <button
                    onClick={() => deleteAlert(alert.id)}
                    className="p-2 text-muted-light hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Alert Condition Display */}
              <div className="bg-background-light-mid/50 rounded-lg p-3">
                <p className="text-sm text-foreground-black">
                  {alert.type === 'spending_limit' && (
                    <>Alert when {alert.condition.period} spending exceeds <span className="font-semibold">${alert.condition.threshold}</span></>
                  )}
                  {alert.type === 'new_subscription' && (
                    <>Alert when a new subscription is detected</>
                  )}
                  {alert.type === 'price_increase' && (
                    <>Alert when any subscription price increases by more than <span className="font-semibold">${alert.condition.threshold}</span></>
                  )}
                  {alert.type === 'cancellation_reminder' && (
                    <>Remind me to review subscriptions every <span className="font-semibold">{alert.condition.period}</span></>
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Alert Modal */}
      {(showCreateForm || editingAlert) && (
        <AlertFormModal
          alert={editingAlert}
          onSave={editingAlert ? 
            (updates) => updateAlert(editingAlert.id, updates) : 
            createAlert
          }
          onCancel={() => {
            setShowCreateForm(false);
            setEditingAlert(null);
          }}
        />
      )}
    </div>
  );
}

interface AlertFormModalProps {
  alert?: Alert | null;
  onSave: (alertData: any) => void;
  onCancel: () => void;
}

function AlertFormModal({ alert, onSave, onCancel }: AlertFormModalProps) {
  const [formData, setFormData] = useState({
    name: alert?.name || '',
    type: alert?.type || 'spending_limit' as Alert['type'],
    threshold: alert?.condition.threshold || 100,
    period: alert?.condition.period || 'monthly' as Alert['condition']['period'],
    enabled: alert?.enabled ?? true,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      name: formData.name,
      type: formData.type,
      condition: {
        threshold: formData.threshold,
        period: formData.period,
        comparison: 'greater_than',
      },
      enabled: formData.enabled,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background-light rounded-xl p-6 w-full max-w-md">
        <h3 className="text-lg font-semibold text-foreground-black mb-4">
          {alert ? 'Edit Alert' : 'Create New Alert'}
        </h3>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground-black mb-2">
              Alert Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="My Custom Alert"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground-black mb-2">
              Alert Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value as Alert['type'] })}
              className="w-full px-3 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            >
              <option value="spending_limit">Spending Limit</option>
              <option value="new_subscription">New Subscription</option>
              <option value="price_increase">Price Increase</option>
              <option value="cancellation_reminder">Cancellation Reminder</option>
            </select>
          </div>

          {(formData.type === 'spending_limit' || formData.type === 'price_increase') && (
            <div>
              <label className="block text-sm font-medium text-foreground-black mb-2">
                Threshold Amount ($)
              </label>
              <input
                type="number"
                value={formData.threshold}
                onChange={(e) => setFormData({ ...formData, threshold: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                min="0"
                step="0.01"
                required
              />
            </div>
          )}

          {(formData.type === 'spending_limit' || formData.type === 'cancellation_reminder') && (
            <div>
              <label className="block text-sm font-medium text-foreground-black mb-2">
                Period
              </label>
              <select
                value={formData.period}
                onChange={(e) => setFormData({ ...formData, period: e.target.value as Alert['condition']['period'] })}
                className="w-full px-3 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </div>
          )}

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="enabled"
              checked={formData.enabled}
              onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
              className="w-4 h-4 text-primary focus:ring-primary border-border-light rounded"
            />
            <label htmlFor="enabled" className="text-sm text-foreground-black">
              Enable this alert
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-2 border border-border-light text-foreground-black rounded-lg hover:bg-card-hover-light transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-gradient-to-r from-cta-start to-cta-end text-white rounded-lg hover:opacity-90 transition-opacity"
            >
              {alert ? 'Update' : 'Create'} Alert
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
