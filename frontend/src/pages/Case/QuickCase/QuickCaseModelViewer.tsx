import CustomHeader from '@/components/common/CustomHeader';
import Center from '@/components/feature/StlDisplay/Center';
import { StlDisplayProvider } from '@/context/StlDisplayContext';

import { Navigate, useLocation, useParams } from 'react-router-dom';

const QuickCaseModelViewer = () => {
  const location = useLocation();
  const { id, quickCaseId } = useParams();
  const { url, filename } = location.state || {};
  if (!id || !quickCaseId) return <>case id is missing</>;
  if (!url || !filename) return <Navigate to={`/case/quick-case/${quickCaseId}`} />;
  return (
    <>
      <StlDisplayProvider>
        <CustomHeader backTo={-1}>
          <p className='text-xl font-bold'>{filename}</p>
        </CustomHeader>
        <Center url={url} />
        {/* <MenuBar />
      <CanvasScene url={url} /> */}
      </StlDisplayProvider>
    </>
  );
};

export default QuickCaseModelViewer;
