import CustomHeader from '@/components/common/CustomHeader';
import { useCaseFileVersions } from '@/services/case/case-files.service';

const CaseFileVersions = () => {
  const { data } = useCaseFileVersions();

  return (
    <CustomHeader>
      <p className='text-2xl font-bold'>Case File Versions</p>
    </CustomHeader>
  );
};

export default CaseFileVersions;
