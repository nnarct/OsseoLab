import CustomHeader from '@/components/common/CustomHeader';
import { useCaseFileGroupItems } from '@/services/case/case-files.service';

const CaseFileGroupItems = () => {
  const { data } = useCaseFileGroupItems();

  return (
    <CustomHeader>
      <p className='text-2xl font-bold'>Case File Group Items</p>
    </CustomHeader>
  );
};

export default CaseFileGroupItems;
