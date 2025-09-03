import { NextRequest } from "next/server";
import { supabaseService } from "@/lib/supabaseClient";
import { verifyState } from "@/lib/tinkState";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  if (!code) return new Response("Missing code", { status: 400 });

  // Resolve user strictly from signed state to avoid cookie dependency after cross-site redirect
  let userId: string | null = null;
  if (state) {
    const verified = verifyState(state);
    if (verified) userId = verified.uid;
  }
  if (!userId) return new Response("Unauthorized", { status: 401 });

  const res = await fetch("https://api.tink.com/api/v1/oauth/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: process.env.TINK_CLIENT_ID || "",
      client_secret: process.env.TINK_CLIENT_SECRET || "",
      grant_type: "authorization_code",
      redirect_uri: process.env.TINK_REDIRECT_URI || "",
    }),
  });
  if (!res.ok) {
    const text = await res.text();
    return new Response(text, { status: 500 });
  }
  const data1 = await res.json();

  const svc = supabaseService();
  const { error } = await svc
    .from("bankid_items")
    .insert({ user_id: userId, provider: "tink", access_token: data1.access_token });
  if (error) return new Response(error.message, { status: 500 });

  return new Response(null, { status: 302, headers: { Location: "/dashboard" } });
}

