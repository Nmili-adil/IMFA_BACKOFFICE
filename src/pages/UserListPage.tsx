import { useState } from "react";
import { userColumns } from "@/components/users/columns";
import { DataTable } from "@/components/users/data-table";
import type { User } from "@/types/users";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// data
const users: User[] = [
  {
    id: "1",
    name: "Alice",
    email: "alice@example.com",
    role: "Admin",
    status: "Active",
    avatar: "https://github.com/shadcn.png",
  },
  {
    id: "2",
    name: "Bob",
    email: "bob@example.com",
    role: "Receptionist",
    status: "Inactive",
    avatar: "https://github.com/shadcn.png",
  },
  {
    id: "3",
    name: "Bob",
    email: "bob@example.com",
    role: "Receptionist",
    status: "Active",
    avatar: "https://github.com/shadcn.png",
  },
  {
    id: "4",
    name: "Bob",
    email: "bob@example.com",
    role: "Manager",
    status: "Active",
    avatar: "https://github.com/shadcn.png",
  },
  {
    id: "5",
    name: "Bob",
    email: "bob@example.com",
    role: "Receptionist",
    status: "Active",
    avatar: "https://github.com/shadcn.png",
  },
  {
    id: "6",
    name: "Bob",
    email: "bob@example.com",
    role: "Receptionist",
    status: "Active",
    avatar: "https://github.com/shadcn.png",
  },
];

export default function UserListPage() {
  const [search, setSearch] = useState("");

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );
  return (
    <div className="h-screen flex mt-12 justify-center p-4">
      <div className="w-full max-w-4xl">
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
          <DataTable columns={userColumns} data={filteredUsers} />
        </div>
      </div>
    </div>
  );
}
