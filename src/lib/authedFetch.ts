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
      console.log("User coming from Stripe, bypassing authentication for API calls...");
      // For users coming from Stripe, make the API call without authentication
      // The server-side API routes will handle authentication differently
      return fetch(input, { ...init });
    }
    
    throw new AuthError();
  }

  const headers = new Headers(init?.headers || {});
  headers.set("authorization", `Bearer ${session.access_token}`);

  return fetch(input, { ...init, headers });
}

