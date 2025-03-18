import { useCallback } from 'react';
import * as THREE from 'three';
import { useStlDisplay } from '@/hooks/useStlDisplay';

export const usePlaneUpdater = (plane: THREE.Plane, id: string) => {
  const { setPlanes } = useStlDisplay(); // Get context function

  const updatePlane = useCallback(
    (planeRef: THREE.Mesh | null) => {
      if (!planeRef) return;

      const worldNormal = new THREE.Vector3();
      const worldPosition = new THREE.Vector3();

      planeRef.getWorldPosition(worldPosition);
      worldNormal.set(0, 0, 1).applyQuaternion(planeRef.quaternion).normalize();

      plane.setFromNormalAndCoplanarPoint(worldNormal, worldPosition).normalize();

      // Use functional state update to prevent potential issues with stale state
      setPlanes((prevItems) => prevItems.map((item) => (item.id === id ? { ...item, plane: plane.clone() } : item)));
    },
    [id, plane, setPlanes]
  );

  return updatePlane;
};
