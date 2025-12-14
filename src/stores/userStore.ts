import { create } from "zustand"
import { supabase } from "../lib/supabaseClient";
import type { User } from "@/types/users";
type UserState = {
  users: User[]
  loading: boolean
  fetchUsers: () => Promise<void>
}

export const useUserStore = create<UserState>((set) => ({
  users: [],
  loading: false,

  fetchUsers: async () => {
    set({ loading: true })

  const { data, error } = await supabase
      .from("users")
      .select(`
       *,
        roles(id, name)`
  )

  if (error) {
    console.error("Error fetching users:",
    error)
    set({ loading: false })
      return
    }
    set({
      users: data as User[],
      loading: false
    })

    
    console.log("Fetched users:", data);

  }
}))
