import CustomHeader from '@/components/common/CustomHeader';
import Center from '@/components/feature/StlDisplay/Center';
import { StlDisplayProvider } from '@/context/StlDisplayContext';

import { Navigate, useLocation, useParams } from 'react-router-dom';

const CaseModelViewer = () => {
  const location = useLocation();
  const { id, caseId } = useParams();
  const { url, caseNumber, filename } = location.state || {};
  if (!id || !caseId) return <>case id is missing</>;
  if (!url || !caseNumber || !filename) return <Navigate to={`/case/${caseId}`} />;
  return (
    <>
      <StlDisplayProvider>
        <CustomHeader backTo={(-1)}>
          <p className='text-xl font-bold'>
            CASE{String(caseNumber).padStart(3, '0')} {filename}.stl
          </p>
        </CustomHeader>
        <Center url={url} id={id} />
        {/* <MenuBar />
      <CanvasScene url={url} /> */}
      </StlDisplayProvider>
    </>
  );
};

export default CaseModelViewer;
