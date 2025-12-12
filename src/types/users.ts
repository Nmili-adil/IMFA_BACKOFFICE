export type User = {
  id: string
  name: string
  email: string
  role: "Admin" | "Receptionist" | "Manager"
  status: "Active" | "Inactive"
  avatar?: string
}
