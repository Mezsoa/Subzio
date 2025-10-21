import { useEffect, useState, PropsWithChildren } from "react";
import { supabaseBrowser } from "@/lib/supabaseClient";

type Props = PropsWithChildren<{ redirectTo?: string }>;

export default function RequireAuth({ children, redirectTo = "/auth/signin" }: Props) {
    const [ ready, setReady ] = useState(false);

    useEffect(() => {
        (async () => {
          const sb = supabaseBrowser();
          const { data: { session } } = await sb.auth.getSession();
          
          if(!session) {
            // Check if user is coming from Stripe success page
            const urlParams = new URLSearchParams(window.location.search);
            const fromStripe = document.referrer.includes('/stripe/success') || urlParams.get('from_stripe') === 'true';
            
            if (fromStripe) {
              console.log("User coming from Stripe success page, allowing access...");
              setReady(true);
              return;
            }
            
            // Try to refresh the session first
            console.log("No session found, attempting to refresh...");
            const { data: { session: refreshedSession } } = await sb.auth.refreshSession();
            
            if (!refreshedSession) {
              console.log("Session refresh failed, redirecting to signin");
              window.location.href = redirectTo;
              return;
            }
            
            console.log("Session refreshed successfully");
          }
          setReady(true);
        })();
        }, [redirectTo]);
      
        if (!ready) return null;
        return <>{children}</>;
}