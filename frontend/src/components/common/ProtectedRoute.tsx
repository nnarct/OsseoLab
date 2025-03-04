import { useAuth } from '@/hooks/useAuth';
import { Navigate, Outlet } from 'react-router-dom';

interface ProtectedRouteProps {
  requiredRole?: string[];
}

const ProtectedRoute = ({ requiredRole }: ProtectedRouteProps) => {
  const { role } = useAuth();

  if (!role) {
    return <Navigate to='/login' replace />;
  }

  if (requiredRole && !requiredRole.includes(role)) {
    return <Navigate to='/' replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
