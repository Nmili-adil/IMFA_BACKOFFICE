export type User = {
  rfid: string
  nomEmp: string
  emailEmp: string
  mobileEmp:string
  adressEmp:string
  dateNaissanceEmp:string
   role_id: number
  roles?: { id: number; name: string }
  status: "Active" | "Inactive"
  image?: string
}
