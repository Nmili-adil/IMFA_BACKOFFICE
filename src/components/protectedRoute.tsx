import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuthStore } from '@/stores/authStore';

interface ProtectedRouteProps {
  permission?: string;
  children: ReactNode;
}

const ProtectedRoute = ({ permission, children }: ProtectedRouteProps) => {
  const {
    rfid,
    userLoaded,
    permissions,
    permissionsLoaded,
  } = useAuthStore();

  if (!userLoaded || !permissionsLoaded) {
    return null; // ممكن تحط Loading Spinner هنا
  }

  // إذا ما كاينش RFID → redirect ل login
  if (!rfid) {
    return <Navigate to="/login" replace />;
  }

  // إذا permission محدد وما موجودش فـ user permissions → redirect
  if (permission && !permissions.includes(permission)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
