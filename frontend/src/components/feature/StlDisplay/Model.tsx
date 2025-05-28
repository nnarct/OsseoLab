import { Ref, useEffect, useRef, useMemo, createRef } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { initializeSTLModel } from '@/utils/stlUtils';
import { useStlDisplay } from '@/hooks/useStlDisplay';
import { useStlModel } from '@/hooks/useStlModel';
import useSafeStlLoader from '@/hooks/useSafeStlLoader';

const Model = ({ urls, names }: { urls: string[]; names: string[] }) => {
  const { geometries: loadedGeometries, isLoading } = useSafeStlLoader(urls);
  const { geometries, setGeometries, setNames, meshColors, meshVisibility, meshOpacities } = useStlModel()!;

  useEffect(() => {
    if (loadedGeometries && loadedGeometries.length > 0) {
      setGeometries(loadedGeometries);
      setNames(names);
    }
  }, [loadedGeometries, names, setGeometries, setNames]);

  const meshRefs = useMemo(() => urls.map(() => createRef<THREE.Mesh>()), [urls]);

  // Removed useEffect that initializes visibleMeshes

  if (!isLoading && (!geometries || geometries.length === 0 || geometries[0].attributes.position.count === 0)) {
    console.warn('Empty STL loaded — no geometry found');
    return null;
  }

  return (
    <>
      {geometries.map((geometry, index) => (
        <MeshComponent
          key={index}
          geometry={geometry}
          visible={meshVisibility[index]}
          localRef={meshRefs[index]}
          color={meshColors[index % meshColors.length]}
          opacity={meshOpacities[index]}
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
  onClick?: () => void;
  localRef: Ref<THREE.Mesh>;
  color: string;
  opacity?: number;
}) => {
  const { planeHandler } = useStlDisplay();
  const { isCut } = planeHandler;
  const planes = planeHandler.getPlanes();
  const { camera, gl } = useThree();

  useEffect(() => {
    if (localRef) {
      if (!localRef.current || !geometry || localRef.current.userData.initialized) return;

      initializeSTLModel(geometry, camera, localRef, gl);
      localRef.current.userData.initialized = true;
      localRef.current.userData.type = 'stlModel';
    }
  }, [geometry, camera, gl, localRef]);

  const material = useRef<THREE.MeshStandardMaterial>();

  useEffect(() => {
    if (!material.current) {
      material.current = new THREE.MeshStandardMaterial();
    }

    material.current.color = new THREE.Color(color);
    material.current.metalness = 0.1;
    material.current.roughness = 0.6;
    material.current.clipIntersection = true;
    material.current.clipShadows = true;
    material.current.opacity = opacity ?? 1;
    material.current.transparent = opacity !== undefined && opacity < 1;

    if (planes.length > 0 && isCut) {
      material.current.clippingPlanes = planes.map((item) => item.plane);
    } else {
      material.current.clippingPlanes = null;
    }

    material.current.needsUpdate = true;
  }, [color, opacity, planes, isCut]);

  return (
    <group rotation={[-Math.PI / 2, 0, 0]}>
      <mesh ref={localRef} geometry={geometry} visible={visible} material={material.current} />
    </group>
  );
};
