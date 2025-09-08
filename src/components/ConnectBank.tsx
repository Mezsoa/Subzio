"use client";
import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authedFetch, AuthError } from "@/lib/authedFetch";
import { usePlaidLink } from "react-plaid-link";
import type { PlaidLinkError } from "react-plaid-link";
import bubbleArrow from "public/icons/bubbleArrow.png";
import Image from "next/image";
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
    <div className="flex flex-col items-end gap-1 w-[350px]">
      <button
        onClick={() => open()}
        disabled={!shouldInitialize || !ready}
        className="px-2 py-2 rounded-md text-sm bg-gradient-to-r from-black/40 via-black/20 to-white/70 text-foreground-black shadow w-1/2 hover:brightness-110 hover:bg-black/50 hover:text-white transition-all duration-500 disabled:opacity-50 cursor-pointer w-[150px]">
        {!shouldInitialize ? (
          "Loading..."
        ) : (
          <span className="flex items-center gap-1">
            Connect
            <Image
              src={bubbleArrow}
              alt="→"
              width={12}
              height={12}
              className="inline"
            />
            Plaid
          </span>
        )}
      </button>
      <button
        onClick={async () => {
          try {
            // Pass Supabase session token as Bearer to help API identify user
            const { supabaseBrowser } = await import("@/lib/supabaseClient");
            const sb = supabaseBrowser();
            const {
              data: { session },
            } = await sb.auth.getSession();
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
                  const detail =
                    (data && (data.error || JSON.stringify(data))) || "";
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
            const msg =
              e instanceof Error ? e.message : "Failed to start BankID";
            setError(msg);
          }
        }}
        className="px-2 py-2 rounded-md text-sm bg-gradient-to-r from-black/40 via-black/20 to-white/70 text-foreground-black shadow w-1/2 hover:brightness-110 hover:bg-black/50 hover:text-white transition-all duration-500 disabled:opacity-50 cursor-pointer w-[150px]">
        {sessionReady && !shouldInitialize ? (
          "Loading..."
        ) : (
          <span className="flex items-center gap-1">
            Connect
            <Image
              src={bubbleArrow}
              alt="→"
              width={12}
              height={12}
              className="inline"
            />
            BankID
          </span>
        )}
      </button>
      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
}
