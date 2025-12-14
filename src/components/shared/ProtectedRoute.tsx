import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { hasAdminAccess } from '@/lib/supabase';

interface ProtectedRouteProps {
  allowedRoles?: string[];
  children?: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  allowedRoles = ['admin', 'manager', 'super-admin'],
  children,
}) => {
  const { isAuthenticated, roleName, isLoading } = useAuthStore();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Check if user has admin access
  if (!hasAdminAccess(roleName || undefined)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600">
            You don't have permission to access this system.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Only admin, manager, and super-admin roles are allowed.
          </p>
        </div>
      </div>
    );
  }

  // Check if user's role is in the allowed roles
  if (allowedRoles && roleName && !allowedRoles.includes(roleName.toLowerCase())) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600">
            Your role ({roleName}) doesn't have permission to access this page.
          </p>
        </div>
      </div>
    );
  }

  return children ? <>{children}</> : <Outlet />;
};

// Higher-order component for protecting routes
export const withAuth = <P extends object>(
  Component: React.ComponentType<P>,
  allowedRoles?: string[]
) => {
  return (props: P) => (
    <ProtectedRoute allowedRoles={allowedRoles}>
      <Component {...props} />
    </ProtectedRoute>
  );
};
