import { useThree } from '@react-three/fiber';
import { useEffect } from 'react';
import { useSceneStore } from '@/store/useSceneStore';

const SceneSetter = () => {
  const { scene } = useThree();
  const setScene = useSceneStore((state) => state.setScene);

  useEffect(() => {
    setScene(scene);
  }, [scene, setScene]);

  return null;
};

export default SceneSetter;