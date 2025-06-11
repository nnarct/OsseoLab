import { useThree } from '@react-three/fiber';
import { useEffect } from 'react';
import { useSceneStore } from '@/store/useSceneStore';
import { useStlDisplay } from '@/hooks/useStlDisplay';
import * as THREE from 'three';

const SceneSetter = () => {
  const { scene, camera, gl } = useThree();
  const setScene = useSceneStore((state) => state.setScene);
  const { sceneHandlerRef } = useStlDisplay();
  const { setMarkerRadius } = useStlDisplay().tool;
  useEffect(() => {
    setScene(scene);
    if (sceneHandlerRef.current) {
      sceneHandlerRef.current.scene = scene;
    }
  }, [scene, sceneHandlerRef, setScene]);
  useEffect(() => {
    gl.localClippingEnabled = true;
  }, [gl]);
  useEffect(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const sphere = box.getBoundingSphere(new THREE.Sphere());
    if (sphere.radius > 0) {
      setMarkerRadius(sphere.radius / 100.0);
    }
  }, [scene, setMarkerRadius]);
  useEffect(() => {
    camera.position.set(0, 0, 200);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    camera.updateProjectionMatrix();
  }, [camera]);
  return null;
};

export default SceneSetter;
