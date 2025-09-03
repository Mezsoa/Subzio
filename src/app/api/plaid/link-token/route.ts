import { NextRequest } from "next/server";
import { getPlaidClient, getPlaidDefaults } from "@/lib/plaid";

export async function GET(_req: NextRequest) {
  try {
    const plaid = getPlaidClient();
    const { products, countryCodes, redirectUri } = getPlaidDefaults();

    const response = await plaid.linkTokenCreate({
      client_name: "KillSub",
      language: "en",
      country_codes: countryCodes as any,
      products: products as any,
      user: { client_user_id: "anon-user" },
      redirect_uri: redirectUri,
    } as any);

    return new Response(JSON.stringify({ link_token: response.data.link_token }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
}

