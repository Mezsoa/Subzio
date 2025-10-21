"use client";
import { supabaseBrowser } from "@/lib/supabaseClient";

export class AuthError extends Error {
  constructor(message = "No session") {
    super(message);
    this.name = "AuthError";
  }
}

export async function authedFetch(input: string, init?: RequestInit): Promise<Response> {
  const sb = supabaseBrowser();
  const { data: { session } } = await sb.auth.getSession();
  
  if (!session) {
    // Check if user is coming from Stripe success page
    const urlParams = new URLSearchParams(window.location.search);
    const fromStripe = document.referrer.includes('/stripe/success') || urlParams.get('from_stripe') === 'true';
    
    if (fromStripe) {
      console.log("User coming from Stripe, attempting to refresh session...");
      // Try to refresh the session
      const { data: { session: refreshedSession } } = await sb.auth.refreshSession();
      
      if (refreshedSession) {
        console.log("Session refreshed successfully in authedFetch");
        const headers = new Headers(init?.headers || {});
        headers.set("authorization", `Bearer ${refreshedSession.access_token}`);
        return fetch(input, { ...init, headers });
      }
    }
    
    throw new AuthError();
  }

  const headers = new Headers(init?.headers || {});
  headers.set("authorization", `Bearer ${session.access_token}`);

  return fetch(input, { ...init, headers });
}

