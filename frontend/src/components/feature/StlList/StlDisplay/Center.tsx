import { Canvas } from '@react-three/fiber';
import Controllers from './Controllers';
import Model from './Model';
import ClippingPlane from './ClippingPlane';
import { useStlDisplay } from '@/hooks/useStlDisplay';
import MenuBar from './MenuBar';

const Center = ({ url }: { url: string }) => {
  const { planes } = useStlDisplay();
  return (
    <>
      <MenuBar />
      <Canvas style={{ height: '80vh', maxWidth: '80vh', width: 'auto', background: 'black', marginInline: 'auto' }}>
        <Controllers />
        <Model url={url} />
        {planes.map((planeObj) => (
          <ClippingPlane key={planeObj.id} {...planeObj} />
        ))}
      </Canvas>
    </>
  );
};
export default Center;
