import { useAuth } from '@/hooks/useAuth';
import { Navigate, Outlet } from 'react-router-dom';
import { UserRole } from '@/types/user';
// import { hasAccess } from './authUtils';
// src/utils/authUtils.ts
const hasAccess = (userRole: UserRole | undefined, requiredRoles?: string[]): boolean => {
  if (!userRole) return false;
  if (!requiredRoles || requiredRoles.length === 0) return true;
  return requiredRoles.includes(userRole);
};

interface ProtectedRouteProps {
  requiredRole?: string[];
}

const ProtectedRoute = ({ requiredRole }: ProtectedRouteProps) => {
  const { role, user } = useAuth();
  if (!role || !user) {
    return <Navigate to={'/login'} replace />;
  }
  if (!hasAccess(role, requiredRole)) {
    const redirectTo = role ? '/' : '/login';
    return <Navigate to={redirectTo} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
