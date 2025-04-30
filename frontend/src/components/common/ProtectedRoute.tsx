import { useAuth } from '@/hooks/useAuth';
import { Navigate, Outlet } from 'react-router-dom';

interface ProtectedRouteProps {
  requiredRole?: string[];
}

const ProtectedRoute = ({ requiredRole }: ProtectedRouteProps) => {
  const { role } = useAuth();

  if (!role) {
    // console.log('No role found, redirecting to login');
    return <Navigate to='/login' replace />;
  }

  if (requiredRole && !requiredRole.includes(role)) {
    // console.log(`Role ${role} does not have access to this route, redirecting to homepage`);

    return <Navigate to='/' replace />;
  }

  // console.log(`Role ${role} has access to this route`);
  return <Outlet />;
};

export default ProtectedRoute;
