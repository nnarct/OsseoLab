import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/types/user';
import CaseListPageDoctor from './CaseListPageDoctor';
import CaseListPageAdmin from './CaseListPageAdmin';

const CaseList = () => {
  const { role } = useAuth();

  if (role === UserRole.Doctor) {
    return <CaseListPageDoctor />;
  }

  return <CaseListPageAdmin />;
};
export default CaseList;
