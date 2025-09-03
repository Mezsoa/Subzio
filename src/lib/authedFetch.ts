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
  if (!session) throw new AuthError();

  const headers = new Headers(init?.headers || {});
  headers.set("authorization", `Bearer ${session.access_token}`);

  return fetch(input, { ...init, headers });
}

