import { TransformControls } from '@react-three/drei';
import * as THREE from 'three';
import type { TransformControlsMode } from '@/types/stlDisplay';

import { createClippingPlaneMaterial } from '@/utils/stlUtils';
import { useTransformControls } from '@/hooks/useTransformControls';
import { usePlaneUpdater } from '@/hooks/usePlaneUpdater';
import { useStlDisplay } from '@/hooks/useStlDisplay';
import { useThree } from '@react-three/fiber';

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
  const { planeHandler, tool } = useStlDisplay();
  const { camera } = useThree();
  const updatePlane = usePlaneUpdater(plane, id);
  const isActive = id === planeHandler.activePlaneId && tool.current === 'plane';

  const { transformRef, domElement } = useTransformControls(isActive, meshRef, () => updatePlane(meshRef.current));
  const material = createClippingPlaneMaterial(frontColor, backColor, opacity);
  // useEffect(() => {
  //   if (!planeRef.current) {
  //     return;
  //   }
  //   // const mesh = planeRef.current;
  //   // const origin = mesh.getWorldPosition(new THREE.Vector3());
  //   // const normal = new THREE.Vector3(0, 0, -1)
  //   // .applyQuaternion(mesh.getWorldQuaternion(new THREE.Quaternion()))
  //   // .normalize();

  //   // const arrowHelper = new THREE.ArrowHelper(normal, origin, 30, 0xff0000);
  //   // mesh.add(arrowHelper);
  // }, [planeRef]);

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
          onObjectChange={() => {}}
        />
      )}
      <mesh ref={meshRef} userData={{ type: 'clippingPlane', id }} name={id} visible={show}>
        <planeGeometry args={[150, 150]} />
        <primitive object={material ?? undefined} />
      </mesh>
    </>
  );
};

export default ClippingPlane;
