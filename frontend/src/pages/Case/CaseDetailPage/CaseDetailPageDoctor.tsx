import CaseDetailDoctor from '@/components/feature/Case/CaseDetailDoctor';
import CaseEditDoctor from '@/components/feature/Case/CaseEditDoctor';
import { Layout } from 'antd';
import { useState } from 'react';

const CaseDetailPageDoctor = ({ id }: { id: string }) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);

  return (
    <>
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
