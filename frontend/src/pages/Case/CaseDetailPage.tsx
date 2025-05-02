import CustomHeader from '@/components/common/CustomHeader';
import AdditionalSurgeon from '@/components/feature/Case/AdditionalSurgeon';
import CaseDetail from '@/components/feature/Case/CaseDetail';
import { Divider, Layout } from 'antd';
import { useParams } from 'react-router-dom';

const CaseDetailPage = () => {
  const { id } = useParams();
  if (!id) return 'Case id is missing';

  return (
    <>
      <CustomHeader backTo={-1}>
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

export default CaseDetailPage;
