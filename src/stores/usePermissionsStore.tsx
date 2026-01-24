import { create } from "zustand";
import { supabase } from "@/lib/supabaseClient";

interface Permission {
  id: number;
  name: string;
}

interface PermissionsStore {
  permissions: Permission[];
  loading: boolean;
  fetchPermissions: () => Promise<void>;
}

export const usePermissionsStore = create<PermissionsStore>((set) => ({
  permissions: [],
  loading: false,
  fetchPermissions: async () => {
    set({ loading: true });
    const { data, error } = await supabase.from("permissions").select("*");
    if (error) {
      console.error("Fetch permissions error:", error);
      set({ loading: false });
      return;
    }
    console.log("Fetched permissions:", data); // debug
    set({ permissions: data, loading: false });
  },
}));

