import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/types/user';
import { Navigate } from 'react-router-dom';
import AdminHomepage from './AdminHomepage';
import DoctorHomepage from './DoctorHomepage';
import TechnicianHomepage from './TechnicianHomepage';

const Homepage = () => {
  const { role } = useAuth();
  console.log('home page', role);

  // if (role === UserRole.Admin) return <Navigate to={'/admin'} />;
  // if (role === UserRole.Doctor) return <Navigate to={'/doctor'} />;
  // if (role === UserRole.Technician) return <Navigate to={'/tech'} />;
  if (role === UserRole.Admin) return <AdminHomepage />;
  if (role === UserRole.Doctor) return <DoctorHomepage />;
  if (role === UserRole.Technician) return <TechnicianHomepage />;

  return <Navigate to={'login'} />;
};
export default Homepage;
