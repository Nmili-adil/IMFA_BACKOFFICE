import { create } from "zustand";
import { supabase } from "@/lib/supabaseClient";

interface Role {
  id: number;
  name: string;
  description: string;
  users_count: number;
}

interface RolesStore {
  roles: Role[];
  loading: boolean;
  fetchRoles: () => Promise<void>;
  deleteRole: (id: number) => Promise<void>;
  updateRole: (role: Role) => Promise<void>;

}

export const useRolesStore = create<RolesStore>((set, get) => ({
  roles: [],
  loading: false,

fetchRoles: async () => {
  set({ loading: true });

  const { data, error } = await supabase
    .from("roles")
    .select(`
      id,
      name,
      description,
      users(rfid)
    `);

//   console.log("RAW roles from supabase:", data); // 🔴 مهم
    console.log("🔴 TEST roles -> users relation:", data);

  if (error) {
    console.error(error);
    set({ loading: false });
    return;
  }

  const formattedRoles = data.map((role: any) => ({
    id: role.id,
    name: role.name,
    description: role.description,
    users_count: role.users.length,
  }));

  console.log("FORMATTED roles:", formattedRoles); // 🔴 مهم

  set({ roles: formattedRoles, loading: false });
},


 deleteRole: async (id: number) => {
  set({ loading: true });

  const { error } = await supabase
    .from("roles")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("❌ Supabase delete error:", error);
    set({ loading: false });
    throw error; // 🔴 مهم
  }

  set({
    roles: get().roles.filter((role) => role.id !== id),
    loading: false,
  });
},

  updateRole: async (role) => {
  set({ loading: true });

  const { error } = await supabase
    .from("roles")
    .update({
      name: role.name,
      description: role.description,
    })
    .eq("id", role.id);

  if (error) {
    console.error("Update error:", error);
    set({ loading: false });
    return;
  }

  // update local state
  set((state) => ({
    roles: state.roles.map((r) =>
      r.id === role.id ? { ...r, ...role } : r
    ),
    loading: false,
  }));
},

}));
