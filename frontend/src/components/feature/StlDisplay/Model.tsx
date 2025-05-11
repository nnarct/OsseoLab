import { Ref, useEffect, useRef, useState, useMemo, createRef } from 'react';
import { useThree } from '@react-three/fiber';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import * as THREE from 'three';
import { useStlDisplay } from '@/hooks/useStlDisplay';
import { initializeSTLModel } from '@/utils/stlUtils';

const useSafeStlLoader = (urls: string[]): THREE.BufferGeometry[] => {
  const [geometries, setGeometries] = useState<THREE.BufferGeometry[]>([]);

  useEffect(() => {
    const loader = new STLLoader();

    const loadAll = async () => {
      const loadedGeometries: THREE.BufferGeometry[] = [];

      for (const url of urls) {
        try {
          const text = await fetch(url).then((res) => res.text());

          if (text.trim() === 'solid\nendsolid' || text.trim() === 'solid\r\nendsolid') {
            console.warn(`Empty STL — skipping: ${url}`);
            continue;
          }

          const buffer = await fetch(url).then((res) => res.arrayBuffer());
          const geometry = loader.parse(buffer);
          loadedGeometries.push(geometry);
        } catch (err) {
          console.error('Error loading STL:', err);
        }
      }

      setGeometries(loadedGeometries);
    };

    loadAll();
  }, [urls]);

  return geometries;
};

const Model = ({ urls }: { urls: string[] }) => {
  // console.log('render <Model/>')
  const { camera, gl } = useThree();
  const { planeHandler } = useStlDisplay();
  const { isCut } = planeHandler;
  const planes = planeHandler.getPlanes();

  const { visibleMeshes, setVisibleMeshes } = useStlDisplay().meshVisibility;

  const geometries = useSafeStlLoader(urls);

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
}: {
  geometry: THREE.BufferGeometry;
  camera: THREE.Camera;
  materialRef: Ref<THREE.MeshStandardMaterial>;
  gl: THREE.WebGLRenderer;
  visible: boolean;
  onClick?: () => void;
  localRef: Ref<THREE.Mesh>;
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
        color='#E8D7C0'
        metalness={0.1}
        roughness={0.6}
        clipIntersection
        clipShadows
      />
    </mesh>
  );
};
