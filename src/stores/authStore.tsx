import {create} from 'zustand'
import {supabase} from '@/lib/supabaseClient'
import type {User} from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  userLoaded: boolean;

  permissions: string[];
  permissionsLoaded: boolean;

  setUser: (user: User | null) => void;
  setPermissions: (permissions: string[]) => void;

  logout: () => void;
  fetchUserPermissions: () => Promise<void>;
}


export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  userLoaded: false,

  permissions: [],
  permissionsLoaded: false,

  // Actions
  setUser: (user) => set({ user, userLoaded: true }),

  setPermissions: (permissions) =>
    set({ permissions, permissionsLoaded: true }),

  logout: () =>
    set({
      user: null,
      permissions: [],
      userLoaded: true,
      permissionsLoaded: true,
    }),

  // Fetch user + permissions
  fetchUserPermissions: async () => {
    try {
      const { data: session } = await supabase.auth.getSession();

      if (!session?.session?.user) {
        set({ user: null, userLoaded: true, permissionsLoaded: true });
        return;
      }

      const user = session.session.user;
      set({ user, userLoaded: true });

      // fetch role_id
      const { data: users, error: usersError } = await supabase
        .from("users")
        .select("role_id")
        .eq("id", user.id)
        .single();

      if (usersError) throw usersError;

      // fetch permissions
      const { data: perms, error: permError } = await supabase
        .from("role_permissions")
        .select("permission_id")
        .eq("role_id", users.role_id);

      if (permError) throw permError;

      set({
        permissions: perms.map((p) => p.permission_id),
        permissionsLoaded: true,
      });
    } catch (error) {
      console.error(error);
      set({ userLoaded: true, permissionsLoaded: true });
    }
  },
}));
