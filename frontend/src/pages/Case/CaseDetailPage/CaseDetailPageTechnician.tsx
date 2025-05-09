import CustomHeader from '@/components/common/CustomHeader';
import AdditionalSurgeon from '@/components/feature/Case/AdditionalSurgeon';
import CaseDetail from '@/components/feature/Case/CaseDetail';
import CaseDetailDoctor from '@/components/feature/Case/CaseDetailDoctor';
import CaseEditDoctor from '@/components/feature/Case/CaseEditDoctor';
import { Divider, Layout } from 'antd';
import { useState } from 'react';
import { useParams } from 'react-router-dom';

const CaseDetailPageTechnician = () => {
  const { id } = useParams();
  const [isEditing, setIsEditing] = useState<boolean>(false);

  if (!id) return 'Case id is missing';

  return (
    <>
      <CustomHeader backTo={'/case/list'}>
        <p className='pl-2 text-2xl font-bold'>Case Information</p>
      </CustomHeader>
      <Layout.Content className='p-4'>
        <CaseDetail id={id} />
        <Divider />
        <AdditionalSurgeon caseId={id} />
      </Layout.Content>
    </>
  );
};

export default CaseDetailPageTechnician;
