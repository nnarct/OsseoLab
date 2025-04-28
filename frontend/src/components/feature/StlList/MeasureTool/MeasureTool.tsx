import * as THREE from 'three';
import { useRef, useState, useEffect, useMemo } from 'react';
import { useThree } from '@react-three/fiber';
import { Line, Text } from '@react-three/drei';
import { useMeasureStore } from '@/store/useMeasureStore';
import type { MarkerProps, IntersectionData } from '@/types/measureTool';

const Marker = ({ position, normal, radius, lookAtNormal = true }: MarkerProps) => {
  const markerRef = useRef<THREE.Object3D>(null);

  const lineMaterial = useMemo(() => {
    return new THREE.LineBasicMaterial({
      color: 0x00ffe8,
      depthTest: false,
      polygonOffset: true,
      polygonOffsetFactor: -1,
    });
  }, []);

  const circlePoints = useMemo(() => {
    const curve = new THREE.EllipseCurve(0, 0, radius, radius, 0, 2 * Math.PI, false, 0);
    return curve.getPoints(50).map((p) => new THREE.Vector3(p.x, p.y, 0));
  }, [radius]);

  useEffect(() => {
    if (markerRef.current) {
      if (lookAtNormal) {
        const up = new THREE.Vector3(0, 0, 1);
        const quat = new THREE.Quaternion().setFromUnitVectors(up, normal.clone().normalize());
        markerRef.current.quaternion.copy(quat);
      } else {
        markerRef.current.quaternion.identity();
      }
      markerRef.current.position.copy(position);
    }
  }, [position, normal, lookAtNormal]);

  return (
    <object3D ref={markerRef}>
      <group>
        <Line points={circlePoints} material={lineMaterial} />
        <Line
          points={[
            [-radius, 0, 0],
            [radius, 0, 0],
          ]}
          material={lineMaterial}
        />
        <Line
          points={[
            [0, -radius, 0],
            [0, radius, 0],
          ]}
          material={lineMaterial}
        />
      </group>
    </object3D>
  );
};

export const MeasureTool = () => {
  const { camera, gl, scene } = useThree();
  const { markerPairs, setMarkerPairs, addMarker, currentMarker } = useMeasureStore();

  const [hoverMarker, setHoverMarker] = useState<IntersectionData | null>(null);
  const [markerRadius, setMarkerRadius] = useState<number>(1.0);
  const [mouseDownPosition, setMouseDownPosition] = useState<{ x: number; y: number } | null>(null);

  const setPanelInfo = useMeasureStore.getState().setPanelInfo;

  useEffect(() => {
    const box = new THREE.Box3().setFromObject(scene);
    const sphere = box.getBoundingSphere(new THREE.Sphere());
    if (sphere.radius > 0) {
      setMarkerRadius(sphere.radius / 100.0);
    }
  }, [scene]);

  const handleClick = (event: MouseEvent) => {

    const intersection = getIntersection(event.clientX, event.clientY);
    if (!intersection) {
      setMarkerPairs([]);
      setPanelInfo('Select a point.');
      return;
    }

    const movedPoint = intersection.point.clone().add(intersection.normal.clone().multiplyScalar(0.01));

    const markerData = {
      point: movedPoint,
      normal: intersection.normal,
    };

    addMarker(markerData);
  };

  const handleMouseMove = (event: MouseEvent) => {
    const intersection = getIntersection(event.clientX, event.clientY);
    setHoverMarker(intersection);
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

  // useEffect(() => {
  // if (markers.length === 2) {
  //   const distance = markers[0].point.distanceTo(markers[1].point).toFixed(3);
  //   const angle = markers[0].normal.angleTo(markers[1].normal) * (180 / Math.PI);
  //   setPanelInfo(`Distance: ${distance} units \nAngle: ${angle.toFixed(1)}\u00b0`);
  // }

  // }, [markers]);

  function getIntersection(x: number, y: number): IntersectionData | null {
    const mouse = new THREE.Vector2();
    const canvas = gl.domElement;
    const rect = canvas.getBoundingClientRect();
  
    mouse.x = ((x - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((y - rect.top) / rect.height) * 2 + 1;
  
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);
  
    const intersects = raycaster.intersectObjects(scene.children, true);
    console.log('Intersects:', intersects); // ← add this
  
    for (const intersect of intersects) {
      if (intersect.face && intersect.object) {
        const normalMatrix = new THREE.Matrix3().getNormalMatrix(intersect.object.matrixWorld);
        const worldNormal = intersect.face.normal.clone().applyMatrix3(normalMatrix).normalize();
        const point = intersect.point.clone().add(worldNormal.clone().multiplyScalar(0.01));
        return { point, normal: worldNormal };
      }
    }
    return null;
  }
  
  useEffect(() => {
    console.log({ currentMarker, markerPairs });
  }, [currentMarker, markerPairs]);
  return (
    <>
      {hoverMarker && (
        <Marker position={hoverMarker.point} normal={hoverMarker.normal} radius={markerRadius} lookAtNormal={true} />
      )}
      {currentMarker[0] && (
        <Marker position={currentMarker[0].point} normal={currentMarker[0].normal} radius={markerRadius} />
      )}
      {markerPairs.map((pair, index) => (
        <group key={index}>
          <Marker position={pair.origin.point} normal={pair.origin.normal} radius={markerRadius} />
          <Marker position={pair.destination.point} normal={pair.destination.normal} radius={markerRadius} />
          <Line
            points={[pair.origin.point, pair.destination.point]}
            color='#fffb00'
            lineWidth={1}
            depthTest={false}
            polygonOffset={true}
            polygonOffsetFactor={-1}
          />
          <group
            position={
              pair.origin.point.clone()
                .add(pair.destination.point)
                .multiplyScalar(0.5)
                .add(new THREE.Vector3(0, markerRadius * 2, 0))
            }
          >
            <mesh>
              <circleGeometry args={[markerRadius * 1.8, 32]} />
              <meshBasicMaterial color="white" />
            </mesh>
            <Text
              fontSize={markerRadius * 2}
              color="black"
              anchorX="center"
              anchorY="middle"
            >
              {index + 1}
            </Text>
          </group>
        </group>
      ))}
    </>
  );
};
