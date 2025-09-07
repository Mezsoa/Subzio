import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  try {
    // Call both disconnect endpoints
    const baseUrl = req.headers.get('host') ? `http://${req.headers.get('host')}` : 'http://localhost:3000';
    const authHeader = req.headers.get("Authorization");
    
    const headers: HeadersInit = {
      "content-type": "application/json"
    };
    
    if (authHeader) {
      headers["Authorization"] = authHeader;
    }

    const [plaidRes, bankidRes] = await Promise.allSettled([
      fetch(`${baseUrl}/api/plaid/disconnect`, { 
        method: "POST", 
        headers,
        // Forward cookies for session-based auth
        credentials: 'include'
      }),
      fetch(`${baseUrl}/api/bankid/disconnect`, { 
        method: "POST", 
        headers,
        credentials: 'include'
      })
    ]);

    const results = {
      plaid: { success: false, message: "", error: null as any },
      bankid: { success: false, message: "", error: null as any }
    };

    // Process Plaid result
    if (plaidRes.status === 'fulfilled') {
      if (plaidRes.value.ok) {
        const data = await plaidRes.value.json();
        results.plaid.success = true;
        results.plaid.message = data.message || "Disconnected successfully";
      } else {
        const errorData = await plaidRes.value.json().catch(() => ({}));
        results.plaid.error = errorData.error || "Disconnect failed";
      }
    } else {
      results.plaid.error = plaidRes.reason?.message || "Network error";
    }

    // Process BankID result
    if (bankidRes.status === 'fulfilled') {
      if (bankidRes.value.ok) {
        const data = await bankidRes.value.json();
        results.bankid.success = true;
        results.bankid.message = data.message || "Disconnected successfully";
      } else {
        const errorData = await bankidRes.value.json().catch(() => ({}));
        results.bankid.error = errorData.error || "Disconnect failed";
      }
    } else {
      results.bankid.error = bankidRes.reason?.message || "Network error";
    }

    console.log("[Disconnect All] Results:", results);

    return new Response(JSON.stringify({
      ok: true,
      results,
      summary: `Plaid: ${results.plaid.success ? 'OK' : 'Failed'}, BankID: ${results.bankid.success ? 'OK' : 'Failed'}`
    }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unknown error";
    console.error("[Disconnect All] Error:", message);
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
}
