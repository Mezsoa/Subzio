import { NextRequest } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';

export async function getAuthenticatedUser(request: NextRequest) {
  const supabase = await supabaseServer();
  
  // Try to get user from cookies first
  let { data: { user }, error: authError } = await supabase.auth.getUser();
  
  // If no user from cookies, try Bearer token from Authorization header
  if (authError || !user) {
    const authHeader = request.headers.get('authorization');
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.slice(7);
      const { data: { user: tokenUser }, error: tokenError } = await supabase.auth.getUser(token);
      if (!tokenError && tokenUser) {
        user = tokenUser;
        authError = null;
      }
    }
  }
  
  return { user, error: authError };
}
