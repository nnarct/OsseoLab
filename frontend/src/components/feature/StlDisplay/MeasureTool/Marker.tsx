import { useRef, useEffect, useMemo } from 'react';
import { Line } from '@react-three/drei';
import type { MarkerProps } from '@/types/measureTool';
import * as THREE from 'three';

const Marker = ({ position, normal, radius, lookAtNormal = true }: MarkerProps) => {
  const markerRef = useRef<THREE.Object3D>(null);

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
        <Line points={circlePoints} color='black' lineWidth={1} />
        <Line
          points={[
            [-radius, 0, 0],
            [radius, 0, 0],
          ]}
          color='black'
          lineWidth={1}
        />
        <Line
          points={[
            [0, -radius, 0],
            [0, radius, 0],
          ]}
          color='black'
          lineWidth={1}
        />
      </group>
    </object3D>
  );
};

export default Marker;