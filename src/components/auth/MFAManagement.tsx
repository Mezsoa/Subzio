"use client";
import { useState, useEffect } from "react";
import { Shield, Smartphone, AlertTriangle, CheckCircle } from "lucide-react";

interface MFAManagementProps {
  onMFAChange?: (enabled: boolean) => void;
}

export default function MFAManagement({ onMFAChange }: MFAManagementProps) {
  const [mfaEnabled, setMfaEnabled] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [showSetup, setShowSetup] = useState(false);

  useEffect(() => {
    checkMFAStatus();
  }, []);

  const checkMFAStatus = async () => {
    try {
      // This would typically check the user's MFA status
      // For now, we'll assume it's not enabled
      setMfaEnabled(false);
    } catch (err) {
      console.error('Error checking MFA status:', err);
    }
  };

  const disableMFA = async () => {
    if (!confirm('Are you sure you want to disable two-factor authentication? This will make your account less secure.')) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/user/enable-mfa', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        setMfaEnabled(false);
        onMFAChange?.(false);
      } else {
        setError(data.message || 'Failed to disable MFA');
      }
    } catch (err) {
      setError('An error occurred while disabling MFA');
    } finally {
      setLoading(false);
    }
  };

  if (showSetup) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Two-Factor Authentication</h3>
          <button
            onClick={() => setShowSetup(false)}
            className="text-sm text-muted hover:text-foreground"
          >
            Cancel
          </button>
        </div>
        <div className="p-4 bg-muted/50 rounded-lg">
          <p className="text-sm text-muted">
            MFA setup component would be rendered here. This is a placeholder for the actual setup flow.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Two-Factor Authentication</h3>
        {mfaEnabled ? (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-3 h-3 mr-1" />
            Enabled
          </span>
        ) : (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <AlertTriangle className="w-3 h-3 mr-1" />
            Disabled
          </span>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex items-start space-x-3">
          <Shield className="w-5 h-5 text-primary mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-muted">
              {mfaEnabled 
                ? 'Two-factor authentication is enabled. Your account is protected with an additional security layer.'
                : 'Add an extra layer of security to your account by enabling two-factor authentication.'
              }
            </p>
          </div>
        </div>

        {mfaEnabled && (
          <div className="flex items-start space-x-3">
            <Smartphone className="w-5 h-5 text-primary mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-muted">
                You'll need to enter a verification code from your authenticator app when signing in.
              </p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
          <AlertTriangle className="w-4 h-4 text-red-500" />
          <span className="text-sm text-red-700">{error}</span>
        </div>
      )}

      <div className="flex space-x-3">
        {mfaEnabled ? (
          <button
            onClick={disableMFA}
            disabled={loading}
            className="px-4 py-2 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Disabling...' : 'Disable MFA'}
          </button>
        ) : (
          <button
            onClick={() => setShowSetup(true)}
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
          >
            Enable MFA
          </button>
        )}
      </div>
    </div>
  );
}
