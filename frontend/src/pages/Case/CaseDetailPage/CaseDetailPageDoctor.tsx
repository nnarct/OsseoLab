import CustomHeader from '@/components/common/CustomHeader';
import CaseDetailDoctor from '@/components/feature/Case/CaseDetailDoctor';
import CaseEditDoctor from '@/components/feature/Case/CaseEditDoctor';
import { Layout } from 'antd';
import { useState } from 'react';
import { useParams } from 'react-router-dom';

const CaseDetailPageDoctor = () => {
  const { id } = useParams();
  const [isEditing, setIsEditing] = useState<boolean>(false);

  if (!id) return 'Case id is missing';

  return (
    <>
      <CustomHeader backTo={-1}>
        <p className='pl-2 text-2xl font-bold'>Case Information</p>
      </CustomHeader>
      <Layout.Content className='p-4'>
        {isEditing ? (
          <CaseEditDoctor id={id} setIsEditing={setIsEditing} />
        ) : (
          <CaseDetailDoctor id={id} setIsEditing={setIsEditing} />
        )}
      </Layout.Content>
    </>
  );
};

export default CaseDetailPageDoctor;
