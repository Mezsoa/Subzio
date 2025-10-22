import { useEffect, useState, PropsWithChildren } from "react";
import { supabaseBrowser } from "@/lib/supabaseClient";

type Props = PropsWithChildren<{ redirectTo?: string }>;

export default function RequireAuth({ children, redirectTo = "/auth/signin" }: Props) {
    const [ready, setReady] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            const supabase = supabaseBrowser();
            const { data: { session } } = await supabase.auth.getSession();
            
            if (!session) {
                window.location.href = redirectTo;
                return;
            }
            
            setReady(true);
        };

        checkAuth();
    }, [redirectTo]);
    
    if (!ready) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
            </div>
        );
    }
    
    return <>{children}</>;
}