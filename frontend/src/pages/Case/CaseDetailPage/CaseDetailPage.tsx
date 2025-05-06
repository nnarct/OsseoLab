import { useAuth } from '@/hooks/useAuth';
import CaseDetailPageAdmin from './CaseDetailPageAdmin';
import CaseDetailPageDoctor from './CaseDetailPageDoctor';
import CaseDetailTechnicianPage from './CaseDetailPageTechnician';

const CaseDetailPage = () => {
  const { role } = useAuth();

  if (role === 'admin') return <CaseDetailPageAdmin />;
  if (role === 'doctor') return <CaseDetailPageDoctor />;
  if (role === 'technician') return <CaseDetailTechnicianPage />;
  return <div>No access</div>;
};

export default CaseDetailPage;
