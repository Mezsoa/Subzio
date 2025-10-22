import { NextRequest } from "next/server";
import { supabaseService } from "@/lib/supabaseClient";

export async function GET(req: NextRequest) {
  try {
    const svc = supabaseService();
    
    // Get all Stripe accounts to see what's in the database
    const { data: accounts, error } = await svc
      .from("stripe_connect_accounts")
      .select("*");
    
    console.log("All Stripe accounts in database:", accounts);
    console.log("Error:", error);
    
    return new Response(JSON.stringify({ 
      accounts: accounts || [],
      error: error?.message || null,
      count: accounts?.length || 0
    }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  } catch (error) {
    console.error("Test Stripe error:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Unknown error" 
    }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
}
