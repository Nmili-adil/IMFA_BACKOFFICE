import { useState, useEffect } from "react";
import { usePermissionsStore } from "@/stores/usePermissionsStore";
import { useUsersStore } from "@/stores/usersStore";
import { supabase } from "@/lib/supabaseClient";
import { useRolesStore } from "@/stores/useRolesStore";
import { 
  ChevronDown, 
  CheckCircle, 
  Circle, 
  UserPlus, 
  Shield,
  Users,
  Key,
  Plus,
  X,
  Loader2,
  Check,
  UserCog
} from "lucide-react";

export default function AddRoleWizard() {
  // 🌟 Stores
  const { permissions, fetchPermissions, loading: loadingPermissions } = usePermissionsStore();
  const { users, fetchUsers, loading: loadingUsers } = useUsersStore();
  const { fetchRoles } = useRolesStore();

  // 🌟 Local state
  const [roleData, setRoleData] = useState({ name: "", description: "" });
  const [selectedPermissions, setSelectedPermissions] = useState<number[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [completedSteps, setCompletedSteps] = useState({ step1: false, step2: false, step3: false });
  const [openStep, setOpenStep] = useState<number | null>(1);
  const [submitting, setSubmitting] = useState(false);
  const [searchUser, setSearchUser] = useState("");
  const [searchPermission, setSearchPermission] = useState("");

  // 🌟 Fetch permissions & users
  useEffect(() => {
    fetchPermissions();
    fetchUsers();
  }, []);

  // 🌟 Step completion checks
  useEffect(() => {
    const isValid = roleData.name.trim() !== "" && roleData.description.trim() !== "";
    setCompletedSteps(prev => ({ ...prev, step1: isValid }));
  }, [roleData]);

  useEffect(() => {
    setCompletedSteps(prev => ({ ...prev, step2: selectedPermissions.length > 0 }));
  }, [selectedPermissions]);

  useEffect(() => {
    setCompletedSteps(prev => ({ ...prev, step3: selectedUsers.length > 0 }));
  }, [selectedUsers]);

  // 🌟 Handlers
  const handleRoleDataChange = (field: "name" | "description", value: string) => {
    setRoleData(prev => ({ ...prev, [field]: value }));
  };

  const handlePermissionSelection = (permId: number) => {
    setSelectedPermissions(prev => 
      prev.includes(permId) 
        ? prev.filter(id => id !== permId) 
        : [...prev, permId]
    );
  };

  const handleUserSelection = (userId: number) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId) 
        : [...prev, userId]
    );
  };

  const toggleStep = (step: number) => {
    setOpenStep(prev => (prev === step ? null : step));
  };

  const canOpenStep = (step: number) => {
    if (step === 1) return true;
    if (step === 2) return completedSteps.step1;
    if (step === 3) return completedSteps.step2;
    return false;
  };

  // 🌟 Filtered data
  const filteredUsers = users.filter(user =>
    user.nomEmp.toLowerCase().includes(searchUser.toLowerCase()) ||
    user.rfid.toString().includes(searchUser)
  );

  const filteredPermissions = permissions.filter(perm =>
    perm.name.toLowerCase().includes(searchPermission.toLowerCase()) ||
    perm.description?.toLowerCase().includes(searchPermission.toLowerCase())
  );

  // 🌟 Submit
  const createRole = async () => {
    try {
      setSubmitting(true);

      // 1️⃣ Insert role
      const { data: role, error: roleError } = await supabase
        .from("roles")
        .insert({ name: roleData.name, description: roleData.description })
        .select()
        .single();
      
      if (roleError) throw roleError;

      // 2️⃣ Insert role_permissions
      if (selectedPermissions.length > 0) {
        const rolePermissions = selectedPermissions.map((permId) => ({
          role_id: role.id,
          permission_id: permId,
        }));

        const { error: permError } = await supabase
          .from("role_permissions")
          .insert(rolePermissions);

        if (permError) throw permError;
      }

      // 3️⃣ Update selected users
      if (selectedUsers.length > 0) {
        const { error: userError } = await supabase
          .from("users")
          .update({ role_id: role.id })
          .in("rfid", selectedUsers);

        if (userError) throw userError;
      }

      await new Promise((res) => setTimeout(res, 300));
      await fetchRoles();

      // Success notification
      alert("✅ Role created successfully!");
      // Reset form
      setRoleData({ name: "", description: "" });
      setSelectedPermissions([]);
      setSelectedUsers([]);
      setCompletedSteps({ step1: false, step2: false, step3: false });
      setOpenStep(1);
    } catch (err) {
      console.error("Create Role Error:", err);
      alert("❌ Failed to create role. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const steps = [
    { id: 1, title: "Role Details", icon: Shield, completed: completedSteps.step1 },
    { id: 2, title: "Permissions", icon: Key, completed: completedSteps.step2 },
    { id: 3, title: "Assign Users", icon: Users, completed: completedSteps.step3 },
  ];

  return (
    <div className="
      h-[calc(100vh-64px)]   /* 64px = header height */
      overflow-hidden
      border border-gray-200
      rounded-2xl
      shadow-sm
      mt-4 ml-12 mr-2
      bg-gradient-to-br from-gray-50 to-gray-100/50
      font-sans
      flex flex-col
    ">
      <div className="flex-1 overflow-y-auto px-6 py-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-yellow-800/10 rounded-xl">
                <UserCog className="h-8 w-8 text-[#967e62]" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                  Create New Role
                </h1>
                <p className="text-gray-600 mt-1 text-xs font-light">
                  Define role details, permissions, and assign users in three simple steps
                </p>
              </div>
            </div>
          </div>

          {/* Progress Stepper */}
          <div className="mb-8 relative">
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gray-200 -z-10 transform -translate-y-1/2"></div>
            <div className="flex justify-between relative z-10">
              {steps.map((step, index) => (
                <div key={step.id} className="flex flex-col items-center">
                  <button
                    onClick={() => canOpenStep(step.id) && toggleStep(step.id)}
                    disabled={!canOpenStep(step.id)}
                    className={`flex items-center justify-center w-12 h-12 rounded-full mb-3 transition-all duration-300 ${
                      step.completed
                        ? "bg-green-500 text-white shadow-lg shadow-green-500/25"
                        : completedSteps[`step${step.id - 1}` as keyof typeof completedSteps] || step.id === 1
                        ? "bg-white border-2 border-blue-500 text-blue-500 shadow-md"
                        : "bg-gray-100 border-2 border-gray-300 text-gray-400"
                    } ${canOpenStep(step.id) ? "cursor-pointer hover:scale-105" : "cursor-not-allowed"}`}
                  >
                    {step.completed ? (
                      <Check className="h-6 w-6" />
                    ) : (
                      <step.icon className="h-6 w-6" />
                    )}
                  </button>
                  <span className={`text-sm font-medium ${
                    step.completed ? "text-green-600" : 
                    completedSteps[`step${step.id - 1}` as keyof typeof completedSteps] || step.id === 1 ? 
                    "text-gray-800" : "text-gray-400"
                  }`}>
                    {step.title}
                  </span>
                  <span className="text-xs text-gray-500 mt-1">Step {step.id}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Steps Container */}
          <div className="space-y-4">
            {/* Step 1 - Role Details */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden transition-all duration-300">
              <button
                onClick={() => canOpenStep(1) && toggleStep(1)}
                disabled={!canOpenStep(1)}
                className={`w-full flex items-center justify-between p-5 hover:bg-gray-50/50 transition-colors ${
                  !canOpenStep(1) ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg ${
                    completedSteps.step1 ? "bg-green-100" : "bg-blue-100"
                  }`}>
                    <Shield className={`h-5 w-5 ${
                      completedSteps.step1 ? "text-green-600" : "text-blue-600"
                    }`} />
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-semibold text-gray-900">Role Details</h3>
                    <p className="text-sm text-gray-500">Enter basic role information</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {completedSteps.step1 && (
                    <span className="text-sm text-green-600 font-medium bg-green-50 px-3 py-1 rounded-full flex items-center gap-1">
                      <Check className="h-4 w-4" />
                      Completed
                    </span>
                  )}
                  <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform duration-300 ${
                    openStep === 1 ? "rotate-180" : ""
                  }`} />
                </div>
              </button>
              
              {openStep === 1 && (
                <div className="px-6 pb-6 border-t border-gray-100">
                  <div className="space-y-4 pt-4">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Role Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g., Technicien, Administrator"
                        value={roleData.name}
                        onChange={e => handleRoleDataChange("name", e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 font-medium placeholder:text-gray-400"
                      />
                      {roleData.name && (
                        <p className="text-xs text-gray-500">
                          {roleData.name.length}/50 characters
                        </p>
                      )}
                    </div>

                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-gray-700">
                        Description <span className="text-red-500">*</span>
                      </label>
                      <textarea
                        placeholder="Describe the role's responsibilities and purpose..."
                        value={roleData.description}
                        onChange={e => handleRoleDataChange("description", e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 min-h-[120px] font-medium placeholder:text-gray-400 resize-none"
                        rows={3}
                      />
                      {roleData.description && (
                        <p className="text-xs text-gray-500">
                          {roleData.description.length}/500 characters
                        </p>
                      )}
                    </div>

                    <div className="pt-2">
                      <button
                        onClick={() => toggleStep(2)}
                        disabled={!completedSteps.step1}
                        className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                          completedSteps.step1
                            ? "bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg"
                            : "bg-gray-100 text-gray-400 cursor-not-allowed"
                        }`}
                      >
                        Continue to Permissions
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Step 2 - Permissions */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden transition-all duration-300">
              <button
                onClick={() => canOpenStep(2) && toggleStep(2)}
                disabled={!canOpenStep(2)}
                className={`w-full flex items-center justify-between p-5 hover:bg-gray-50/50 transition-colors ${
                  !canOpenStep(2) ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg ${
                    completedSteps.step2 ? "bg-green-100" : "bg-purple-100"
                  }`}>
                    <Key className={`h-5 w-5 ${
                      completedSteps.step2 ? "text-green-600" : "text-purple-600"
                    }`} />
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-semibold text-gray-900">Assign Permissions</h3>
                    <p className="text-sm text-gray-500">
                      {selectedPermissions.length > 0 
                        ? `${selectedPermissions.length} permission${selectedPermissions.length !== 1 ? 's' : ''} selected`
                        : "Select role permissions"
                      }
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {completedSteps.step2 && (
                    <span className="text-sm text-green-600 font-medium bg-green-50 px-3 py-1 rounded-full flex items-center gap-1">
                      <Check className="h-4 w-4" />
                      Completed
                    </span>
                  )}
                  <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform duration-300 ${
                    openStep === 2 ? "rotate-180" : ""
                  }`} />
                </div>
              </button>

              {openStep === 2 && (
                <div className="px-6 pb-6 border-t border-gray-100">
                  <div className="space-y-4 pt-4">
                    {/* Search */}
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search permissions..."
                        value={searchPermission}
                        onChange={(e) => setSearchPermission(e.target.value)}
                        className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200 font-medium placeholder:text-gray-400"
                      />
                      <Key className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                    </div>

                    {/* Permissions Grid */}
                    {loadingPermissions ? (
                      <div className="flex justify-center py-8">
                        <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
                      </div>
                    ) : filteredPermissions.length === 0 ? (
                      <div className="text-center py-8">
                        <Key className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">No permissions found</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-2">
                        {filteredPermissions.map((perm) => (
                          <div
                            key={perm.id}
                            onClick={() => handlePermissionSelection(perm.id)}
                            className={`flex items-start gap-3 p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
                              selectedPermissions.includes(perm.id)
                                ? "border-blue-500 bg-blue-50/50"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            <div className={`mt-1 flex-shrink-0 w-5 h-5 rounded flex items-center justify-center ${
                              selectedPermissions.includes(perm.id)
                                ? "bg-blue-500"
                                : "border border-gray-300"
                            }`}>
                              {selectedPermissions.includes(perm.id) && (
                                <Check className="h-3 w-3 text-white" />
                              )}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-medium text-gray-900">{perm.name}</h4>
                              {perm.description && (
                                <p className="text-sm text-gray-500 mt-1">{perm.description}</p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex justify-between pt-4">
                      <button
                        onClick={() => toggleStep(1)}
                        className="px-6 py-3 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-all duration-200"
                      >
                        Back
                      </button>
                      <button
                        onClick={() => toggleStep(3)}
                        disabled={!completedSteps.step2}
                        className={`px-6 py-3 rounded-xl font-medium transition-all duration-200 ${
                          completedSteps.step2
                            ? "bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg"
                            : "bg-gray-100 text-gray-400 cursor-not-allowed"
                        }`}
                      >
                        Continue to Assign Users
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Step 3 - Users */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden transition-all duration-300">
              <button
                onClick={() => canOpenStep(3) && toggleStep(3)}
                disabled={!canOpenStep(3)}
                className={`w-full flex items-center justify-between p-5 hover:bg-gray-50/50 transition-colors ${
                  !canOpenStep(3) ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg ${
                    completedSteps.step3 ? "bg-green-100" : "bg-green-100"
                  }`}>
                    <Users className={`h-5 w-5 ${
                      completedSteps.step3 ? "text-green-600" : "text-green-600"
                    }`} />
                  </div>
                  <div className="text-left">
                    <h3 className="text-lg font-semibold text-gray-900">Assign Users</h3>
                    <p className="text-sm text-gray-500">
                      {selectedUsers.length > 0 
                        ? `${selectedUsers.length} user${selectedUsers.length !== 1 ? 's' : ''} selected`
                        : "Select users for this role"
                      }
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {completedSteps.step3 && (
                    <span className="text-sm text-green-600 font-medium bg-green-50 px-3 py-1 rounded-full flex items-center gap-1">
                      <Check className="h-4 w-4" />
                      Completed
                    </span>
                  )}
                  <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform duration-300 ${
                    openStep === 3 ? "rotate-180" : ""
                  }`} />
                </div>
              </button>

              {openStep === 3 && (
                <div className="px-6 pb-6 border-t border-gray-100">
                  <div className="space-y-6 pt-4">
                    {/* Search */}
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search users by name or ID..."
                        value={searchUser}
                        onChange={(e) => setSearchUser(e.target.value)}
                        className="w-full px-4 py-3 pl-11 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 font-medium placeholder:text-gray-400"
                      />
                      <Users className="absolute left-4 top-3.5 h-5 w-5 text-gray-400" />
                    </div>

                    {/* Users List */}
                    {loadingUsers ? (
                      <div className="flex justify-center py-8">
                        <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
                      </div>
                    ) : filteredUsers.length === 0 ? (
                      <div className="text-center py-8">
                        <Users className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">No users found</p>
                      </div>
                    ) : (
                      <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                        {filteredUsers.map((user) => (
                          <div
                            key={user.rfid}
                            onClick={() => handleUserSelection(user.rfid)}
                            className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 hover:shadow-md ${
                              selectedUsers.includes(user.rfid)
                                ? "border-green-500 bg-green-50/50"
                                : "border-gray-200 hover:border-gray-300"
                            }`}
                          >
                            <div className="flex items-center gap-4">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                selectedUsers.includes(user.rfid)
                                  ? "bg-green-100 text-green-600"
                                  : "bg-gray-100 text-gray-600"
                              }`}>
                                <span className="font-medium">
                                  {user.nomEmp.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <h4 className="font-medium text-gray-900">{user.nomEmp}</h4>
                                <p className="text-sm text-gray-500">ID: {user.rfid}</p>
                              </div>
                            </div>
                            <div className={`w-5 h-5 rounded flex items-center justify-center ${
                              selectedUsers.includes(user.rfid)
                                ? "bg-green-500"
                                : "border border-gray-300"
                            }`}>
                              {selectedUsers.includes(user.rfid) && (
                                <Check className="h-3 w-3 text-white" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    <div className="flex justify-between pt-4">
                      <button
                        onClick={() => toggleStep(2)}
                        className="px-6 py-3 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-all duration-200"
                      >
                        Back
                      </button>
                      <div className="flex gap-3">
                        <button
                          onClick={() => window.location.reload()}
                          className="px-6 py-3 border border-gray-300 rounded-xl font-medium text-gray-700 hover:bg-gray-50 transition-all duration-200"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={createRole}
                          disabled={submitting || !completedSteps.step3}
                          className={`px-8 py-3 rounded-xl font-medium transition-all duration-200 flex items-center gap-2 ${
                            submitting || !completedSteps.step3
                              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                              : "bg-green-600 text-white hover:bg-green-700 shadow-md hover:shadow-lg"
                          }`}
                        >
                          {submitting ? (
                            <>
                              <Loader2 className="h-4 w-4 animate-spin" />
                              Creating Role...
                            </>
                          ) : (
                            <>
                              <UserPlus className="h-4 w-4" />
                              Create Role
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Summary Bar */}
          {(completedSteps.step1 || completedSteps.step2 || completedSteps.step3) && (
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 mt-6 border border-blue-100">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-1">Progress Summary</h4>
                  <p className="text-sm text-gray-600">
                    {completedSteps.step3 
                      ? "All steps completed - Ready to create role"
                      : `${Object.values(completedSteps).filter(Boolean).length} of 3 steps completed`
                    }
                  </p>
                </div>
                <div className="flex items-center gap-6">
                  {steps.map((step) => (
                    <div key={step.id} className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        step.completed ? "bg-green-500" : "bg-gray-300"
                      }`} />
                      <span className="text-sm font-medium text-gray-700">{step.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}