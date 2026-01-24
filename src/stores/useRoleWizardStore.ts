import { create } from "zustand";

type RoleWizardState = {
  role: { name: string; description: string };
  permissions: number[];      
  assignedUsers: number[];    

  setRole: (field: "name" | "description", value: string) => void;
  togglePermission: (id: number) => void;
  toggleUser: (id: number) => void;
  reset: () => void;
};

export const useRoleWizardStore = create<RoleWizardState>((set) => ({
  role: { name: "", description: "" },
  permissions: [],
  assignedUsers: [],

  setRole: (field, value) =>
    set((state) => ({ role: { ...state.role, [field]: value } })),

  togglePermission: (id) =>
    set((state) => ({
      permissions: state.permissions.includes(id)
        ? state.permissions.filter((p) => p !== id)
        : [...state.permissions, id],
    })),

  toggleUser: (id) =>
    set((state) => ({
      assignedUsers: state.assignedUsers.includes(id)
        ? state.assignedUsers.filter((u) => u !== id)
        : [...state.assignedUsers, id],
    })),

  reset: () =>
    set({
      role: { name: "", description: "" },
      permissions: [],
      assignedUsers: [],
    }),
}));
