import * as THREE from 'three';
import { useState, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { Line, Html } from '@react-three/drei';
import type { IntersectionData } from '@/types/measureTool';
import { useStlDisplay } from '@/hooks/useStlDisplay';

import Marker from '@/components/feature/StlDisplay/MeasureTool/Marker';


const AngleTool = () => {
  const { camera, gl, scene } = useThree();

  
  const [markerRadius, setMarkerRadius] = useState<number>(1.0);
  const [mouseDownPosition, setMouseDownPosition] = useState<{ x: number; y: number } | null>(null);
  const [hoverMarker, setHoverMarker] = useState<IntersectionData | null>(null);
  const [panelInfo, setPanelInfo] = useState<string>('Select a point.');

  const {angleHandler} = useStlDisplay();
  const { currentAngleGroup, angleGroup, addMarker, clear } = angleHandler;
  useEffect(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const sphere = box.getBoundingSphere(new THREE.Sphere());
    if (sphere.radius > 0) {
      setMarkerRadius(sphere.radius / 100.0);
    }

    // 🆕 New: Log size for scaleFactor estimation
    const size = new THREE.Vector3();
    box.getSize(size);
    console.log('🔎 Model size:', size); // Example: size.x (width), size.y (height), size.z (depth)
  }, [scene]);
 
  const getIntersection = (x: number, y: number): IntersectionData | null => {
    const mouse = new THREE.Vector2();
    const canvas = gl.domElement;
    const rect = canvas.getBoundingClientRect();

    mouse.x = ((x - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((y - rect.top) / rect.height) * 2 + 1;

    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(scene.children, true);

    //!! fix: extreme rerender
    // console.log('Intersects:', intersects); // ← add this

    for (const intersect of intersects) {
      if (intersect.face && intersect.object) {
        const normalMatrix = new THREE.Matrix3().getNormalMatrix(intersect.object.matrixWorld);
        const worldNormal = intersect.face.normal.clone().applyMatrix3(normalMatrix).normalize();
        const point = intersect.point.clone().add(worldNormal.clone().multiplyScalar(0.01));
        return { point, normal: worldNormal };
      }
    }
    return null;
  };

  const handleMouseMove = (event: MouseEvent) => {
    const intersection = getIntersection(event.clientX, event.clientY);
    if (intersection) {
      setHoverMarker(intersection);
    }
  };

  useEffect(() => {
    const handleMouseDown = (event: MouseEvent) => {
      setMouseDownPosition({ x: event.clientX, y: event.clientY });
    };

    const handleMouseUp = (event: MouseEvent) => {
      if (!mouseDownPosition) return;

      const dx = event.clientX - mouseDownPosition.x;
      const dy = event.clientY - mouseDownPosition.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < 5) {
        handleClick(event); // คลิกจริง
      }
      setMouseDownPosition(null);
    };

    gl.domElement.addEventListener('mousedown', handleMouseDown);
    gl.domElement.addEventListener('mouseup', handleMouseUp);
    gl.domElement.addEventListener('mousemove', handleMouseMove);

    return () => {
      gl.domElement.removeEventListener('mousedown', handleMouseDown);
      gl.domElement.removeEventListener('mouseup', handleMouseUp);
      gl.domElement.removeEventListener('mousemove', handleMouseMove);
    };
  }, [mouseDownPosition]);

  

  const handleClick = (event: MouseEvent) => {
    const intersection = getIntersection(event.clientX, event.clientY);
    if (!intersection) {
      clear();
      setPanelInfo('Select a point.');
      return;
    }

    const movedPoint = intersection.point.clone().add(intersection.normal.clone().multiplyScalar(0.01));

    const markerData = {
      point: movedPoint,
      normal: intersection.normal,
    };
    console.log('Adding marker');
    addMarker(markerData);
  };

  return (
    <>
      {hoverMarker && (
        <Marker position={hoverMarker.point} normal={hoverMarker.normal} radius={markerRadius} lookAtNormal={true} />
      )}

      {currentAngleGroup && currentAngleGroup.length > 0 && (
        <Marker position={currentAngleGroup[0].point} normal={currentAngleGroup[0].normal} radius={markerRadius} />
      )}
      {currentAngleGroup && currentAngleGroup.length === 2 && (
        <>
          {' '}
          <Marker position={currentAngleGroup[1].point} normal={currentAngleGroup[1].normal} radius={markerRadius} />
          <Line
            points={[currentAngleGroup[0].point, currentAngleGroup[1].point]}
            color='red'
            lineWidth={1}
            depthTest={false}
            polygonOffset={true}
            polygonOffsetFactor={-1}
          />
        </>
      )}

      {currentAngleGroup.length !== 0 && hoverMarker && (
        <Line
          points={[currentAngleGroup[currentAngleGroup.length - 1].point, hoverMarker.point]}
          color='red'
          lineWidth={1}
          depthTest={false}
          polygonOffset={true}
          polygonOffsetFactor={-1}
        />
      )}

      {angleGroup?.map((triple, index) => {
        // const midPoint = triple.origin.point
        //   .clone()
        //   .add(triple.destination.point)
        //   .multiplyScalar(0.5)
        //   .add(new THREE.Vector3(0, markerRadius * 2, 0));

        const vecA = triple.origin.point.clone().sub(triple.middle.point).normalize();
        const vecB = triple.destination.point.clone().sub(triple.middle.point).normalize();
        const angleRad = vecA.angleTo(vecB);
        const angleDeg = THREE.MathUtils.radToDeg(angleRad).toFixed(2);

        return (
          <group key={index}>
            <Marker position={triple.origin.point} normal={triple.origin.normal} radius={markerRadius} />
            <Marker position={triple.middle.point} normal={triple.origin.normal} radius={markerRadius} />
            <Marker position={triple.destination.point} normal={triple.destination.normal} radius={markerRadius} />

            <mesh position={triple.origin.point}>
              <sphereGeometry args={[markerRadius / 3, 16, 16]} />
              <meshBasicMaterial color='red' />
            </mesh>
            <mesh position={triple.middle.point}>
              <sphereGeometry args={[markerRadius / 3, 16, 16]} />
              <meshBasicMaterial color='red' />
            </mesh>

            <mesh position={triple.destination.point}>
              <sphereGeometry args={[markerRadius / 3, 16, 16]} />
              <meshBasicMaterial color='red' />
            </mesh>

            <Line
              points={[triple.origin.point, triple.middle.point]}
              color='#ff0000'
              lineWidth={1}
              depthTest={false}
              polygonOffset={true}
              polygonOffsetFactor={-1}
            />
            <Line
              points={[triple.middle.point, triple.destination.point]}
              color='#ff0000'
              lineWidth={1}
              depthTest={false}
              polygonOffset={true}
              polygonOffsetFactor={-1}
            />
            <Html
              position={triple.middle.point}
              center
              // style={{
              //   transform: `scale(${computeScale(camera, midPoint)})`,
              //   transformOrigin: 'center center',
              // }}
            >
              <div
                style={{
                  // width: '50vw',
                  padding: '0.5rem',
                  borderRadius: '0.5rem',
                  backgroundColor: '#ff6f00',
                  color: 'white',
                  // fontWeight: 'bold',
                  fontSize: '1rem',
                  boxShadow: '0 0 4px rgba(0,0,0,0.3)',
                  whiteSpace: 'nowrap',
                }}
              >
                {angleDeg}°
              </div>
            </Html>
          </group>
        );
      })}
    </>
  );
};

export default AngleTool;
