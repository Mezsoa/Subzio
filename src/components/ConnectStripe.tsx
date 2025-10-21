"use client";
import { useState, useEffect, useCallback } from "react";
import { authedFetch, AuthError } from "@/lib/authedFetch";
import { useErrorNotifications } from "@/contexts/ErrorContext";
import { useErrorHandler } from "@/hooks/useErrorHandler";

export default function ConnectStripe() {
  const [loading, setLoading] = useState(false);
  const [sessionReady, setSessionReady] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const { showError, showSuccess } = useErrorNotifications();
  const { handleApiError } = useErrorHandler();

  const checkStripeStatus = useCallback(async () => {
    try {
      const res = await authedFetch("/api/stripe/connect/status");
      if (res.ok) {
        const data = await res.json();
        setIsConnected(data.connected);
      }
    } catch {
      // Ignore errors for status check
    }
  }, []);

  useEffect(() => {
    setMounted(true);
    (async () => {
      try {
        const { supabaseBrowser } = await import("@/lib/supabaseClient");
        const sb = supabaseBrowser();
        const { data } = await sb.auth.getSession();
        setSessionReady(!!data.session);
        const { data: sub } = sb.auth.onAuthStateChange((_evt, session) => {
          setSessionReady(!!session);
        });
        return () => sub.subscription.unsubscribe();
      } catch {}
    })();
    // Note: stripe_success handling moved to success page
    // The callback now redirects directly to /stripe/success?connected=true
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("stripe_refresh") === "true") {
      showError("Please complete your stripe account setup");
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    if (urlParams.get("stripe_error")) {
      const errorType = urlParams.get("stripe_error");
      let errorMessage = "Failed to connect Stripe account";
      if (errorType === "missing_params") {
        errorMessage = "Missing required parameters for Stripe connection";
      } else if (errorType === "callback_failed") {
        errorMessage = "Stripe connection callback failed";
      } else if (errorType === "account_already_connected") {
        errorMessage = "This Stripe account is already connected to another user";
      } else if (errorType === "database_error") {
        errorMessage = "Database error occurred during Stripe connection";
      }
      showError(errorMessage);
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    // Check if user already has Stripe connected
    checkStripeStatus();
  }, [showSuccess, showError, checkStripeStatus]);

  const handleConnectStripe = async () => {
    if (!sessionReady) {
      showError("Please sign in to connect your Stripe account");
      return;
    }

    setLoading(true);
    try {
      // Refresh session before starting OAuth flow
      const { supabaseBrowser } = await import("@/lib/supabaseClient");
      const sb = supabaseBrowser();
      const { data: { session } } = await sb.auth.getSession();
      
      if (!session) {
        showError("Your session has expired. Please sign in again.");
        return;
      }

      const res = await authedFetch("/api/stripe/connect", {
        method: "POST",
        headers: { "content-type": "application/json" },
      });

      if (!res.ok) {
        const text = await res.text();
        throw new AuthError(text || "Failed to create Stripe OAuth URL");
      }

      const { oauthUrl } = await res.json();

      // Redirect to Stripe OAuth
      window.location.href = oauthUrl;
    } catch (e) {
      const msg =
        e instanceof Error ? e.message : "Failed to connect Stripe account";
      showError(msg);
      handleApiError(e, "Stripe Connect");
    } finally {
      setLoading(false);
    }
  };

  if (!mounted) return null;

  const handleDisconnectStripe = async () => {
    if (!sessionReady) {
      showError("Please sign in to disconnect your Stripe account");
      return;
    }

    setLoading(true);
    try {
      const res = await authedFetch("/api/stripe/disconnect", {
        method: "POST",
        headers: { "content-type": "application/json" },
      });

      if (!res.ok) {
        const text = await res.text();
        throw new AuthError(text || "Failed to disconnect Stripe account");
      }

      const data = await res.json();
      showSuccess(data.message || "Stripe account disconnected successfully");
      setIsConnected(false);
    } catch (e) {
      const msg =
        e instanceof Error ? e.message : "Failed to disconnect Stripe account";
      showError(msg);
      handleApiError(e, "Stripe Disconnect");
    } finally {
      setLoading(false);
    }
  };

  if (isConnected) {
    return (
      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Stripe Account Connected
          </h3>
          <p className="text-sm text-gray-600">
            Your Stripe account is ready to accept payments
          </p>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <div>
              <div className="font-medium text-green-900">Connected</div>
              <div className="text-sm text-green-700">
                Ready to accept payments
              </div>
            </div>
          </div>
        </div>

        {/* Disconnect Button */}
        <button
          onClick={handleDisconnectStripe}
          disabled={!sessionReady || loading}
          className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-red-700 bg-red-50 border border-red-200 rounded-lg hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
          {loading && (
            <div className="w-4 h-4 border-2 border-red-300 border-t-red-600 rounded-full animate-spin"></div>
          )}
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          Disconnect Stripe Account
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto mt-4">
      {/* Header 
      <div className="text-center mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Connect Your Stripe Account</h3>
        <p className="text-sm text-gray-600">Start accepting payments through killsub</p>
      </div>
    */}
      {/* Stripe Connect Button */}
      <button
        onClick={handleConnectStripe}
        disabled={!sessionReady || loading}
        className="w-full group relative overflow-hidden bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 hover:shadow-sm transition-all duration-200 disabled:opacity-50 cursor-pointer">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-50 rounded-lg flex items-center justify-center">
              <svg
                className="w-5 h-5 text-purple-600"
                fill="currentColor"
                viewBox="0 0 24 24">
                <path d="M13.976 9.15c-2.172-.806-3.356-1.426-3.356-2.409 0-.831.683-1.305 1.901-1.305 2.227 0 4.515.858 6.09 1.631l.89-5.494C18.252.274 15.697 0 12.165 0 9.667 0 7.589.654 6.104 1.872 4.56 3.147 3.757 4.992 3.757 7.218c0 4.039 2.467 5.76 6.476 7.219 2.585.92 3.445 1.574 3.445 2.583 0 .98-.84 1.573-2.354 1.573-1.875 0-4.965-.921-6.99-2.109l-.9 5.555C5.175 22.99 8.385 24 11.714 24c2.641 0 4.843-.624 6.328-1.813 1.664-1.305 2.525-3.236 2.525-5.732 0-4.128-2.524-5.851-6.591-7.305z" />
              </svg>
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900 text-sm">
                Connect with Stripe
              </p>
              <p className="text-sm text-gray-500">
                Accept payments & manage payouts
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {loading && (
              <div className="w-4 h-4 border-2 border-gray-300 border-t-purple-600 rounded-full animate-spin"></div>
            )}
          </div>
          <div className="flex items-center space-x-2 text-sm absolute right-1 top-3">
            <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
              Recommended
            </span>
            <svg
              className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
      </button>

      {/* Security Notice */}
      <div className="mt-6 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-start space-x-2">
          <svg
            className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          <div className="text-xs text-gray-600">
            <p className="font-medium mb-1">Bank-level security</p>
            <p>
              Your Stripe account is managed securely with bank-level
              encryption. Data is encrypted and never stored permanently.
              Read-only access only.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
