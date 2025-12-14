import React from 'react';
import { useAuthStore } from '@/store/authStore';

interface RoleGuardProps {
  allowedRoles: string[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * Component to conditionally render content based on user role
 * @example
 * <RoleGuard allowedRoles={['super-admin']}>
 *   <SuperAdminFeature />
 * </RoleGuard>
 */
export const RoleGuard: React.FC<RoleGuardProps> = ({
  allowedRoles,
  children,
  fallback = null,
}) => {
  const { roleName } = useAuthStore();

  if (!roleName || !allowedRoles.includes(roleName.toLowerCase())) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
};

/**
 * Hook to check if user has specific role
 */
export const useHasRole = (requiredRole: string): boolean => {
  const { roleName } = useAuthStore();
  return roleName?.toLowerCase() === requiredRole.toLowerCase();
};

/**
 * Hook to check if user has any of the specified roles
 */
export const useHasAnyRole = (requiredRoles: string[]): boolean => {
  const { roleName } = useAuthStore();
  return roleName ? requiredRoles.some(r => r.toLowerCase() === roleName.toLowerCase()) : false;
};

/**
 * Hook to check if user has all of the specified roles (for future extensions)
 */
export const useHasAllRoles = (requiredRoles: string[]): boolean => {
  const { roleName } = useAuthStore();
  // Since users typically have one role, this checks if their role matches all requirements
  return roleName ? requiredRoles.every(r => r.toLowerCase() === roleName.toLowerCase()) : false;
};
