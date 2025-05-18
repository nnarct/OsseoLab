import { StlDisplayProvider } from '@/context/StlDisplayContext';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { Button, Layout, Result } from 'antd';
import CustomHeader from '@/components/common/CustomHeader';
import Center from '@/components/feature/StlDisplay/Center';
import { StlModelProvider } from '@/context/StlModelContext';

const CaseModelViewer = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { caseId } = useParams();

  if (!caseId) return <>case id is missing</>;

  if (!location.state)
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
            subTitle='Sorry, something went wrong.'
            extra={
              <Button type='primary' onClick={() => navigate(`/case/list`)}>
                Back To Case List
              </Button>
            }
          />
        </Layout.Content>
      </>
    );
  const { urls, caseNumber, names } = location.state || {};

  // if (!urls || !caseNumber || !filename) return <Navigate to={`/case/${caseId}`} />;

  console.log({ urls });
  return (
    <>
      <StlDisplayProvider>
        <StlModelProvider>
          <CustomHeader backTo={`/case/${caseId}`}>
            <p className='text-xl font-bold'>3D Viewer CASE{String(caseNumber).padStart(3, '0')}</p>
          </CustomHeader>
          <Center urls={urls} names={names} />
          {/* <MenuBar />
      <CanvasScene url={url} /> */}
        </StlModelProvider>
      </StlDisplayProvider>
    </>
  );
};

export default CaseModelViewer;
