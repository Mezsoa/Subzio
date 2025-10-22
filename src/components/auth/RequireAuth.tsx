import { useEffect, useState, PropsWithChildren, useMemo } from "react";
import { supabaseBrowser } from "@/lib/supabaseClient";

type Props = PropsWithChildren<{ redirectTo?: string }>;

export default function RequireAuth({ children, redirectTo = "/auth/signin" }: Props) {
    const [ready, setReady] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Memoize the supabase client to avoid recreating it on every render
    const supabase = useMemo(() => supabaseBrowser(), []);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const { data: { session }, error } = await supabase.auth.getSession();
                
                if (error) {
                    console.error("Session error:", error);
                    // If there's an error getting the session, redirect to signin
                    window.location.href = redirectTo;
                    return;
                }
                
                if (!session) {
                    // Try to refresh the session
                    const { data: { session: refreshedSession }, error: refreshError } = await supabase.auth.refreshSession();
                    
                    if (refreshError) {
                        console.error("Refresh error:", refreshError);
                    }
                    
                    if (!refreshedSession) {
                        // Only redirect if we're sure there's no session
                        window.location.href = redirectTo;
                        return;
                    }
                }
                
                setReady(true);
            } catch (error) {
                console.error("Auth check error:", error);
                // If any error occurs, redirect to signin
                window.location.href = redirectTo;
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, [redirectTo, supabase]);
    
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
            </div>
        );
    }
    
    if (!ready) {
        return null;
    }
    
    return <>{children}</>;
}