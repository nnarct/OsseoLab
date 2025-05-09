import CustomHeader from '@/components/common/CustomHeader';
import { useCaseFileGroups } from '@/services/case/case-files.service';

const CaseFileGroups = () => {
  const { data } = useCaseFileGroups();
  
  return (
    <CustomHeader>
      <p className='text-2xl font-bold'>Case File Groups</p>
    </CustomHeader>
  );
};

export default CaseFileGroups;
