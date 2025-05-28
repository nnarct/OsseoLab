import { TransformControls } from '@react-three/drei';
import { useEffect } from 'react';
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
      const normal = new THREE.Vector3(0, 0, -1)
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
          onObjectChange={() => {}}
        />
      )}
      <mesh ref={planeRef} userData={{ type: 'clippingPlane' }} name={id} visible={show}>
        <planeGeometry args={[150, 150]} />
        <primitive object={material ?? undefined} />
      </mesh>
    </>
  );
};

export default ClippingPlane;
