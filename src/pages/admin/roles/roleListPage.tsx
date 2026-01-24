import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useRolesStore } from "@/stores/useRolesStore";
import { useEffect, useState } from "react";
import { 
  MoreVertical, 
  Edit2, 
  Trash2, 
  Shield, 
  Plus,
  Search,
  Users
} from "lucide-react";

interface Role {
  id: number;
  name: string;
  description: string;
  users_count: number;
  status?: string;
}

export const RoleListPage = () => {
  const fetchRoles = useRolesStore((state) => state.fetchRoles);
  const roles = useRolesStore((state) => state.roles);
  
  // Delete state
  const [openDelete, setOpenDelete] = useState(false);
  const [selectedRoleId, setSelectedRoleId] = useState<number | null>(null);
  
  // Edit state
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  
  const updateRole = useRolesStore((s) => s.updateRole);

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleDelete = async () => {
    if (!selectedRoleId) return;

    try {
      await useRolesStore.getState().deleteRole(selectedRoleId);
      console.log("Role deleted:", selectedRoleId);
    } catch (error) {
      console.error("Delete failed", error);
    } finally {
      setOpenDelete(false);
      setSelectedRoleId(null);
    }
  };

  const handleUpdateRole = async () => {
    if (!selectedRole) return;
    await updateRole(selectedRole);
    setOpenEdit(false);
    setSelectedRole(null);
  };

  // Filter roles based on search
  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    role.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans">
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Shield className="h-8 w-8 text-[#967e62]" />
          <h1 className="text-3xl font-bold text-gray-900 font-sans">
            Roles & Permissions
          </h1>
        </div>
        <p className="text-gray-600 text-lg font-light">
          Create, view and manage role-based access permissions
        </p>
      </div>

      {/* Main Card */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
        {/* Toolbar Section */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search roles by name or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-50 border-gray-200 focus:border-blue-500 font-medium"
              />
            </div>
            
            <Button asChild className="bg-[#967e62] hover:bg-[#967e62] font-medium">
              <Link to="/createRole" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add New Role
              </Link>
            </Button>
          </div>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 hover:bg-gray-50">
                <TableHead className="font-semibold text-gray-700 py-4 text-base">
                  Role Name
                </TableHead>
                <TableHead className="font-semibold text-gray-700 py-4 text-base">
                  Description
                </TableHead>
                <TableHead className="font-semibold text-gray-700 py-4 text-base">
                  Users
                </TableHead>
                <TableHead className="font-semibold text-gray-700 py-4 text-base text-right">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody className="font-medium">
              {filteredRoles.map((role: Role) => (
                <TableRow 
                  key={role.id} 
                  className="hover:bg-blue-50/50 transition-colors duration-150 border-t border-gray-100"
                >
                  <TableCell className="py-5">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Shield className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">{role.name}</div>
                        {role.status && (
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            role.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {role.status}
                          </span>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  
                  <TableCell className="py-5 text-gray-600 max-w-xs">
                    <p className="line-clamp-2">{role.description}</p>
                  </TableCell>
                  
                  <TableCell className="py-5">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-gray-400" />
                      <span className="font-semibold text-gray-900">{role.users_count}</span>
                      <span className="text-gray-500">users</span>
                    </div>
                  </TableCell>
                  
                  <TableCell className="py-5 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 hover:bg-gray-100"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent 
                        align="end" 
                        className="w-48 shadow-lg rounded-lg border border-gray-200"
                      >
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedRole(role);
                            setOpenEdit(true);
                          }}
                          className="flex items-center gap-2 cursor-pointer py-2.5 px-3"
                        >
                          <Edit2 className="h-4 w-4" />
                          Edit Role
                        </DropdownMenuItem>
                        
                        <DropdownMenuItem asChild>
                          <Link 
                            to={`/roles/${role.id}/permissions`}
                            className="flex items-center gap-2 py-2.5 px-3"
                          >
                            <Shield className="h-4 w-4" />
                            Manage Permissions
                          </Link>
                        </DropdownMenuItem>
                        
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedRoleId(role.id);
                            setOpenDelete(true);
                          }}
                          className="flex items-center gap-2 text-red-600 cursor-pointer py-2.5 px-3 focus:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete Role
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Empty State */}
          {filteredRoles.length === 0 && (
            <div className="text-center py-16">
              <Shield className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                No roles found
              </h3>
              <p className="text-gray-500">
                {searchQuery ? "Try adjusting your search" : "Create your first role to get started"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Dialog */}
      <Dialog open={openDelete} onOpenChange={setOpenDelete}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 mb-4">
              <Trash2 className="h-6 w-6 text-red-600" />
            </div>
            <DialogTitle className="text-center text-xl font-semibold">
              Delete Role
            </DialogTitle>
            <DialogDescription className="text-center text-gray-600">
              This action cannot be undone. This will permanently delete the role and remove it from your system.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="flex flex-col sm:flex-row gap-3 sm:gap-2">
            <Button
              variant="outline"
              onClick={() => setOpenDelete(false)}
              className="w-full sm:w-auto order-2 sm:order-1"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              className="w-full sm:w-auto order-1 sm:order-2"
            >
              Delete Role
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              <Edit2 className="h-6 w-6 text-blue-600" />
              <DialogTitle className="text-xl font-semibold">
                Edit Role
              </DialogTitle>
            </div>
            <DialogDescription className="text-gray-600">
              Update role information and permissions
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-4">
            <div className="space-y-3">
              <Label htmlFor="name" className="font-medium text-gray-700">
                Role Name
              </Label>
              <Input
                id="name"
                value={selectedRole?.name || ""}
                onChange={(e) =>
                  setSelectedRole((prev) =>
                    prev ? { ...prev, name: e.target.value } : prev
                  )
                }
                className="h-11 font-medium"
                placeholder="Enter role name"
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="description" className="font-medium text-gray-700">
                Description
              </Label>
              <Input
                id="description"
                value={selectedRole?.description || ""}
                onChange={(e) =>
                  setSelectedRole((prev) =>
                    prev ? { ...prev, description: e.target.value } : prev
                  )
                }
                className="h-11 font-medium"
                placeholder="Enter role description"
              />
            </div>
          </div>

          <DialogFooter className="gap-3">
            <Button
              variant="outline"
              onClick={() => setOpenEdit(false)}
              className="font-medium"
            >
              Cancel
            </Button>
            <Button
              onClick={handleUpdateRole}
              className="bg-[#967e62] hover:bg-blue-700 font-medium"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};