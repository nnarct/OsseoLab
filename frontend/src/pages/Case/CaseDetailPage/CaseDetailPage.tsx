import { useAuth } from '@/hooks/useAuth';
import CaseDetailPageAdmin from './CaseDetailPageAdmin';
import CaseDetailPageDoctor from './CaseDetailPageDoctor';

const CaseDetailPage = () => {
  const { role } = useAuth();

  if (role === 'admin') return <CaseDetailPageAdmin />;
  if (role === 'doctor') return <CaseDetailPageDoctor />;
  return <div>No access</div>;
};

export default CaseDetailPage;
