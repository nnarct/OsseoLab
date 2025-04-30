import { List } from 'antd';
import { useStlDisplay } from '@/hooks/useStlDisplay';
import PlaneListItem from './PlaneListItem';

const PlaneList = () => {
  const { planeHandler } = useStlDisplay();
  const { getPlanes, isActive } = planeHandler;
  const planes = getPlanes();

  return (
    <>
      {isActive && planes.length > 0 && (
        <div className='px-3'>
          <List header='Plane List' bordered className='bg-white'>
            {planes.map((plane, idx) => (
              <PlaneListItem key={plane.id} plane={plane} idx={idx} />
            ))}
          </List>
        </div>
      )}
    </>
  );
};

export default PlaneList;
