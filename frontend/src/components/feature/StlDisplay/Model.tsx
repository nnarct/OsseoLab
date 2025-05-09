import { Ref, useEffect, useRef, useState } from 'react';
import { useLoader, useThree } from '@react-three/fiber';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import * as THREE from 'three';
import { useStlDisplay } from '@/hooks/useStlDisplay';
import { initializeSTLModel } from '@/utils/stlUtils';
import { Html } from '@react-three/drei';
import { Button } from 'antd';

const Model = ({ urls }: { urls: string[] }) => {
  console.log('render <Model/>')
  const { camera, gl } = useThree();
  const { planeHandler } = useStlDisplay();
  const { isCut } = planeHandler;
  const planes = planeHandler.getPlanes();

  const { visibleMeshes, toggleVisibility, setVisibleMeshes } = useStlDisplay().meshVisibility;

  const geometries = useLoader(STLLoader, urls) as THREE.BufferGeometry[];

  const materialRef = useRef<THREE.MeshStandardMaterial>(null);

  useEffect(() => {
    const initialVisibility: Record<string, boolean> = {};
    urls.forEach((url) => {
      initialVisibility[url] = true;
    });
    setVisibleMeshes(initialVisibility);
  }, [urls]);

  useEffect(() => {
    if (materialRef.current && planes.length > 0 && isCut) {
      materialRef.current.clippingPlanes = planes.map((item) => item.plane);
    } else if (materialRef.current && !isCut) {
      materialRef.current.clippingPlanes = null;
    }
  }, [planes, isCut]);

  if (!geometries || geometries.length === 0) return null;
  return (
    <>
      {/* <Html fullscreen zIndexRange={[1, 0]}>
        <div style={{
          position: 'absolute',
          top: 20,
          left: 20,
          background: 'white',
          padding: '8px',
          borderRadius: '4px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.2)'
        }}>
          {urls.map((url, index) => (
            <Button
              key={url}
              onClick={() => toggleVisibility(url)}
              style={{
                display: 'block',
                marginBottom: '4px',
                padding: '4px 8px',
                background: visibleMeshes[url] ? '#ffcccc' : '#ccffcc',
                border: '1px solid #ccc',
                cursor: 'pointer',
              }}
            >
              {visibleMeshes[url] ? `Hide Mesh ${index + 1}` : `Show Mesh ${index + 1}`}
            </Button>
          ))}
        </div>
      </Html> */}
      {geometries.map((geometry, index) => (
        <MeshComponent
          key={index}
          geometry={geometry}
          camera={camera}
          materialRef={materialRef}
          gl={gl}
          visible={visibleMeshes[urls[index]]}
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
}: {
  geometry: THREE.BufferGeometry;
  camera: THREE.Camera;
  materialRef: Ref<THREE.MeshStandardMaterial>;
  gl: THREE.WebGLRenderer;
  visible: boolean;
  onClick?: () => void;
}) => {
  console.log('render <MeshComponent/>')
  const localRef = useRef<THREE.Mesh>(null);

  useEffect(() => {
    initializeSTLModel(geometry, camera, localRef, gl);
  }, [geometry, camera, gl]);

  return (
    <mesh
      ref={localRef}
      geometry={geometry}
      visible={visible}
      userData={{ type: 'stlModel' }}
    >
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
