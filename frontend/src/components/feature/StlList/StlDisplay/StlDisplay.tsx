import { StlDisplayProvider } from '@/context/StlDisplayContext';
import CanvasScene from './CanvasScene';
import MenuBar from './MenuBar';
import Center from './Center';

const StlDisplay = ({ url }: { url: string }) => {
  return (
    <StlDisplayProvider>
      <Center url={url}/>
      {/* <MenuBar />
      <CanvasScene url={url} /> */}
    </StlDisplayProvider>
  );
};

export default StlDisplay;
