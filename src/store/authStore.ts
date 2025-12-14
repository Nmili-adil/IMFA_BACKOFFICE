import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '@/lib/supabase';

interface AuthState {
  user: User | null;
  roleName: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setAuth: (user: User | null) => void;
  setLoading: (isLoading: boolean) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      roleName: null,
      isLoading: true,
      isAuthenticated: false,
      setAuth: (user) => {
        const roleName = user?.role?.name || null;
        
        set({
          user,
          roleName,
          isAuthenticated: !!user,
          isLoading: false,
        });
      },
      setLoading: (isLoading) => set({ isLoading }),
      clearAuth: () =>
        set({
          user: null,
          roleName: null,
          isAuthenticated: false,
          isLoading: false,
        }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        roleName: state.roleName,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
