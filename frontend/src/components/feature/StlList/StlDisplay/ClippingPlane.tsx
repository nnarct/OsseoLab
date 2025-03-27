import { TransformControls } from '@react-three/drei';
import { useRef } from 'react';
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
}: {
  plane: THREE.Plane;
  id: string;
  mode: TransformControlsMode;
  frontColor?: string;
  backColor?: string;
  opacity?: number;
}) => {
  const planeRef = useRef<THREE.Mesh>(null);
  const { activePlaneId } = useStlDisplay();
  const updatePlane = usePlaneUpdater(plane, id);
  const isActive = id === activePlaneId;

  const { transformRef, camera, domElement } = useTransformControls(isActive, planeRef, () =>
    updatePlane(planeRef.current)
  );
  const material = createClippingPlaneMaterial(frontColor, backColor, opacity);

  return (
    <>
      {isActive && (
        <TransformControls
          ref={transformRef}
          object={planeRef.current || undefined}
          mode={mode}
          camera={camera}
          domElement={domElement}
        />
      )}
      <mesh ref={planeRef}>
        <planeGeometry args={[50, 50]} />
        <primitive object={material} />
      </mesh>
    </>
  );
};

export default ClippingPlane;
