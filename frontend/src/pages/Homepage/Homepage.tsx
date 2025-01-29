import { UNAUTHORIZED_PATH, LOGIN_PATH } from '@/constants/path';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/types/user';
import { Navigate } from 'react-router-dom';
import AdminHomepage from '@/pages/Homepage/AdminHomepage';
import DoctorHomepage from '@/pages/Homepage/DoctorHomepage';
import TechnicianHomepage from '@/pages/Homepage/TechnicianHomepage';

const Homepage = () => {
  const { user } = useAuth();
  console.log("home page", user)

  if (!user) return <Navigate to={LOGIN_PATH} />;
  if (user?.role === UserRole.Admin) return <AdminHomepage />;
  if (user?.role === UserRole.Doctor) return <DoctorHomepage />;
  if (user?.role === UserRole.Technician) return <TechnicianHomepage />;
  return <Navigate to={UNAUTHORIZED_PATH} />;
};
export default Homepage;
