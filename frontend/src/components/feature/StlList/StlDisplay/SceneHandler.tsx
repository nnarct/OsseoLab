import { useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { forwardRef, useImperativeHandle } from 'react';

const SceneHandler = forwardRef(
  ({ selectedCutPlanes, planes }: { selectedCutPlanes: string[]; planes: any[] }, ref) => {
    const { scene } = useThree();

    useImperativeHandle(ref, () => ({
      applyCut: () => {
        if (!selectedCutPlanes[0]) return;

        if (selectedCutPlanes.length === 1) {
          const selectedPlane = planes.find((p) => p.id === selectedCutPlanes[0]);
          if (!selectedPlane) return;

          const planeNormal = selectedPlane.plane.normal.clone();
          const planeConstant = selectedPlane.plane.constant;

          scene.traverse((object) => {
            if (object.isMesh) {
              const objectPosition = new THREE.Vector3();
              object.getWorldPosition(objectPosition);

              const distance = planeNormal.dot(objectPosition) - planeConstant;
              if (distance > 0) {
                object.visible = false;
              }
            }
          });
        }

        if (selectedCutPlanes.length === 2) {
          const plane1 = planes.find((p) => p.id === selectedCutPlanes[0]);
          const plane2 = planes.find((p) => p.id === selectedCutPlanes[1]);
          if (!plane1 || !plane2) return;

          const normal1 = plane1.plane.normal.clone();
          const normal2 = plane2.plane.normal.clone();
          const constant1 = plane1.plane.constant;
          const constant2 = plane2.plane.constant;

          scene.traverse((object) => {
            if (object.isMesh) {
              const objectPosition = new THREE.Vector3();
              object.getWorldPosition(objectPosition);

              const distance1 = normal1.dot(objectPosition) - constant1;
              const distance2 = normal2.dot(objectPosition) - constant2;

              if ((distance1 < 0 && distance2 > 0) || (distance1 > 0 && distance2 < 0)) {
                object.visible = false;
              }
            }
          });
        }
      },
    }));

    return null;
  }
);

export default SceneHandler;
