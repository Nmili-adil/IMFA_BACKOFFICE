import { Navigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import { useAuthStore } from '@/stores/authStore'

interface ProtectedRouteProps {
  permission?: string
  children: ReactNode
}

const ProtectedRoute = ({ permission, children }: ProtectedRouteProps) => {
  const {
    user,
    userLoaded,
    permissions,
    permissionsLoaded,
  } = useAuthStore()

  if (!userLoaded || !permissionsLoaded) {
    return null 
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (permission && !permissions.includes(permission)) {
    return <Navigate to="/unauthorized" replace />
  }

  return <>{children}</>
}


export default ProtectedRoute
