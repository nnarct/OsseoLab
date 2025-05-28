import { StlDisplayProvider } from '@/context/StlDisplayContext';
import { useParams, useNavigate } from 'react-router-dom';
import { Button, Layout, Result } from 'antd';
import CustomHeader from '@/components/common/CustomHeader';
import Center from '@/components/feature/StlDisplay/Center';
import { StlModelProvider } from '@/context/StlModelContext';
import { useGetCaseModelsByCaseId } from '@/services/case/case-files.service';
const CaseModelViewerPage = () => {
  const navigate = useNavigate();
  const { caseId } = useParams();

  if (!caseId)
    return (
      <>
        <CustomHeader backTo={`/case/${caseId}`}>
          <p className='text-xl font-bold'>3D Viewer</p>
        </CustomHeader>
        <Layout.Content
          className='flex flex-col items-center justify-center bg-white'
          style={{
            height: 'calc( 100vh - 115px )',
          }}
        >
          <Result
            status='500'
            title='500'
            subTitle='Sorry, case URL is incorrect.'
            extra={
              <Button type='primary' onClick={() => navigate(`/case/list`)}>
                Back To Case List
              </Button>
            }
          />
        </Layout.Content>
      </>
    );

  return (
    <>
      <StlDisplayProvider>
        <StlModelProvider>
          <CaseModelViewer caseId={caseId} />
        </StlModelProvider>
      </StlDisplayProvider>
    </>
  );
};

export default CaseModelViewerPage;

const CaseModelViewer = ({ caseId }: { caseId: string }) => {
  const { data } = useGetCaseModelsByCaseId(caseId);
  if (!data) return null;

  return (
    <>
      <CustomHeader backTo={`/case/${caseId}`}>
        <p className='text-xl font-bold'>3D Viewer</p>
      </CustomHeader>
      <Center files={data} />
    </>
  );
};
