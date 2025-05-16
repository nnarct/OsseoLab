import { Ref, useEffect, useRef, useMemo, createRef } from 'react';
import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { initializeSTLModel } from '@/utils/stlUtils';
import { useStlDisplay } from '@/hooks/useStlDisplay';
import { useStlModel } from '@/hooks/useStlModel';
import useSafeStlLoader from '@/hooks/useSafeStlLoader';

const Model = ({ urls }: { urls: string[] }) => {
  // console.log('render <Model/>')
  const { camera, gl } = useThree();
  const { planeHandler } = useStlDisplay();
  const { isCut } = planeHandler;
  const planes = planeHandler.getPlanes();

  const { visibleMeshes, setVisibleMeshes } = useStlDisplay().meshVisibility;

  const loadedGeometries = useSafeStlLoader(urls);
  const { geometries, setGeometries, meshColors } = useStlModel()!;

  useEffect(() => {
    if (loadedGeometries && loadedGeometries.length > 0) {
      setGeometries(loadedGeometries);
    }
  }, [loadedGeometries, setGeometries]);

  const materialRef = useRef<THREE.MeshStandardMaterial>(null);
  const meshRefs = useMemo(() => urls.map(() => createRef<THREE.Mesh>()), [urls]);

  useEffect(() => {
    const initialVisibility: Record<string, boolean> = {};
    urls.forEach((url) => {
      initialVisibility[url] = true;
    });
    setVisibleMeshes(initialVisibility);
  }, [setVisibleMeshes, urls]);

  useEffect(() => {
    if (materialRef.current && planes.length > 0 && isCut) {
      materialRef.current.clippingPlanes = planes.map((item) => item.plane);
    } else if (materialRef.current && !isCut) {
      materialRef.current.clippingPlanes = null;
    }
  }, [planes, isCut]);

  if (!geometries || geometries.length === 0 || geometries[0].attributes.position.count === 0) {
    console.warn('Empty STL loaded — no geometry found');
    return null;
  }
  return (
    <>
      {geometries.map((geometry, index) => (
        <MeshComponent
          key={index}
          geometry={geometry}
          camera={camera}
          materialRef={materialRef}
          gl={gl}
          visible={visibleMeshes[urls[index]]}
          localRef={meshRefs[index]}
          color={meshColors[index % meshColors.length]}
        />
      ))}
    </>
  );
};

export default Model;

const MeshComponent = ({
  geometry,
  camera,
  materialRef,
  gl,
  visible,
  localRef,
  color,
}: {
  geometry: THREE.BufferGeometry;
  camera: THREE.Camera;
  materialRef: Ref<THREE.MeshStandardMaterial>;
  gl: THREE.WebGLRenderer;
  visible: boolean;
  onClick?: () => void;
  localRef: Ref<THREE.Mesh>;
  color: string;
}) => {
  useEffect(() => {
    if (localRef && 'current' in localRef && localRef.current) {
      initializeSTLModel(geometry, camera, localRef, gl);
    }
  }, [geometry, camera, gl, localRef]);

  return (
    <mesh ref={localRef} geometry={geometry} visible={visible} userData={{ type: 'stlModel' }}>
      <meshStandardMaterial
        ref={materialRef}
        color={color}
        metalness={0.1}
        roughness={0.6}
        clipIntersection
        clipShadows
      />
    </mesh>
  );
};
