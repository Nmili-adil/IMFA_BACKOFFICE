import React, { createContext, useContext, useEffect } from 'react';
import { hasAdminAccess, isSuperAdmin as checkSuperAdmin, isManager as checkManager, isAdmin as checkAdmin } from '@/lib/supabase';
import { useAuthStore } from '@/store/authStore';
import { loginUser } from '@/services/authService';

interface AuthContextType {
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => void;
  hasAdminAccess: () => boolean;
  isSuperAdmin: () => boolean;
  isManager: () => boolean;
  isAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { setAuth, clearAuth, setLoading, roleName } = useAuthStore();

  useEffect(() => {
    // Auth state is persisted in localStorage via Zustand persist middleware
    // No need to check session - just set loading to false
    setLoading(false);
  }, [setLoading]);

  const signIn = async (email: string, password: string) => {
    try {
      // NOTE: Currently using code_pin as password (TEMPORARY - INSECURE)
      // TODO: Add password_hash column to users table and implement proper password hashing
      const { user, error } = await loginUser(email, password);

      if (error) {
        return { error };
      }

      if (!user) {
        return {
          error: new Error('Invalid credentials'),
        };
      }

      // User is already validated as admin in loginUser()
      setAuth(user);
      return { error: null };
    } catch (error) {
      console.error('Sign in error:', error);
      return { error: error as Error };
    }
  };

  const signOut = () => {
    clearAuth();
    // Navigation will be handled by ProtectedRoute detecting auth state change
  };

  const value: AuthContextType = {
    signIn,
    signOut,
    hasAdminAccess: () => hasAdminAccess(roleName || undefined),
    isSuperAdmin: () => checkSuperAdmin(roleName || undefined),
    isManager: () => checkManager(roleName || undefined),
    isAdmin: () => checkAdmin(roleName || undefined),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
