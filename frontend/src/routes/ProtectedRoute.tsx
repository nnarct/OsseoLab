import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/types/user';
import { LOGIN_PATH, UNAUTHORIZED_PATH } from '@/constants/path';

interface ProtectedRouteProps {
  allowedRoles: UserRole[];
}

// Protects routes based on user role
const ProtectedRoute = ({ allowedRoles }: ProtectedRouteProps) => {
  const { user } = useAuth();

  // Redirect if not logged in
  if (!user) {
    return <Navigate to={LOGIN_PATH} replace />;
  }

  // Restrict access
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to={UNAUTHORIZED_PATH} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
