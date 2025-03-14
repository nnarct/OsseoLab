import { useEffect, useRef } from 'react';
import { useLoader, useThree } from '@react-three/fiber';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import * as THREE from 'three';

const Model = ({ url, clippingPlanes }: { url: string; clippingPlanes?: THREE.Plane[] }) => {
  const geometry = useLoader(STLLoader, url);
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  const { camera, gl } = useThree();

  useEffect(() => {
    gl.localClippingEnabled = true;
    if (!geometry) {
      return;
    }
    geometry.computeBoundingBox();
    const center = new THREE.Vector3();
    geometry.boundingBox?.getCenter(center);
    geometry.translate(-center.x, -center.y, -center.z);

    const size = new THREE.Vector3();
    geometry.boundingBox?.getSize(size);
    const maxSize = Math.max(size.x, size.y, size.z);
    camera.position.set(0, 0, maxSize);
    camera.lookAt(0, 0, 0);

    geometry.computeVertexNormals();
    meshRef.current?.rotation.set(-Math.PI / 2, 0, 0);
  }, [geometry, camera, gl]);


  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshStandardMaterial
        ref={materialRef}
        color='#E8D7C0'
        metalness={0.1}
        roughness={0.6}
        clippingPlanes={clippingPlanes}
        clipIntersection={true}
        clipShadows
      />
    </mesh>
  );
};

export default Model;
