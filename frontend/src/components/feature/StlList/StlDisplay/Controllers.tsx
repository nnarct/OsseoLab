import { OrbitControls, GizmoHelper, GizmoViewcube } from '@react-three/drei';
import Lighting from './Lighting';

const Controllers = () => {
  return (
    <>
      <OrbitControls makeDefault />
      <GizmoHelper alignment='bottom-right' margin={[80, 80]}>
        <GizmoViewcube />
      </GizmoHelper>
      <Lighting />
    </>
  );
};

export default Controllers;
