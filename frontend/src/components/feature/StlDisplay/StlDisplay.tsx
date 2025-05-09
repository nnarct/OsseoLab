import { StlDisplayProvider } from '@/context/StlDisplayContext';
import Center from './Center';
import { useGetStlById } from '@/services/admin/stl.service';
import { Spin } from 'antd';

const StlDisplay = ({ id }: { id: string }) => {
  const { data, isLoading } = useGetStlById(id);
  //if error
  if (isLoading)
    return (
      <div className='flex h-[80vh] w-full items-center justify-center'>
        <Spin size='large' />
      </div>
    );
  if (!data) return 'data missing';
  return (
    <StlDisplayProvider>
      <Center urls={[data.url]}/>
      {/* <MenuBar />
      <CanvasScene url={url} /> */}
    </StlDisplayProvider>
  );
};

export default StlDisplay;
