import { useEffect, useState, PropsWithChildren } from "react";
import { supabaseBrowser } from "@/lib/supabaseClient";

type Props = PropsWithChildren<{ redirectTo?: string }>;

export default function RequireAuth({ children, redirectTo = "/auth/signin" }: Props) {
    const [ready, setReady] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const supabase = supabaseBrowser();
                const { data: { session }, error } = await supabase.auth.getSession();
                
                if (error) {
                    // If there's an error getting the session, redirect to signin
                    window.location.href = redirectTo;
                    return;
                }
                
                if (!session) {
                    // Try to refresh the session
                    const { data: { session: refreshedSession }, error: refreshError } = await supabase.auth.refreshSession();
                    
                    if (refreshError || !refreshedSession) {
                        window.location.href = redirectTo;
                        return;
                    }
                }
                
                setReady(true);
            } catch (error) {
                // If any error occurs, redirect to signin
                window.location.href = redirectTo;
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, [redirectTo]);
    
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