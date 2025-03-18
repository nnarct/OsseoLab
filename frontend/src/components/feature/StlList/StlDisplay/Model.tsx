import { useEffect, useRef } from 'react';
import { useLoader, useThree } from '@react-three/fiber';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import * as THREE from 'three';
import { useStlDisplay } from '@/hooks/useStlDisplay';
import { initializeSTLModel } from '@/utils/stlUtils';

const Model = ({ url }: { url: string }) => {
  const { camera, gl } = useThree();
  const { planes, apply } = useStlDisplay();

  const geometry = useLoader(STLLoader, url);

  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);

  useEffect(() => {
    initializeSTLModel(geometry, camera, meshRef, gl);
  }, [geometry, camera, gl]);

  useEffect(() => {
    if (materialRef.current && planes.length > 0 && apply) {
      materialRef.current.clippingPlanes = planes.map(item => item.plane)
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
