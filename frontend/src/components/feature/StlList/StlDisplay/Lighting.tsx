import { ContactShadows } from '@react-three/drei';
import { useThree, useFrame } from '@react-three/fiber';
import { useRef } from 'react';
import { DirectionalLight, Vector3 } from 'three';

const Lighting = () => {
  const whiteLightRef = useRef<DirectionalLight>(null);
  const darkLightRef = useRef<DirectionalLight>(null);
  const { camera } = useThree();

  useFrame(() => {
    if (whiteLightRef.current) {
      const offset = new Vector3(10, 10, 10);
      whiteLightRef.current.position.copy(camera.position.clone().add(offset));
      whiteLightRef.current.target.position.copy(camera.position);
    }
    if (darkLightRef.current) {
      const offset = new Vector3(10, 10, -10);
      darkLightRef.current.position.copy(camera.position.clone().add(offset));
      darkLightRef.current.target.position.copy(camera.position);
    }
  });

  return (
    <>
      <directionalLight ref={whiteLightRef} intensity={2} color={0xffffff} />
      {/* <ContactShadows position={[0, -1.5, 0]} opacity={0.35} blur={3} color={'#A9A9A9'} /> */}
    </>
  );
};

export default Lighting;
