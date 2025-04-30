import { useCallback, useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import type { IntersectionData } from '@/types/measureTool';

export default function usePointerInteraction(
  camera: THREE.Camera,
  scene: THREE.Scene,
  gl: THREE.WebGLRenderer,
  // onClick: (intersection: IntersectionData | null) => void,
  onHover: (intersection: IntersectionData | null) => void,
  addMarker: (markerData: IntersectionData) => void
) {
  const mouseDownPosition = useRef<{ x: number; y: number } | null>(null);
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  // const {angleHandler, measureHandler , scene} = useStlDisplay();
  // const {clear} = toolType === 'measure' ? measureHandler : angleHandler;
  // const setPanelInfo = toolType === 'measure' ? measureHandler.setPanelInfo : angleHandler.setPanelInfo;
  // const addMarker = toolType === 'measure' ? measureHandler.addMarker : angleHandler.addMarker;

  const getIntersection = useCallback(
    (x: number, y: number): IntersectionData | null => {
      const mouse = new THREE.Vector2();
      const rect = gl.domElement.getBoundingClientRect();

      mouse.x = ((x - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((y - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);

      for (const intersect of intersects) {
        if (intersect.face && intersect.object) {
          const normalMatrix = new THREE.Matrix3().getNormalMatrix(intersect.object.matrixWorld);
          const worldNormal = intersect.face.normal.clone().applyMatrix3(normalMatrix).normalize();
          const point = intersect.point.clone().add(worldNormal.clone().multiplyScalar(0.01));
          return { point, normal: worldNormal };
        }
      }
      return null;
    },
    [camera, gl.domElement, raycaster, scene.children]
  );

  const onClick = useCallback(
    (intersection: IntersectionData | null) => {
      if (!intersection) {
        // clear();
        // setPanelInfo('Select a point.');
        return;
      }

      const movedPoint = intersection.point.clone().add(intersection.normal.clone().multiplyScalar(0.01));

      const markerData = {
        point: movedPoint,
        normal: intersection.normal,
      };

      addMarker(markerData);
    },
    [addMarker]
  );

  useEffect(() => {
    const canvas = gl.domElement;

    const handleMouseDown = (event: MouseEvent) => {
      mouseDownPosition.current = { x: event.clientX, y: event.clientY };
    };

    const handleMouseUp = (event: MouseEvent) => {
      if (!mouseDownPosition.current) return;

      const dx = event.clientX - mouseDownPosition.current.x;
      const dy = event.clientY - mouseDownPosition.current.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 5) {
        const intersection = getIntersection(event.clientX, event.clientY);
        onClick(intersection);
      }

      mouseDownPosition.current = null;
    };

    const handleMouseMove = (event: MouseEvent) => {
      const intersection = getIntersection(event.clientX, event.clientY);
      onHover(intersection);
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mousemove', handleMouseMove);

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('mousemove', handleMouseMove);
    };
  }, [camera, scene, gl, onClick, onHover, getIntersection]);
}
