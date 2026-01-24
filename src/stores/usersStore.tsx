// stores/usersStore.ts
import { create } from "zustand";
import { supabase } from "@/lib/supabaseClient";

interface User {
  rfid: number;
  nomEmp: string;
  role_id: string;
}

interface UsersStore {
  users: User[];
  loading: boolean;
  fetchUsers: () => Promise<void>;
}

export const useUsersStore = create<UsersStore>((set) => ({
  users: [],
  loading: false,
  fetchUsers: async () => {
    set({ loading: true });
    const { data, error } = await supabase.from("users").select("*");
    if (error) { set({ loading: false }); return; }
    set({ users: data || [], loading: false });
  },
}));