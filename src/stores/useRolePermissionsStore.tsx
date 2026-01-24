import { create } from "zustand";
import { supabase } from "@/lib/supabaseClient";

interface RolePermission {
  role_id: number;
  permission_id: number;
}

interface RolePermissionsStore {
  rolePermissions: RolePermission[];
  loading: boolean;
  fetchRolePermissions: (role_id: number) => Promise<void>;
  saveRolePermissions: (role_id: number, permissionIds: number[]) => Promise<void>;
}

export const useRolePermissionsStore = create<RolePermissionsStore>((set) => ({
  rolePermissions: [],
  loading: false,

  fetchRolePermissions: async (role_id) => {
    set({ loading: true });
    const { data, error } = await supabase
      .from("role_permissions")
      .select("permission_id")
      .eq("role_id", role_id);

    if (error) {
      console.error("Fetch role permissions error:", error);
      set({ loading: false });
      return;
    }
     set({
  rolePermissions: data.map((item: any) => ({
    role_id,           
    permission_id: item.permission_id
  })),
  loading: false
});

  },

  saveRolePermissions: async (role_id, permissionIds) => {
    set({ loading: true });
    // delete old permissions
    const { error: deleteError } = await supabase
      .from("role_permissions")
      .delete()
      .eq("role_id", role_id);

    if (deleteError) {
      console.error("Delete role permissions error:", deleteError);
      set({ loading: false });
      return;
    }

    // insert new permissions
    const inserts = permissionIds.map((permission_id) => ({ role_id, permission_id }));
    const { error: insertError } = await supabase.from("role_permissions").insert(inserts);

    if (insertError) {
      console.error("Insert role permissions error:", insertError);
    }

    set({ rolePermissions: inserts, loading: false });
  },
}));
