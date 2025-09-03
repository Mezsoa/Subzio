"use client";
import { useCallback, useEffect, useState } from "react";
import { authedFetch, AuthError } from "@/lib/authedFetch";
import { usePlaidLink } from "react-plaid-link";
import type { PlaidLinkError, PlaidLinkOnExitMetadata } from "react-plaid-link";

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
  useEffect(() => {
    fetchLinkToken().then(setLinkToken).catch((e) => setError(e.message));
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

  const onSuccess = useCallback(async (public_token: string) => {
    await fetch("/api/plaid/exchange", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ public_token }),
    });
    // TODO: navigate to subscriptions/dashboard
    
  }, []);

  const config = {
    token: linkToken || "",
    onSuccess,
    onExit: (err: PlaidLinkError | null, _meta?: PlaidLinkOnExitMetadata) => {
      if (err) setError(err.error_message || "Exited Plaid Link");
    },
  } as const;

  const { open, ready } = usePlaidLink(linkToken ? config : ({} as unknown as Parameters<typeof usePlaidLink>[0]));

  return (
    <div className="flex flex-col items-center gap-3 w-full">
      <button
        onClick={() => open()}
        disabled={!ready}
        className="px-4 py-2 rounded-md bg-emerald-500/90 hover:bg-emerald-500 text-white shadow w-full"
      >
        Connect Plaid
      </button>
      <button
        onClick={async () => {
          try {
            // Pass Supabase session token as Bearer to help API identify user
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
          }
        }}
        className="px-4 py-2 rounded-md bg-sky-600 hover:bg-sky-500 text-white shadow"
      >
        {sessionReady ? "Connect BankID (Tink)" : "Sign in to connect BankID"}
      </button>
      {error && <p className="text-sm text-red-400">{error}</p>}
    </div>
  );
}

