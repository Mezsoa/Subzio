import { NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnonKey) {
    return new Response("Missing Supabase env", { status: 500 });
  }

  // Exchange ?code for a session cookie on the server
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") || "/dashboard";

  const response = new Response(null, { status: 302 });
  response.headers.set("Location", next);

  if (code) {
    const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        // Use the same storage key as other clients
        storageKey: "killsub-auth",
      },
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value;
        },
        set(name: string, value: string, options?: { maxAge?: number }) {
          response.headers.append(
            "Set-Cookie",
            `${name}=${value}; Path=/; HttpOnly; SameSite=Lax${options?.maxAge ? `; Max-Age=${options.maxAge}` : ""}`
          );
        },
        remove(name: string, _options?: { maxAge?: number }) {
          void _options;
          response.headers.append(
            "Set-Cookie",
            `${name}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`
          );
        },
      },
    });
    try {
      const { data, error } = await supabase.auth.exchangeCodeForSession(code);
      
      // Check if the authenticated user's email is authorized
      // TODO: Remove this hardcoded email check and implement proper authorization
      // if (data.user && data.user.email?.toLowerCase() !== "johnmessoa@gmail.com") {
      //   // Sign out unauthorized user and redirect to signin with error
      //   await supabase.auth.signOut();
      //   const errorResponse = new Response(null, { status: 302 });
      //   errorResponse.headers.set("Location", "/auth/signin?error=unauthorized");
      //   return errorResponse;
      // }
      
      if (error) {
        console.error("Auth error:", error);
      }
    } catch (error) {
      console.error("Session exchange error:", error);
      // ignore; redirect proceeds regardless
    }
  }

  return response;
}

