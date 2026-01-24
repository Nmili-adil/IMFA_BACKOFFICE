import { create } from 'zustand';
import { supabase } from '@/lib/supabaseClient';

interface AuthState {
  rfid: number | null;             
  userLoaded: boolean;

  permissions: string[];
  permissionsLoaded: boolean;

  setRFID: (rfid: number | null) => void;
  setPermissions: (permissions: string[]) => void;

  logout: () => void;
  fetchUserPermissions: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  rfid: null,
  userLoaded: false,
  permissions: [],
  permissionsLoaded: false,

  // Actions
  setRFID: (rfid) => set({ rfid, userLoaded: true }),
  setPermissions: (permissions) =>
    set({ permissions, permissionsLoaded: true }),
  logout: () =>
    set({
      rfid: null,
      permissions: [],
      userLoaded: true,
      permissionsLoaded: true,
    }),

  fetchUserPermissions: async () => {
    try {
      // 🔹 Hardcoded RFID bach njarrbo
      const testRFID = 123456789; // number
      console.log("🔥 Using test RFID:", testRFID);

      // call RPC
      const { data, error } = await supabase.rpc(
        "get_user_permissions_by_rfid",
        { p_rfid: testRFID }
      );

      if (error) throw error;

      console.log("✅ RPC data returned:", data);

      if (data && data.length > 0) {
        const perms = data.map((p: any) => p.permission_name);
        set({ permissions: perms, permissionsLoaded: true });
        console.log("✅ Store permissions:", useAuthStore.getState().permissions);
      } else {
        set({ permissions: [], permissionsLoaded: true });
        console.log("⚠️ No permissions found for this RFID");
      }

    } catch (err) {
      console.error("❌ Fetch error:", err);
      set({ permissionsLoaded: true });
    }
  }
}));
