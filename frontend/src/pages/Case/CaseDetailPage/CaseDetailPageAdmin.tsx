import AdditionalSurgeon from '@/components/feature/Case/AdditionalSurgeon';
import CaseDetail from '@/components/feature/Case/CaseDetail';
import EngineerList from '@/components/feature/Case/EngineerList';
import { Divider, Layout } from 'antd';

const CaseDetailPageAdmin = ({ id }: { id: string }) => {
  return (
    <>
      <Layout.Content className='p-4'>
        <CaseDetail id={id} />
        <Divider />
        <AdditionalSurgeon caseId={id} />
        <Divider />
        <EngineerList caseId={id} />
      </Layout.Content>
    </>
  );
};

export default CaseDetailPageAdmin;
