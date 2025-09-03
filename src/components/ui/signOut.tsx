import { LogOutIcon } from 'lucide-react'
import { supabaseBrowser } from '@/lib/supabaseClient'
import { useState } from 'react';
import { useRouter } from 'next/navigation';


const SignOut = () => {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSignOut = async () => {
        setIsLoading(true);
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