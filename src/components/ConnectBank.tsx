"use client";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authedFetch, AuthError } from "@/lib/authedFetch";
import { usePlaidLink } from "react-plaid-link";
import type { PlaidLinkError } from "react-plaid-link";
import { useErrorNotifications } from "@/contexts/ErrorContext";
import { useErrorHandler } from "@/hooks/useErrorHandler";

async function fetchLinkToken(): Promise<string> {
  const res = await fetch("/api/plaid/link-token");
  if (!res.ok) throw new Error("Failed to create link token");
  const data = await res.json();
  return data.link_token as string;
}

export default function ConnectBank() {
  const [linkToken, setLinkToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [sessionReady, setSessionReady] = useState(false);
  const [mounted, setMounted] = useState(false);
  const router = useRouter();
  const { showError, showSuccess } = useErrorNotifications();
  const { handleApiError, clearError } = useErrorHandler();

  
  useEffect(() => {
    setMounted(true);
    fetchLinkToken()
      .then(setLinkToken)
      .catch((e) => {
        setError(e.message);
        handleApiError(e, "Plaid link token creation");
      });
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
  }, []);

  const onSuccess = useCallback(
    async (public_token: string) => {
      console.log("[Plaid] Link onSuccess", {
        public_token: public_token?.slice?.(0, 12) + "…",
      });
      try {
        // Ensure we send Authorization: Bearer for server fallback
        const res = await authedFetch("/api/plaid/exchange", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ public_token }),
        });
        if (!res.ok) {
          const text = await res.text();
          throw new AuthError(text || "Exchange failed");
        }
        console.log("[Plaid] Exchange completed OK");
        showSuccess("Bank account connected successfully!", "Connection Successful");
        // Navigate to dashboard after successful link
        router.replace("/dashboard");
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Exchange failed";
        setError(msg);
        handleApiError(e, "Plaid bank connection");
      }
    },
    [router]
  );

  const config = {
    token: linkToken || "",
    onSuccess,
    onExit: (err: PlaidLinkError | null) => {
      if (err) {
        setError(err.error_message || "Exited Plaid Link");
        handleApiError(new Error(err.error_message || "Exited Plaid Link"), "Plaid Link exit");
      }
    },
  } as const;

  // Only initialize Plaid Link when component is mounted and has a token
  const shouldInitialize = mounted && linkToken;
  const { open, ready } = usePlaidLink(
    shouldInitialize
      ? config
      : { token: "", onSuccess: () => {}, onExit: () => {} }
  );

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Connect Your Bank</h3>
        <p className="text-sm text-gray-600">Choose your preferred connection method</p>
      </div>



      {/* Connection Options */}
      <div className="space-y-3">
        {/* BankID Option */}
        <button
          onClick={async () => {
            try {
              const { supabaseBrowser } = await import("@/lib/supabaseClient");
              const sb = supabaseBrowser();
              const { data: { session } } = await sb.auth.getSession();
              if (!session) {
                setError("Please sign in again, then retry!");
                return;
              }
              const res = await authedFetch("/api/bankid/link");
              if (!res.ok) {
                let message = "Failed to start BankID";
                const ct = res.headers.get("content-type") || "";
                try {
                  if (ct.includes("application/json")) {
                    const data = await res.json();
                    const detail = (data && (data.error || JSON.stringify(data))) || "";
                    if (detail) message = `${message}: ${detail}`;
                  } else {
                    const text = await res.clone().text();
                    if (text) message = `${message}: ${text}`;
                  }
                } catch {}
                throw new Error(message);
              }
              const { url } = await res.json();
              window.location.href = url;
            } catch (e) {
              const msg = e instanceof Error ? e.message : "Failed to start BankID";
              setError(msg);
              handleApiError(e, "BankID connection");
            }
          }}
          disabled={!sessionReady}
          className="w-full group relative overflow-hidden bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 hover:shadow-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-left">
                <div className="font-medium text-gray-900">BankID</div>
                <div className="text-sm text-gray-500">Swedish bank connection</div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">Recommended</span>
              <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </button>

        {/* Plaid Option */}
        <button
          onClick={() => open()}
          disabled={!shouldInitialize || !ready}
          className="w-full group relative overflow-hidden bg-white border border-gray-200 rounded-lg p-4 hover:border-gray-300 hover:shadow-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <div className="text-left">
                <div className="font-medium text-gray-900">Plaid</div>
                <div className="text-sm text-gray-500">International bank connection</div>
              </div>
            </div>
            <svg className="w-4 h-4 text-gray-400 group-hover:text-gray-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </button>
      </div>

      {/* Loading States */}
      {(!shouldInitialize || !sessionReady) && (
        <div className="mt-4 text-center">
          <div className="inline-flex items-center space-x-2 text-sm text-gray-500">
            <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
            <span>Initializing connections...</span>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <svg className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {/* Security Notice */}
      <div className="mt-6 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-start space-x-2">
          <svg className="w-4 h-4 text-gray-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <div className="text-xs text-gray-600">
            <p className="font-medium mb-1">Bank-level security</p>
            <p>Your data is encrypted and never stored permanently. Read-only access only.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
