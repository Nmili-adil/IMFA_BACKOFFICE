import { useAuth } from "@/context/AuthContext";
import { useAuthStore } from "@/store/authStore";
import { RoleGuard } from "@/components/shared/RoleGuard";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const DashboardPage = () => {
  const { signOut } = useAuth();
  const { user, roleName } = useAuthStore();
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut();
    navigate("/login");
  };

  return (
    <div className="p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h1 className="text-3xl font-bold mb-4">Welcome to IMFA Backoffice</h1>
          
          <div className="bg-blue-50 border border-blue-200 rounded p-4 mb-6">
            <h2 className="text-lg font-semibold mb-2">User Information</h2>
            <div className="space-y-2">
              <p><strong>Code PIN:</strong> {user?.code_pin}</p>
              <p><strong>Name:</strong> {user?.nomEmp || 'N/A'}</p>
              <p><strong>Email:</strong> {user?.emailEmp || 'N/A'}</p>
              <p><strong>Mobile:</strong> {user?.mobileEmp || 'N/A'}</p>
              <p><strong>Role:</strong> <span className="inline-block bg-blue-100 px-2 py-1 rounded text-sm uppercase">{roleName}</span></p>
              {user?.adressEmp && <p><strong>Address:</strong> {user.adressEmp}</p>}
              {user?.rfid && <p><strong>RFID:</strong> {user.rfid}</p>}
            </div>
          </div>

          {/* Super Admin Only Section */}
          <RoleGuard allowedRoles={['super-admin']}>
            <div className="bg-purple-50 border border-purple-200 rounded p-4 mb-4">
              <h3 className="text-lg font-semibold mb-2">🔐 Super Admin Controls</h3>
              <p className="text-sm text-gray-600 mb-3">
                This section is only visible to super-admin users
              </p>
              <Button variant="outline" size="sm">
                Manage Users
              </Button>
            </div>
          </RoleGuard>

          {/* Manager and Super Admin Only Section */}
          <RoleGuard allowedRoles={['manager', 'super-admin']}>
            <div className="bg-green-50 border border-green-200 rounded p-4 mb-4">
              <h3 className="text-lg font-semibold mb-2">📊 Manager Dashboard</h3>
              <p className="text-sm text-gray-600 mb-3">
                This section is visible to managers and super-admins
              </p>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  View Reports
                </Button>
                <Button variant="outline" size="sm">
                  Team Management
                </Button>
              </div>
            </div>
          </RoleGuard>

          {/* All Admin Roles Section */}
          <div className="bg-gray-50 border border-gray-200 rounded p-4 mb-4">
            <h3 className="text-lg font-semibold mb-2">⚙️ General Admin Tools</h3>
            <p className="text-sm text-gray-600 mb-3">
              This section is visible to all admin roles
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Settings
              </Button>
              <Button variant="outline" size="sm">
                Analytics
              </Button>
              <Button variant="outline" size="sm">
                Logs
              </Button>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t">
            <Button onClick={handleSignOut} variant="destructive">
              Sign Out
            </Button>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
          <h3 className="font-semibold mb-2">ℹ️ Setup Instructions</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>Configure your Supabase credentials in <code className="bg-gray-100 px-1 rounded">.env.local</code></li>
            <li>Set up user roles in Supabase user metadata</li>
            <li>Check <code className="bg-gray-100 px-1 rounded">AUTH_SETUP.md</code> for detailed instructions</li>
          </ol>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
