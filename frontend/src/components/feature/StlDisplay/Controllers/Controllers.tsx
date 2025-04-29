import * as THREE from 'three';
import { OrbitControls, GizmoHelper, GizmoViewcube } from '@react-three/drei';
import { useStlDisplay } from '@/hooks/useStlDisplay';
import Lighting from './Lighting';
import { MIN_ZOOM, MAX_ZOOM } from '@/constants/stlDisplay';

const Controllers = () => {
  const { sceneHandlerRef } = useStlDisplay();

  return (
    <>
      <OrbitControls
        makeDefault
        minDistance={MIN_ZOOM}
        maxDistance={MAX_ZOOM}
        ref={(ref) => {
          if (ref) {
            const camera = ref.object;
            if (camera instanceof THREE.PerspectiveCamera) {
              sceneHandlerRef.current = {
                ...sceneHandlerRef.current,
                camera,
                controls: ref,
              };
            }
          }
        }}
      />

      <GizmoHelper alignment='bottom-right' margin={[80, 80]}>
        <GizmoViewcube />
      </GizmoHelper>
      <Lighting />
    </>
  );
};

export default Controllers;
