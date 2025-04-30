import { useThree } from '@react-three/fiber';
import { useEffect } from 'react';
import { useSceneStore } from '@/store/useSceneStore';
import { useStlDisplay } from '@/hooks/useStlDisplay';
import * as THREE from 'three';

const SceneSetter = () => {
  const { scene } = useThree();
  const setScene = useSceneStore((state) => state.setScene);
const { setMarkerRadius } = useStlDisplay().tool;
  useEffect(() => {
    setScene(scene);
  }, [scene, setScene]);
  useEffect(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const sphere = box.getBoundingSphere(new THREE.Sphere());
    if (sphere.radius > 0) {
      setMarkerRadius(sphere.radius / 100.0);
    }
  }, [scene]);
  return null;
};

export default SceneSetter;
