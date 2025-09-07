import { LogOutIcon } from 'lucide-react'
import { supabaseBrowser } from '@/lib/supabaseClient'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authedFetch } from '@/lib/authedFetch';


const SignOut = () => {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSignOut = async () => {
        setIsLoading(true);
        
        try {
            // Disconnect from both banking systems before signing out
            const disconnectRes = await authedFetch("/api/disconnect-all", { method: "POST" });
            
            if (disconnectRes.ok) {
                const data = await disconnectRes.json();
                console.log("[Logout] Bank disconnection:", data.summary);
            } else {
                console.warn("[Logout] Bank disconnection failed:", await disconnectRes.text());
            }
        } catch (e) {
            console.warn("[Logout] Error during bank disconnection:", e);
            // Continue with sign out even if disconnection fails
        }

        // Sign out from Supabase
        const sb = supabaseBrowser();
        await sb.auth.signOut();
        setIsLoading(false);
        router.replace('/');
    }

  return (
    <div className="flex flex-row gap-2 items-center">
            <button className="text-sm font-medium text-foreground hover:text-primary hover:bg-primary/10 rounded-full p-2 flex flex-row gap-2 items-center" onClick={handleSignOut}>
              <LogOutIcon className="w-4 h-4" /> {isLoading ? "Signing out..." : "Sign out"}
            </button>
          </div>
  )
}

export default SignOut