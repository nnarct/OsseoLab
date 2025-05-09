import CustomHeader from '@/components/common/CustomHeader';
import { useCuttingPlanes } from '@/services/case/case-files.service';

const CuttingPlanes = () => {
  const { data } = useCuttingPlanes();

  return (
    <CustomHeader>
      <p className='text-2xl font-bold'>Cutting Planes</p>
    </CustomHeader>
  );
};

export default CuttingPlanes;
