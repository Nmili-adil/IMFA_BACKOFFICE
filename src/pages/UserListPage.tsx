import { useEffect, useState } from "react";
import { userColumns } from "@/components/users/columns";
import { DataTable } from "@/components/users/data-table";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useUserStore } from "@/stores/userStore";

// data
/*const users: User[] = [
  {
    id: "1",
    nomEmp: "Alice",
    emailEmp: "alice@example.com",
    adressEmp: "Morocco",
    mobileEmp: "0629273569",
    dateNaissanceEmp: "2004/02/02",
    role: "Admin",
    status: "Active",
    image: "https://github.com/shadcn.png",
  },
  {
    id: "2",
    nomEmp: "Alice",
    emailEmp: "alice@example.com",
    mobileEmp: "0629273569",
    adressEmp: "Morocco",
    dateNaissanceEmp: "2004/02/02",
    role: "Receptionist",
    status: "Inactive",
    image: "https://github.com/shadcn.png",
  },
  {
    id: "3",
    nomEmp: "Alice",
    emailEmp: "alice@example.com",
    mobileEmp: "0629273569",
    adressEmp: "Morocco",
    dateNaissanceEmp: "2004/02/02",
    role: "Receptionist",
    status: "Active",
    image: "https://github.com/shadcn.png",
  },
  {
    id: "4",
    nomEmp: "Alice",
    emailEmp: "alice@example.com",
    mobileEmp: "0629273569",
    adressEmp: "Morocco",

    dateNaissanceEmp: "2004/02/02",
    role: "Manager",
    status: "Active",
    image: "https://github.com/shadcn.png",
  },
  {
    id: "5",
    nomEmp: "Alice",
    emailEmp: "alice@example.com",
    mobileEmp: "0629273569",
    adressEmp: "Morocco",
    dateNaissanceEmp: "2004/02/02",
    role: "Receptionist",
    status: "Active",
    image: "https://github.com/shadcn.png",
  },
  {
    id: "6",
    nomEmp: "Alice",
    emailEmp: "alice@example.com",
    mobileEmp: "0629273569",
    adressEmp: "Morocco",
    dateNaissanceEmp: "2004/02/02",
    role: "Receptionist",
    status: "Active",
    image: "https://github.com/shadcn.png",
  },
];*/

export default function UserListPage() {
  const { users, loading, fetchUsers } = useUserStore();

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const [search, setSearch] = useState("");

  const filteredUsers = users.filter((user) =>
    user.nomEmp.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div className="h-screen flex mt-12 justify-center p-4">
      <div className="w-full max-w-7xl">
        <h1 className="text-2xl font-semibold mb-6">User Management</h1>
        <div className="bg-gray shadow-md rounded-xl p-6">
          {/*TopBar*/}
          <div className="flex items-center justify-between mb-4">
            <Input
              placeholder="Search by name..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-64"
            />
            <Button className="bg-blue-600 text-white hover:bg-blue-700 cursor-pointer">
              Add User
            </Button>
          </div>
          {/*UsersTable*/}
          {loading && <p>Loading users...</p>}
          <DataTable columns={userColumns} data={filteredUsers} />
        </div>
      </div>
    </div>
  );
}
