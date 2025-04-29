// import { ContactShadows } from '@react-three/drei';
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
      const offset = new Vector3(10, 10, 10);
      darkLightRef.current.position.copy(camera.position.clone().sub(offset));
      darkLightRef.current.target.position.copy(camera.position);
    }
    // const color = #f5f1d8
  });

  return (
    <>
      <directionalLight ref={whiteLightRef} intensity={3} color={0xf5f1d8} />
      <directionalLight ref={darkLightRef} intensity={2} color={0xf5f1d8} />
      {/* <ContactShadows position={[0, -1.5, 0]} opacity={0.35} blur={3} color={'#A9A9A9'} /> */}
    </>
  );
};

export default Lighting;
