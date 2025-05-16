import { useEffect, useState } from 'react';
import CustomHeader from '@/components/common/CustomHeader';
import Center from '@/components/feature/StlDisplay/Center';
import { StlDisplayProvider } from '@/context/StlDisplayContext';

import { Navigate, useLocation, useParams } from 'react-router-dom';
import { useGetCaseNumberById } from '@/services/case/case.service';

const CaseModelViewer = () => {
  const location = useLocation();
  const { id, caseId } = useParams();
  const { urls, caseNumber, filename } = location.state || {};

  const [validUrls, setValidUrls] = useState<string[]>([]);

  // const allUrls = typeof rawUrl === 'string' ? [rawUrl] : rawUrl;
  // const urls = Array.isArray(allUrls) ? allUrls.filter(Boolean) : [];

  // useEffect(() => {
  //   const validateUrls = async () => {
  //     const results = await Promise.allSettled(
  //       urls.map(async (url) => {
  //         const res = await fetch(url, { method: 'GET' });
  //         const contentType = res.headers.get('content-type');
  //         if (!res.ok) return null;
  //         if (!contentType?.includes('application/octet-stream')) return null;
  //         return url;
  //       })
  //     );

  //     const valid = results
  //       .filter((r): r is PromiseFulfilledResult<string> => r.status === 'fulfilled' && !!r.value)
  //       .map((r) => r.value);

  //     setValidUrls(valid);
  //   };

  //   validateUrls();
  // }, [urls]);

  if (!id || !caseId) return <>case id is missing</>;
  console.log({ urls, caseNumber, filename });
  // if (!urls || !caseNumber || !filename) return <Navigate to={`/case/${caseId}`} />;

  console.log({ urls });
  return (
    <>
      <StlDisplayProvider>
        <CustomHeader backTo={`/case/${caseId}`}>
          <p className='text-xl font-bold'>CASE{String(caseNumber).padStart(3, '0')}</p>
        </CustomHeader>
        <Center urls={urls} />
        {/* <MenuBar />
      <CanvasScene url={url} /> */}
      </StlDisplayProvider>
    </>
  );
};

export default CaseModelViewer;
