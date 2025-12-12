import type { User } from "@/types/users";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge"; // or your UI library
import { CheckCircle, UserCheck, UserIcon, Users, XCircle } from "lucide-react";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";

export const userColumns: ColumnDef<User>[] = [
  {
    accessorKey: "name",
    header: "Full Name",
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <Avatar className="h-9 w-9">
          <AvatarImage
            src={row.original.avatar}
            className="h-9 w-9 rounded-full"
            alt={row.original.name}
          />
        </Avatar>
        <span className="font-medium">{row.original.name}</span>
      </div>
    ),
  },
  {
    accessorKey: "email",
    header: "Email Address",
    cell: ({ row }) => <span>{row.original.email}</span>,
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.original.role;
      let color = "bg-gray-200 text-gray-800";
      let icon = <UserIcon className="mr-1" />;

      switch (role) {
        case "Admin":
          color = "bg-red-100 text-red-800";
          icon = <UserCheck className="mr-1" />;
          break;
        case "Manager":
          color = "bg-blue-100 text-blue-800";
          icon = <Users className="mr-1" />;
          break;
        case "Receptionist":
          color = "bg-green-100 text-green-800";
          icon = <UserIcon className="mr-1" />;
          break;
      }
      return (
        <Badge className={`flex items-center px-3 py-1 rounded-full ${color}`}>
          {icon}
          {role}
        </Badge>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      let color = "bg-gray-200 text-gray-800";
      let icon = <CheckCircle className="mr-1" />;
      switch (status) {
        case "Active":
          color = "bg-blue-100 text-blue-800";
          icon = <CheckCircle className="mr-1" />;
          break;

        case "Inactive":
          color = "bg-red-100 text-red-800";
          icon = <XCircle className="mr-1" />;
          break;
      }
      return (
        <Badge className={`flex items-center px-3 py-1 rounded-full ${color}`}>
          {icon}
          {status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => (
      <div className="flex gap-2">
        <button
          className="bg-blue-50 hover:bg-blue-100 text-blue-600 px-3 py-1 rounded-md"
          onClick={() => console.log("Edit", row.original.id)}
        >
          Edit
        </button>
        <button
          className="bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1 rounded-md"
          onClick={() => console.log("delete", row.original.id)}
        >
          Delete
        </button>
      </div>
    ),
  },
];
