import { useStlDisplay } from '@/hooks/useStlDisplay';
import ClippingPlane from './ClippingPlane';

const ClippingPlaneList = () => {
  const planes = useStlDisplay().planeHandler.getPlanes();

  return (
    <>
      {planes.map((planeObj) => (
        <ClippingPlane key={planeObj.id} {...planeObj} />
      ))}
    </>
  );
};

export default ClippingPlaneList;
