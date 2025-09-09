"use client";
import { useState } from "react";
import { supabaseBrowser } from "@/lib/supabaseClient";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";

export default function AuthButtons() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  async function signInWithGoogle() {
    setLoading(true);
    setError("");
    
    try {
      const supabase = supabaseBrowser();
      await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo:
            typeof window !== "undefined"
              ? `${window.location.origin}/auth/callback?next=/dashboard`
              : undefined,
          queryParams: { prompt: "select_account" },
        },
      });
    } catch (err) {
      setError("Access restricted. Only authorized users can sign in.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="w-full flex flex-col gap-2">
      <div className="flex flex-row gap-2 mb-4 text-center items-center justify-center border-b border-border pb-4">
        <div className="text-[10px] uppercase tracking-wide text-muted">
          Sign in with
        </div>
      </div>
      <div className="flex w-full justify-center items-center">
        <button
          onClick={signInWithGoogle}
          disabled={loading}
          className="px-4 py-2 rounded-md bg-white/10 hover:bg-white/20 border border-white/20 w-full">
          {loading ? "..." : (
            <span className="inline-flex items-center justify-center gap-2">
              <FontAwesomeIcon icon={faGoogle} className="w-4 h-4" />
              <span>Continue with Google</span>
            </span>
          )}
        </button>
      </div>
      
      {error && (
        <p className="mt-3 text-sm text-red-500 text-center">
          {error}
        </p>
      )}
    </section>
  );
}
