import { useStlDisplay } from '@/hooks/useStlDisplay';
import * as THREE from 'three';

const MeshComponent = ({
  geometry,
  visible,
  color,
  opacity,
  id,
}: {
  geometry: THREE.BufferGeometry;
  visible: boolean;
  color: string;
  opacity?: number;
  id: string;
}) => {
  const { planeHandler } = useStlDisplay();
  const planes = planeHandler.getPlanes();
  const isCut = planeHandler.isCut;

  const material = new THREE.MeshStandardMaterial();

  const clippingPlanes = planes.length > 0 && isCut ? planes.map((item) => item.plane) : null;

  material.clippingPlanes = clippingPlanes;
  material.side = THREE.DoubleSide;
  material.color.set(color);
  material.opacity = opacity ?? 1;
  material.transparent = opacity !== undefined && opacity < 1;
  material.clipIntersection = true;
  material.clipShadows = true;
  material.metalness = 0.1;
  material.roughness = 0.6;
  material.needsUpdate = true;

  return (
    <group rotation={[-Math.PI / 2, 0, 0]}>
      <mesh key={`${id}-${geometry.uuid}`} geometry={geometry} visible={visible} material={material} />
    </group>
  );
};

export default MeshComponent;
