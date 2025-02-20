import { useLoader, useThree } from '@react-three/fiber';
import { useRef, useEffect } from 'react';
import { STLLoader } from 'three/examples/jsm/Addons.js';

export const Model = ({ url }: { url: string }) => {
  const geom = useLoader(STLLoader, url);

  const ref = useRef();
  const { camera } = useThree();
  useEffect(() => {
    if (ref?.current) {
      camera.lookAt(ref.current.position);
    }
  });

  return (
    <>
      <mesh ref={ref}>
        <primitive object={geom} attach='geometry' />
        <meshStandardMaterial color={'orange'} />
      </mesh>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
    </>
  );
};
