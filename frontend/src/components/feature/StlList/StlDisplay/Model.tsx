import { useEffect, useRef } from 'react';
import { useLoader, useThree } from '@react-three/fiber';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import * as THREE from 'three';
import { useStlDisplay } from '@/hooks/useStlDisplay';
import { initializeSTLModel } from '@/utils/stlUtils';

const Model = ({
  url,
  meshRef,
}: {
  url: string;
  meshRef: React.RefObject<
    THREE.Mesh<
      THREE.BufferGeometry<THREE.NormalBufferAttributes>,
      THREE.Material | THREE.Material[],
      THREE.Object3DEventMap
    >
  >;
}) => {
  const { camera, gl } = useThree();
  const { planes, apply } = useStlDisplay();

  const geometry = useLoader(STLLoader, url) as THREE.BufferGeometry;

  // const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);

  useEffect(() => {
    initializeSTLModel(geometry, camera, meshRef, gl);
  }, [geometry, camera, gl, meshRef]);

  useEffect(() => {
    if (materialRef.current && planes.length > 0 && apply) {
      materialRef.current.clippingPlanes = planes.map((item) => item.plane);
    } else if (materialRef.current && !apply) {
      materialRef.current.clippingPlanes = null;
    }
  }, [apply, planes]);

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshStandardMaterial
        ref={materialRef}
        color='#E8D7C0'
        metalness={0.1}
        roughness={0.6}
        clipIntersection={true}
        clipShadows
      />
    </mesh>
  );
};

export default Model;
