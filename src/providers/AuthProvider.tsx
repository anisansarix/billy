import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { pullInitialData } from '@/lib/sync';
import { useAppStore } from '@/store';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isInitializing, setIsInitializing] = useState(true);
  const setAuthSession = useAppStore(state => state.setAuthSession);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setAuthSession(session);
      if (session) pullInitialData();
      setIsInitializing(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthSession(session);
      if (session && _event === 'SIGNED_IN') {
        pullInitialData();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [setAuthSession]);

  if (isInitializing) {
    return null; // Don't render until we know the auth state
  }

  return <>{children}</>;
}
