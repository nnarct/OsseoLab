import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { useThree } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { useStlDisplay } from '@/hooks/useStlDisplay';

export default function AngleMeasure() {
  const { camera, gl, scene } = useThree();
  const groupRef = useRef(new THREE.Group());
  const stepRef = useRef(0);
  const pointsRef = useRef<THREE.Vector3[]>([]);
  const hoverCrossRef = useRef<THREE.Group>();

  const [angle, setAngle] = useState<number | null>(null);
  const [labelPos, setLabelPos] = useState<THREE.Vector3 | null>(null);
  const { isAngleActive } = useStlDisplay();

  useEffect(() => {
    const canvas = gl.domElement;
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    const drawLine = (p1: THREE.Vector3, p2: THREE.Vector3) => {
      const mat = new THREE.LineBasicMaterial({ color: 0xff0000 });
      const geo = new THREE.BufferGeometry().setFromPoints([p1, p2]);
      return new THREE.Line(geo, mat);
    };

    const createHoverCross = () => {
      const group = new THREE.Group();
      const length = 2;
      const mat = new THREE.LineBasicMaterial({ color: 0xffffff, depthTest: false });
      const horiz = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-length, 0, 0),
        new THREE.Vector3(length, 0, 0),
      ]);
      const vert = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, -length, 0),
        new THREE.Vector3(0, length, 0),
      ]);
      group.add(new THREE.Line(horiz, mat));
      group.add(new THREE.Line(vert, mat));
      group.visible = false;
      return group;
    };

    if (!hoverCrossRef.current) {
      const cross = createHoverCross();
      hoverCrossRef.current = cross;
      scene.add(cross);
    }

    const handleClick = (e: MouseEvent) => {
      if (!isAngleActive) return;
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(scene.children, true);
      if (!hits.length) return;
      const pt = hits[0].point.clone();

      switch (stepRef.current) {
        case 0: {
          const dotA = new THREE.Mesh(
            new THREE.SphereGeometry(0.8, 16, 16),
            new THREE.MeshBasicMaterial({ color: 0xff0000 })
          );
          dotA.position.copy(pt);
          groupRef.current.add(dotA);
          pointsRef.current[0] = pt;
          stepRef.current = 1;
          break;
        }
        case 1: {
          const dotB = new THREE.Mesh(
            new THREE.SphereGeometry(0.8, 16, 16),
            new THREE.MeshBasicMaterial({ color: 0xff0000 })
          );
          dotB.position.copy(pt);
          groupRef.current.add(dotB);
          pointsRef.current[1] = pt;
          groupRef.current.children.filter((c) => c.userData.live).forEach((c) => groupRef.current.remove(c));
          groupRef.current.add(drawLine(pointsRef.current[0], pointsRef.current[1]));
          stepRef.current = 2;
          break;
        }
        case 2: {
          const dotC = new THREE.Mesh(
            new THREE.SphereGeometry(0.8, 16, 16),
            new THREE.MeshBasicMaterial({ color: 0xff0000 })
          );
          dotC.position.copy(pt);
          dotC.userData.preview = true;
          groupRef.current.add(dotC);
          pointsRef.current[2] = pt;

          const line2 = drawLine(pointsRef.current[1], pt);
          line2.userData.phase3 = true;
          groupRef.current.add(line2);

          setLabelPos(pointsRef.current[1].clone());
          setAngle(0);
          stepRef.current = 3;
          break;
        }
        case 3: {
          stepRef.current = 4;
          break;
        }
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(scene.children, true);
      if (!hits.length) {
        if (hoverCrossRef.current) hoverCrossRef.current.visible = false;
        return;
      }
      const pt = hits[0].point.clone();
      if (hoverCrossRef.current) {
        hoverCrossRef.current.visible = true;
        hoverCrossRef.current.position.copy(pt);
      }

      const step = stepRef.current;
      if (!isAngleActive || (step !== 1 && step !== 3)) return;

      if (step === 1) {
        groupRef.current.children.filter((c) => c.userData.live).forEach((c) => groupRef.current.remove(c));
        const liveLine = drawLine(pointsRef.current[0], pt);
        liveLine.userData.live = true;
        groupRef.current.add(liveLine);
      } else if (step === 3) {
        const previewDot = groupRef.current.children.find((c) => c.userData.preview) as THREE.Mesh;
        if (previewDot) previewDot.position.copy(pt);
        groupRef.current.children.filter((c) => c.userData.phase3).forEach((c) => groupRef.current.remove(c));
        const line2 = drawLine(pointsRef.current[1], pt);
        line2.userData.phase3 = true;
        groupRef.current.add(line2);
        const A = pointsRef.current[0];
        const B = pointsRef.current[1];
        const vBase = A.clone().sub(B).normalize();
        const vC = pt.clone().sub(B).normalize();
        const raw = THREE.MathUtils.clamp(vBase.dot(vC), -1, 1);
        const deg = THREE.MathUtils.radToDeg(Math.acos(raw));
        setAngle(deg);
      }
    };

    if (isAngleActive) {
      scene.add(groupRef.current);
      canvas.addEventListener('click', handleClick);
      canvas.addEventListener('mousemove', handleMouseMove);
    }

    return () => {
      canvas.removeEventListener('click', handleClick);
      canvas.removeEventListener('mousemove', handleMouseMove);
      scene.remove(groupRef.current);
      groupRef.current.clear();
      if (hoverCrossRef.current) scene.remove(hoverCrossRef.current);
      setAngle(null);
      setLabelPos(null);
      stepRef.current = 0;
      pointsRef.current = [];
    };
  }, [isAngleActive, camera, gl.domElement, scene]);

  return (
    <>
      {angle !== null && labelPos && (
        <Html position={[labelPos.x, labelPos.y, labelPos.z]} center>
          <div
            style={{
              padding: '4px 6px',
              background: 'rgba(255,100,50,0.9)',
              color: 'white',
              borderRadius: 4,
              fontWeight: 'bold',
              fontSize: '14px',
            }}
          >
            {angle.toFixed(1)}°
          </div>
        </Html>
      )}
    </>
  );
}
