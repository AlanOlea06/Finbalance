import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from './supabase';
import { getCurrentUserProfile, UserProfile } from './userService';

interface AuthContextValue {
  authUser: any | null;
  profile: UserProfile | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [authUser, setAuthUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadUser = async (user: any | null) => {
    setLoading(true);
    setAuthUser(user);

    if (!user) {
      setProfile(null);
      setLoading(false);
      return;
    }

    try {
      const profileData = await getCurrentUserProfile();
      setProfile(profileData);
    } catch (error) {
      console.warn('Failed to load user profile:', error);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const init = async () => {
      const { data, error } = await supabase.auth.getUser();

      if (error) {
        console.warn('Supabase auth user fetch error:', error);
        setAuthUser(null);
        setProfile(null);
        setLoading(false);
        return;
      }

      await loadUser(data?.user ?? null);
    };

    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      await loadUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    setAuthUser(null);
    setProfile(null);
  };

  const value = useMemo(
    () => ({ authUser, profile, loading, signOut }),
    [authUser, profile, loading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
