import { useEffect, useRef, createRef } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { initializeSTLModel } from '@/utils/stlUtils';
import { useStlDisplay } from '@/hooks/useStlDisplay';
import { useStlModel } from '@/hooks/useStlModel';
import useSafeStlLoader from '@/hooks/useSafeStlLoader';
import type { CaseModelById } from '@/api/files.api';
import { useMemo } from 'react';
interface ModelProps {
  activeMeshes: CaseModelById[];
}

const Model = ({ activeMeshes }: ModelProps) => {
  const urls = useMemo(() => activeMeshes.map((mesh) => mesh.url), [activeMeshes]);
  const { geometries: loadedGeometries, isLoading } = useSafeStlLoader(urls);
  const { meshes, initializeMeshes } = useStlModel()!;

  useEffect(() => {
    if (loadedGeometries && loadedGeometries.length > 0 && meshes.length === 0) {
      initializeMeshes(loadedGeometries, activeMeshes);
    }
  }, [loadedGeometries, activeMeshes, initializeMeshes, meshes.length]);

  if (!isLoading && (!meshes || meshes.length === 0 || meshes[0].geometry.attributes.position.count === 0)) {
    console.warn('Empty STL loaded — no geometry found');
    return null;
  }

  return (
    <>
      {meshes.map((mesh, index) => (
        <MeshComponent
          key={index}
          geometry={mesh.geometry}
          visible={mesh.visible}
          localRef={mesh.ref}
          color={mesh.color}
          opacity={mesh.opacity}
        />
      ))}
    </>
  );
};

export default Model;
const MeshComponent = ({
  geometry,
  visible,
  localRef,
  color,
  opacity,
}: {
  geometry: THREE.BufferGeometry;
  visible: boolean;
  localRef: React.RefObject<THREE.Mesh>;
  color: string;
  opacity?: number;
}) => {
  const { planeHandler } = useStlDisplay();
  const { isCut } = planeHandler;
  const planes = planeHandler.getPlanes();
  const { camera, gl } = useThree();
  const material = useRef<THREE.MeshStandardMaterial>(new THREE.MeshStandardMaterial());

  // Only initialize once
  useEffect(() => {
    if (localRef.current && geometry && !localRef.current.userData.initialized) {
      initializeSTLModel(geometry, camera, localRef, gl);
      localRef.current.userData.initialized = true;
      localRef.current.userData.type = 'stlModel';
    }
  }, [geometry, camera, gl, localRef]);

  // Always update material when props change
  useEffect(() => {
    if (!material.current) return;
    material.current.color.set(color);
    material.current.opacity = opacity ?? 1;
    material.current.transparent = opacity !== undefined && opacity < 1;
    material.current.clipIntersection = true;
    material.current.clipShadows = true;
    material.current.metalness = 0.1;
    material.current.roughness = 0.6;
    material.current.clippingPlanes = planes.length > 0 && isCut ? planes.map((item) => item.plane) : null;
    material.current.needsUpdate = true;
  }, [color, opacity, planes, isCut]);

  return (
    <group rotation={[-Math.PI / 2, 0, 0]}>
      <mesh ref={localRef} geometry={geometry} visible={visible} material={material.current} renderOrder={-1} />
    </group>
  );
};
