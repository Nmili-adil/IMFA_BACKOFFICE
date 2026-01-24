import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabaseClient";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Shield,
  Building,
  Calendar,
  Users,
  Settings,
  BarChart3,
  FileText,
  Bell,
  Mail,
  Lock,
  Check,
  X,
  ArrowLeft,
  Save,
  ChevronDown,
  ChevronUp,
  Key,
  Grid,
  Filter,
  Search,
  Eye,
  EyeOff
} from "lucide-react";

type Permission = {
  id: number;
  name: string;
  label: string;
  description: string;
  module: string;
};

const ManagePermissionsPage = () => {
  const { roleId } = useParams<{ roleId: string }>();
  const navigate = useNavigate();

  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [roleName, setRoleName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  /* ------------------------------------
     Fetch ALL permissions and role info
  ------------------------------------ */
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      // Fetch role name
      if (roleId) {
        const { data: roleData } = await supabase
          .from("roles")
          .select("name")
          .eq("id", roleId)
          .single();
        
        if (roleData) setRoleName(roleData.name);
      }

      // Fetch permissions
      const { data, error } = await supabase
        .from("permissions")
        .select("*")
        .order("module")
        .order("name");

      if (error) console.error(error);
      else setPermissions(data || []);

      setLoading(false);
    };

    fetchData();
  }, [roleId]);

  /* ------------------------------------
     Fetch permissions of THIS role
  ------------------------------------ */
  useEffect(() => {
    if (!roleId) return;

    const fetchRolePermissions = async () => {
      const { data, error } = await supabase
        .from("role_permissions")
        .select("permission_id")
        .eq("role_id", roleId);

      if (error) console.error(error);
      else {
        setSelectedPermissions(
          (data || []).map((p: any) => p.permission_id)
        );
      }
    };

    fetchRolePermissions();
  }, [roleId]);

  /* ------------------------------------
     Toggle permission
  ------------------------------------ */
  const togglePermission = (permissionId: number) => {
    setSelectedPermissions((prev) => {
      const newSelection = prev.includes(permissionId)
        ? prev.filter((id) => id !== permissionId)
        : [...prev, permissionId];
      
      return newSelection;
    });
  };

  /* ------------------------------------
     Toggle dropdown
  ------------------------------------ */
  const toggleDropdown = (module: string) => {
    setActiveDropdown(activeDropdown === module ? null : module);
  };

  /* ------------------------------------
     Toggle all permissions in a module
  ------------------------------------ */
  const toggleAllPermissionsInModule = (module: string, permissions: Permission[]) => {
    const modulePermissionIds = permissions.map(p => p.id);
    const allSelected = modulePermissionIds.every(id => selectedPermissions.includes(id));
    
    if (allSelected) {
      // Deselect all
      setSelectedPermissions(prev => prev.filter(id => !modulePermissionIds.includes(id)));
    } else {
      // Select all
      setSelectedPermissions(prev => [...new Set([...prev, ...modulePermissionIds])]);
    }
  };

  /* ------------------------------------
     Save changes
  ------------------------------------ */
  const handleSave = async () => {
    setSaving(true);

    const role_id = Number(roleId);

    // Delete existing permissions
    const { error: deleteError } = await supabase
      .from("role_permissions")
      .delete()
      .eq("role_id", role_id);

    if (deleteError) {
      console.error("DELETE ERROR:", deleteError);
      setSaving(false);
      return;
    }

    // Insert new permissions
    if (selectedPermissions.length > 0) {
      const inserts = selectedPermissions.map((permission_id) => ({
        role_id,
        permission_id,
      }));

      const { error: insertError } = await supabase
        .from("role_permissions")
        .insert(inserts);

      if (insertError) {
        console.error("INSERT ERROR:", insertError);
      }
    }

    setSaving(false);
  };

  /* ------------------------------------
     Group permissions by module
  ------------------------------------ */
  const groupedPermissions = permissions.reduce(
    (acc: Record<string, Permission[]>, perm) => {
      if (!acc[perm.module]) {
        acc[perm.module] = [];
      }
      acc[perm.module].push(perm);
      return acc;
    },
    {}
  );

  // Get module display names and colors
  const getModuleConfig = (module: string) => {
    const config: Record<string, { name: string; icon: React.ReactNode; color: string; bgColor: string }> = {
      rooms: {
        name: "Rooms",
        icon: <Building className="h-5 w-5" />,
        color: "text-blue-600",
        bgColor: "bg-blue-50"
      },
      reservations: {
        name: "Reservations",
        icon: <Calendar className="h-5 w-5" />,
        color: "text-green-600",
        bgColor: "bg-green-50"
      },
      users: {
        name: "Users",
        icon: <Users className="h-5 w-5" />,
        color: "text-purple-600",
        bgColor: "bg-purple-50"
      },
      settings: {
        name: "Settings",
        icon: <Settings className="h-5 w-5" />,
        color: "text-gray-600",
        bgColor: "bg-gray-50"
      },
      analytics: {
        name: "Analytics",
        icon: <BarChart3 className="h-5 w-5" />,
        color: "text-indigo-600",
        bgColor: "bg-indigo-50"
      },
      reports: {
        name: "Reports",
        icon: <FileText className="h-5 w-5" />,
        color: "text-amber-600",
        bgColor: "bg-amber-50"
      },
      notifications: {
        name: "Notifications",
        icon: <Bell className="h-5 w-5" />,
        color: "text-pink-600",
        bgColor: "bg-pink-50"
      },
      communication: {
        name: "Communication",
        icon: <Mail className="h-5 w-5" />,
        color: "text-cyan-600",
        bgColor: "bg-cyan-50"
      },
      security: {
        name: "Security",
        icon: <Lock className="h-5 w-5" />,
        color: "text-red-600",
        bgColor: "bg-red-50"
      }
    };
    
    return config[module] || {
      name: module.charAt(0).toUpperCase() + module.slice(1),
      icon: <Key className="h-5 w-5" />,
      color: "text-gray-600",
      bgColor: "bg-gray-50"
    };
  };

  // Filter permissions based on search
  const filteredModules = Object.keys(groupedPermissions).filter(module => {
    const config = getModuleConfig(module);
    return config.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
           module.toLowerCase().includes(searchTerm.toLowerCase()) ||
           groupedPermissions[module].some(p => 
             p.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
             p.description.toLowerCase().includes(searchTerm.toLowerCase())
           );
  });

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 font-sans">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6 bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(-1)}
                className="hover:bg-gray-100"
              >
                <ArrowLeft className="h-5 w-5" />
              </Button>
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-blue-600/10 rounded-lg">
                    <Shield className="h-6 w-6 text-blue-600" />
                  </div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    Role Permissions
                  </h1>
                </div>
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">Editing:</span>
                    <span className="font-semibold text-blue-600">{roleName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">•</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      selectedPermissions.length > 0 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {selectedPermissions.length} permission{selectedPermissions.length !== 1 ? 's' : ''} selected
                    </span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => navigate(-1)}
                className="font-medium"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700 font-medium px-6"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 bg-white rounded-2xl p-4 shadow-sm border border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search modules or permissions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              />
            </div>
            
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => {
                  // Select all permissions
                  const allIds = permissions.map(p => p.id);
                  setSelectedPermissions(allIds);
                }}
              >
                <Eye className="h-4 w-4" />
                Select All
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => setSelectedPermissions([])}
              >
                <EyeOff className="h-4 w-4" />
                Clear All
              </Button>
              <div className="text-sm text-gray-600">
                <Filter className="inline h-4 w-4 mr-2" />
                {filteredModules.length} modules
              </div>
            </div>
          </div>
        </div>

        {/* Main Content - Module Dropdowns */}
        <div className="space-y-4">
          {loading ? (
            <div className="flex justify-center items-center h-64 bg-white rounded-2xl border border-gray-200">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                <p className="text-gray-600">Loading permissions...</p>
              </div>
            </div>
          ) : filteredModules.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center border border-gray-200">
              <div className="p-4 bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No modules found
              </h3>
              <p className="text-gray-500">
                Try adjusting your search terms
              </p>
            </div>
          ) : (
            filteredModules.map((module) => {
              const config = getModuleConfig(module);
              const modulePermissions = groupedPermissions[module];
              const selectedCount = modulePermissions.filter(p => selectedPermissions.includes(p.id)).length;
              const isOpen = activeDropdown === module;
              
              return (
                <div key={module} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                  {/* Module Header (Always Visible) */}
                  <div 
                    className="p-5 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => toggleDropdown(module)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-lg ${config.bgColor} ${config.color}`}>
                          {config.icon}
                        </div>
                        <div className="flex-1">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {config.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {modulePermissions.length} permission{modulePermissions.length !== 1 ? 's' : ''}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        {/* Status Badge */}
                        <div className={`px-4 py-1.5 rounded-full text-sm font-medium ${
                          selectedCount === modulePermissions.length
                            ? 'bg-green-100 text-green-800'
                            : selectedCount > 0
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {selectedCount} / {modulePermissions.length}
                        </div>
                        
                        {/* Toggle Button */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleAllPermissionsInModule(module, modulePermissions);
                          }}
                          className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                            selectedCount === modulePermissions.length
                              ? 'bg-green-50 text-green-700 hover:bg-green-100'
                              : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                          }`}
                        >
                          {selectedCount === modulePermissions.length ? 'Deselect All' : 'Select All'}
                        </button>
                        
                        {/* Dropdown Arrow */}
                        <div className={`p-2 rounded-lg transition-transform duration-200 ${
                          isOpen ? 'rotate-180' : ''
                        }`}>
                          <ChevronDown className="h-5 w-5 text-gray-400" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Dropdown Content (Shows when opened) */}
                  {isOpen && (
                    <div className="border-t border-gray-100 p-5 bg-gray-50/30">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                        {modulePermissions.map((perm) => {
                          const isSelected = selectedPermissions.includes(perm.id);
                          
                          return (
                            <div
                              key={perm.id}
                              onClick={() => togglePermission(perm.id)}
                              className={`p-4 rounded-xl border-2 cursor-pointer transition-all duration-150 ${
                                isSelected
                                  ? 'border-blue-400 bg-blue-50/70 shadow-sm'
                                  : 'border-gray-200 hover:border-gray-300 hover:bg-white'
                              }`}
                            >
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-2">
                                  <div className={`w-3 h-3 rounded-full ${
                                    isSelected ? 'bg-blue-500' : 'bg-gray-300'
                                  }`} />
                                  <h4 className="font-semibold text-gray-900">
                                    {perm.label}
                                  </h4>
                                </div>
                                <div className={`w-6 h-6 rounded flex items-center justify-center ${
                                  isSelected
                                    ? 'bg-blue-500 text-white'
                                    : 'bg-gray-100 text-gray-400'
                                }`}>
                                  {isSelected ? (
                                    <Check className="h-4 w-4" />
                                  ) : (
                                    <div className="w-2 h-2 rounded-full bg-gray-400" />
                                  )}
                                </div>
                              </div>
                              
                              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                {perm.description}
                              </p>
                              
                              <div className="flex items-center justify-between">
                                <code className="text-xs text-gray-500 bg-white/50 px-2 py-1 rounded border">
                                  {perm.name}
                                </code>
                                <span className={`text-xs px-2 py-1 rounded ${
                                  isSelected
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'bg-gray-100 text-gray-600'
                                }`}>
                                  {isSelected ? 'Enabled' : 'Disabled'}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                      
                      {/* Module Summary */}
                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${config.bgColor}`}>
                              {config.icon}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">
                                {config.name} Module
                              </p>
                              <p className="text-xs text-gray-500">
                                {selectedCount} of {modulePermissions.length} permissions selected
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            {selectedCount === 0 ? (
                              <span className="text-sm text-gray-500">No permissions selected</span>
                            ) : selectedCount === modulePermissions.length ? (
                              <span className="text-sm font-medium text-green-600 flex items-center gap-1">
                                <Check className="h-4 w-4" />
                                All permissions enabled
                              </span>
                            ) : (
                              <span className="text-sm font-medium text-blue-600">
                                Partial access ({selectedCount}/{modulePermissions.length})
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Summary Footer */}
        <div className="mt-8 bg-white rounded-2xl p-6 border border-gray-200 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex-1">
              <h4 className="font-semibold text-gray-900 mb-3">Summary</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Total Modules</p>
                  <p className="text-2xl font-bold text-blue-600">{filteredModules.length}</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Permissions Selected</p>
                  <p className="text-2xl font-bold text-green-600">{selectedPermissions.length}</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Total Permissions</p>
                  <p className="text-2xl font-bold text-purple-600">{permissions.length}</p>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col items-end">
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="text-sm text-gray-600">Progress:</div>
                  <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-500"
                      style={{ 
                        width: `${permissions.length > 0 ? (selectedPermissions.length / permissions.length) * 100 : 0}%` 
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-900">
                    {permissions.length > 0 
                      ? `${Math.round((selectedPermissions.length / permissions.length) * 100)}%`
                      : "0%"
                    }
                  </span>
                </div>
              </div>
              
              <Button
                onClick={handleSave}
                disabled={saving}
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 font-medium px-8 py-3 shadow-md"
                size="lg"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Applying Changes...
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5 mr-2" />
                    Save Permissions
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagePermissionsPage;