import { TransformControls } from '@react-three/drei';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import type { TransformControlsMode } from '@/types/stlDisplay';

import { createClippingPlaneMaterial } from '@/utils/stlUtils';
import { useTransformControls } from '@/hooks/useTransformControls';
import { usePlaneUpdater } from '@/hooks/usePlaneUpdater';
import { useStlDisplay } from '@/hooks/useStlDisplay';

const ClippingPlane = ({
  plane,
  mode,
  id,
  frontColor = '#00ff00',
  backColor = '#ff0000',
  opacity = 0.5,
  show,
  meshRef,
}: {
  plane: THREE.Plane;
  id: string;
  mode: TransformControlsMode;
  frontColor?: string;
  backColor?: string;
  opacity?: number;
  show: boolean;
  meshRef: React.RefObject<THREE.Mesh>;
}) => {
  const planeRef = meshRef;
  const { planeHandler, tool } = useStlDisplay();
  const updatePlane = usePlaneUpdater(plane, id);

  const isActive = id === planeHandler.activePlaneId && tool.current === 'plane';

  const { transformRef, camera, domElement } = useTransformControls(isActive, planeRef, () =>
    updatePlane(planeRef.current)
  );
  const material = createClippingPlaneMaterial(frontColor, backColor, opacity);
  useEffect(() => {
    if (planeRef.current) {
      const mesh = planeRef.current;
      const origin = mesh.getWorldPosition(new THREE.Vector3());
      const normal = new THREE.Vector3(0, 0, 1)
        .applyQuaternion(mesh.getWorldQuaternion(new THREE.Quaternion()))
        .normalize();
  
      const arrowHelper = new THREE.ArrowHelper(normal, origin, 30, 0xff0000);
      mesh.add(arrowHelper);
    }
  }, [planeRef]);
  return (
    <>
      {isActive && (
        <TransformControls
          ref={transformRef}
          object={planeRef.current || undefined}
          mode={mode}
          camera={camera}
          domElement={domElement}
          onMouseUp={() => updatePlane(planeRef.current)}
          onObjectChange={() => {
            updatePlane(planeRef.current);
            // const mesh = planeRef.current;
            // if (mesh) {
            //   const plane_origin = mesh.getWorldPosition(new THREE.Vector3());
            //   const plane_normal = new THREE.Vector3(0, 0, 1)
            //     .applyQuaternion(mesh.getWorldQuaternion(new THREE.Quaternion()))
            //     .normalize();
            //   const plane_constant = -plane_normal.dot(plane_origin);

            //   const convertVectorToTrimeshSpace = (v: THREE.Vector3) => new THREE.Vector3(-v.x, v.z, -v.y);

            //   const converted_normal = convertVectorToTrimeshSpace(plane_normal);
            //   const converted_origin = convertVectorToTrimeshSpace(plane_origin);
            //   const converted_constant = -converted_normal.dot(converted_origin);
            //   // console.log(`ori:${plane_normal.x},${plane_normal.y},${plane_normal.z}`);
            //   // console.log(`con:${converted_normal.x},${converted_normal.y},${converted_normal.z}`);
            //   // console.log({
            //   //   plane_origin: converted_origin,
            //   //   plane_normal: converted_normal,
            //   //   plane_constant: converted_constant,
            //   // });
            //   // console.log({
            //   //   plane_origin,
            //   //   plane_normal,
            //   //   plane_constant,
            //   // });
            // }
          }}
        />
      )}
      <mesh ref={planeRef} userData={{ type: 'clippingPlane' }} name={id} visible={show}>
        <planeGeometry args={[150, 150]} />
        <primitive object={material} />
      </mesh>
    </>
  );
};

export default ClippingPlane;
