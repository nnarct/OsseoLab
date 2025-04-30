import { StlDisplayProvider } from '@/context/StlDisplayContext';
import Center from './Center';
import { useGetStlById } from '@/services/admin/stl.service';

const StlDisplay = ({ id }: { id: string }) => {
  const { data } = useGetStlById(id);
  //if error
  // if loading
  if (!data) return 'data missing';
  return (
    <StlDisplayProvider>
      <Center url={data.url} id={id} />
      {/* <MenuBar />
      <CanvasScene url={url} /> */}
    </StlDisplayProvider>
  );
};

export default StlDisplay;
