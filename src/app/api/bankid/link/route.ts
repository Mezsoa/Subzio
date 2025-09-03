import { NextRequest } from "next/server";
import { supabaseService } from "@/lib/supabaseClient";
import { signState } from "@/lib/tinkState";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const clientId = process.env.TINK_CLIENT_ID;
  const redirectUri = process.env.TINK_REDIRECT_URI;
  const market = process.env.TINK_MARKET || "SE";
  if (!clientId || !redirectUri) {
    return new Response(JSON.stringify({ error: "Missing Tink env" }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }

  // Identify user strictly via Authorization: Bearer <supabase access token>
  const authHeader = req.headers.get("authorization") || req.headers.get("Authorization");
  const token = authHeader?.toLowerCase().startsWith("bearer ") ? authHeader.slice(7) : null;
  if (!token) {
    return new Response(JSON.stringify({ error: "Missing Authorization Bearer token" }), {
      status: 401,
      headers: { "content-type": "application/json" },
    });
  }

  const svc = supabaseService();
  const { data: viaToken } = await svc.auth.getUser(token);
  const user = viaToken?.user || null;
  if (!user) {
    return new Response(JSON.stringify({ error: "Invalid or expired token" }), {
      status: 401,
      headers: { "content-type": "application/json" },
    });
  }

  const nonce = Math.random().toString(36).slice(2);
  const exp = Math.floor(Date.now() / 1000) + 10 * 60;
  const state = signState({ uid: user.id, nonce, exp });

  const scope = encodeURIComponent("accounts:read,transactions:read");
  const url =
    `https://link.tink.com/1.0/authorize/` +
    `?client_id=${encodeURIComponent(clientId)}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&response_type=code` +
    `&scope=${scope}` +
    `&market=${encodeURIComponent(market)}` +
    `&state=${encodeURIComponent(state)}`;

  return new Response(JSON.stringify({ url }), {
    status: 200,
    headers: { "content-type": "application/json" },
  });
}

