import AdditionalSurgeon from '@/components/feature/Case/AdditionalSurgeon';
import CaseDetail from '@/components/feature/Case/CaseDetail';
import { Divider, Layout } from 'antd';

const CaseDetailPageTechnician = ({ id }: { id: string }) => {
  return (
    <>
      <Layout.Content className='p-4'>
        <CaseDetail id={id} />
        <Divider />
        <AdditionalSurgeon caseId={id} />
      </Layout.Content>
    </>
  );
};

export default CaseDetailPageTechnician;
