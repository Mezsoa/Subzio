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
            window.location.href = redirectTo;
            return;
          }
          setReady(true);
        })();
        }, [redirectTo]);
      
        if (!ready) return null;
        return <>{children}</>;
}