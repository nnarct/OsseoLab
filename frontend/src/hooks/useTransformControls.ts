import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { useThree } from '@react-three/fiber';

export const useTransformControls = (
  isActive: boolean,
  planeRef: React.RefObject<THREE.Mesh>,
  updatePlane: () => void
) => {
  const transformRef = useRef<THREE.TransformControls>(null);
  const { gl } = useThree();

  useEffect(() => {
    if (isActive && transformRef.current && planeRef.current) {
      transformRef.current.attach(planeRef.current);
    }
  }, [isActive, planeRef]);

  useEffect(() => {
    const transform = transformRef.current;
    if (transform) {
      transform.addEventListener('change', updatePlane);
    }
    return () => {
      transform?.removeEventListener('change', updatePlane);
    };
  }, [updatePlane]);

  return { transformRef, domElement: gl.domElement };
};
