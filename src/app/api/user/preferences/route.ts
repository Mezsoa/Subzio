import { NextRequest } from "next/server";
import { supabaseServer } from "@/lib/supabaseServer";
import { supabaseService } from "@/lib/supabaseClient";

export async function GET(req: NextRequest) {
  try {
    // Get authenticated user
    const supabase = await supabaseServer();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "content-type": "application/json" },
      });
    }

    // Get user preferences from user metadata
    const preferences = user.user_metadata?.preferences || {
      notifications: true,
      weeklyReports: true,
      savingsGoal: 100,
      onboarding_completed: false,
    };

    return new Response(JSON.stringify({ preferences }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  } catch (error: any) {
    console.error('Preferences fetch error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { preferences, onboarding_completed } = body;
    
    // Get authenticated user
    const supabase = await supabaseServer();
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "content-type": "application/json" },
      });
    }

    // Update user metadata with preferences
    const svc = supabaseService();
    const updateData: any = {};
    
    if (preferences) {
      updateData.preferences = {
        ...user.user_metadata?.preferences,
        ...preferences,
      };
    }
    
    if (onboarding_completed !== undefined) {
      updateData.onboarding_completed = onboarding_completed;
    }

    const { error } = await svc.auth.updateUser({
      data: updateData
    });

    if (error) {
      console.error('Error updating preferences:', error);
      return new Response(JSON.stringify({ error: "Failed to update preferences" }), {
        status: 500,
        headers: { "content-type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "content-type": "application/json" },
    });
  } catch (error: any) {
    console.error('Preferences update error:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "content-type": "application/json" },
    });
  }
}
