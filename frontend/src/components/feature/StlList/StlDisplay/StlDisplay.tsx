import { StlDisplayProvider } from '@/context/StlDisplayContext';
import Center from './Center';

const StlDisplay = ({ url, id }: { url: string; id: string }) => {
  return (
    <StlDisplayProvider>
      <Center url={url} id={id} />
      {/* <MenuBar />
      <CanvasScene url={url} /> */}
    </StlDisplayProvider>
  );
};

export default StlDisplay;
