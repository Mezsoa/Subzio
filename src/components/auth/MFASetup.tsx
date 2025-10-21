"use client";
import { useState } from "react";
import { Shield, QrCode, Smartphone, CheckCircle, AlertCircle } from "lucide-react";

interface MFASetupProps {
  onComplete?: () => void;
  onCancel?: () => void;
}

export default function MFASetup({ onComplete, onCancel }: MFASetupProps) {
  const [step, setStep] = useState<'init' | 'verify' | 'complete'>('init');
  const [qrCode, setQrCode] = useState<string>('');
  const [secret, setSecret] = useState<string>('');
  const [verificationCode, setVerificationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const initiateMFA = async () => {
    setLoading(true);
    setError('');
    
    try {
      const response = await fetch('/api/user/enable-mfa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        setQrCode(data.qrCode);
        setSecret(data.secret);
        setStep('verify');
      } else {
        setError(data.message || 'Failed to initiate MFA setup');
      }
    } catch (err) {
      setError('An error occurred while setting up MFA');
    } finally {
      setLoading(false);
    }
  };

  const verifyMFA = async () => {
    if (!verificationCode.trim()) {
      setError('Please enter the verification code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/user/enable-mfa', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: verificationCode }),
      });

      const data = await response.json();

      if (response.ok) {
        setStep('complete');
        onComplete?.();
      } else {
        setError(data.message || 'Invalid verification code');
      }
    } catch (err) {
      setError('An error occurred while verifying MFA');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'init') {
    return (
      <div className="max-w-md mx-auto p-6 bg-card border border-border rounded-xl">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">Enable Two-Factor Authentication</h2>
          <p className="text-muted">
            Add an extra layer of security to your account by enabling two-factor authentication.
          </p>
        </div>

        <div className="mt-6 space-y-4">
          <div className="flex items-start space-x-3">
            <Smartphone className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <h3 className="font-medium text-foreground">Download an Authenticator App</h3>
              <p className="text-sm text-muted">
                We recommend Google Authenticator, Authy, or Microsoft Authenticator.
              </p>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <QrCode className="w-5 h-5 text-primary mt-0.5" />
            <div>
              <h3 className="font-medium text-foreground">Scan QR Code</h3>
              <p className="text-sm text-muted">
                You'll scan a QR code with your authenticator app to set up MFA.
              </p>
            </div>
          </div>
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-red-500" />
            <span className="text-sm text-red-700">{error}</span>
          </div>
        )}

        <div className="mt-6 flex space-x-3">
          <button
            onClick={initiateMFA}
            disabled={loading}
            className="flex-1 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Setting up...' : 'Enable MFA'}
          </button>
          {onCancel && (
            <button
              onClick={onCancel}
              className="px-4 py-2 border border-border text-foreground rounded-lg hover:bg-muted/50"
            >
              Cancel
            </button>
          )}
        </div>
      </div>
    );
  }

  if (step === 'verify') {
    return (
      <div className="max-w-md mx-auto p-6 bg-card border border-border rounded-xl">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
            <QrCode className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">Scan QR Code</h2>
          <p className="text-muted">
            Scan this QR code with your authenticator app, then enter the verification code below.
          </p>
        </div>

        {qrCode && (
          <div className="mt-6 flex justify-center">
            <div className="p-4 bg-white rounded-lg">
              <img src={qrCode} alt="MFA QR Code" className="w-48 h-48" />
            </div>
          </div>
        )}

        <div className="mt-6">
          <label className="block text-sm font-medium text-foreground mb-2">
            Verification Code
          </label>
          <input
            type="text"
            value={verificationCode}
            onChange={(e) => setVerificationCode(e.target.value)}
            placeholder="Enter 6-digit code"
            className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
            maxLength={6}
          />
        </div>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 text-red-500" />
            <span className="text-sm text-red-700">{error}</span>
          </div>
        )}

        <div className="mt-6 flex space-x-3">
          <button
            onClick={verifyMFA}
            disabled={loading || !verificationCode.trim()}
            className="flex-1 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Verifying...' : 'Verify & Enable'}
          </button>
          <button
            onClick={() => setStep('init')}
            className="px-4 py-2 border border-border text-foreground rounded-lg hover:bg-muted/50"
          >
            Back
          </button>
        </div>
      </div>
    );
  }

  if (step === 'complete') {
    return (
      <div className="max-w-md mx-auto p-6 bg-card border border-border rounded-xl">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">MFA Enabled Successfully!</h2>
          <p className="text-muted">
            Two-factor authentication has been enabled for your account. You'll now need to enter a verification code when signing in.
          </p>
        </div>

        <div className="mt-6">
          <button
            onClick={onComplete}
            className="w-full bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90"
          >
            Continue
          </button>
        </div>
      </div>
    );
  }

  return null;
}
