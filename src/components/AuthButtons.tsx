"use client";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";

export default function AuthButtons() {
  const [loading, setLoading] = useState(false);

  async function signInWithGoogle() {
    setLoading(true);
    
    try {
      // Use direct redirect for ALL devices to avoid X-Frame-Options issues
      console.log("Using direct redirect to avoid iframe/popup issues");
      
      // Direct redirect to Supabase OAuth endpoint
      const redirectUrl = encodeURIComponent(`${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.killsub.com'}/auth/callback?next=/dashboard`);
      const oauthUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/authorize?provider=google&redirect_to=${redirectUrl}`;
      
      console.log("Redirecting to:", oauthUrl);
      
      // Force a full page redirect and prevent any iframe/popup behavior
      // Use setTimeout to ensure the redirect happens after the current execution
      setTimeout(() => {
        window.location.replace(oauthUrl);
      }, 100);
      
    } catch (err) {
      console.error("Google OAuth error:", err);
      setLoading(false);
      
      // Show user-friendly error message
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      alert(`Unable to sign in with Google: ${errorMessage}. Please try again or use the email magic link option.`);
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
          className="px-4 py-2 rounded-md bg-white/10 hover:bg-white/20 border border-white/20 w-full disabled:opacity-50">
          {loading ? (
            <span className="inline-flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Connecting...</span>
            </span>
          ) : (
            <span className="inline-flex items-center justify-center gap-2">
              <FontAwesomeIcon icon={faGoogle} className="w-4 h-4" />
              <span>Continue with Google</span>
            </span>
          )}
        </button>
      </div>
      
    </section>
  );
}
