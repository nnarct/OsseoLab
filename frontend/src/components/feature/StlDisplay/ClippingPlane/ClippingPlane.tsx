import { useMemo } from 'react'; // Import useMemo and useRef
import { TransformControls } from '@react-three/drei';
import * as THREE from 'three';
import type { TransformControlsMode } from '@/types/stlDisplay';
import { createClippingPlaneMaterial } from '@/utils/stlUtils';
import { useTransformControls } from '@/hooks/useTransformControls';
import { usePlaneUpdater } from '@/hooks/usePlaneUpdater';
import { useStlDisplay } from '@/hooks/useStlDisplay';
import { useThree } from '@react-three/fiber';
import { DEFAULT_BACK_COLOR, DEFAULT_FRONT_COLOR, DEFAULT_OPACITY } from '@/constants/clippingPlane';

interface ClippingPlaneProps {
  plane: THREE.Plane;
  id: string;
  mode: TransformControlsMode;
  frontColor?: string;
  backColor?: string;
  opacity?: number;
  show: boolean;
  meshRef: React.RefObject<THREE.Mesh>;
}

const ClippingPlane = ({
  plane,
  mode,
  id,
  frontColor = DEFAULT_FRONT_COLOR,
  backColor = DEFAULT_BACK_COLOR,
  opacity = DEFAULT_OPACITY,
  show,
  meshRef,
}: ClippingPlaneProps) => {
  const { planeHandler, tool } = useStlDisplay();
  const { camera } = useThree();

  const updatePlane = usePlaneUpdater(plane, id);

  const isActive = id === planeHandler.activePlaneId && tool.current === 'plane';

  const { transformRef, domElement } = useTransformControls(isActive, meshRef, () => updatePlane(meshRef.current));

  const material = useMemo(
    () => createClippingPlaneMaterial(frontColor, backColor, opacity),
    [frontColor, backColor, opacity]
  );

  return (
    <>
      {isActive && (
        <TransformControls
          ref={transformRef}
          object={meshRef.current || undefined}
          mode={mode}
          camera={camera}
          domElement={domElement}
          onMouseUp={() => updatePlane(meshRef.current)}
        />
      )}

      <mesh ref={meshRef} userData={{ type: 'clippingPlane', id }} name={id} visible={show}>
        <planeGeometry args={[150, 150]} />

        <primitive object={material} attach='material' />
      </mesh>
    </>
  );
};

export default ClippingPlane;
