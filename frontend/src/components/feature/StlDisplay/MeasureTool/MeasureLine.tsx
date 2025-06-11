import { MarkerPairDataType } from '@/types/measureTool';
import Marker from './Marker';
import * as THREE from 'three';
import { Line, Html } from '@react-three/drei';

const MeasureLine = ({ pair, markerRadius }: { pair: MarkerPairDataType; markerRadius: number }) => {
  const midPoint = pair.origin.point
    .clone()
    .add(pair.destination.point)
    .multiplyScalar(0.5)
    .add(new THREE.Vector3(0, markerRadius * 2, 0));

  return (
    <group visible={pair.show}>
      <Marker position={pair.origin.point} normal={pair.origin.normal} radius={markerRadius} />
      <Marker position={pair.destination.point} normal={pair.destination.normal} radius={markerRadius} />

      <mesh position={pair.origin.point}>
        <sphereGeometry args={[markerRadius / 3, 16, 16]} />
        <meshBasicMaterial color='red' />
      </mesh>

      <mesh position={pair.destination.point}>
        <sphereGeometry args={[markerRadius / 3, 16, 16]} />
        <meshBasicMaterial color='red' />
      </mesh>

      <Line
        points={[pair.origin.point, pair.destination.point]}
        color='#ff0000'
        lineWidth={1}
        depthTest={false}
        depthWrite={false}
        polygonOffset={true}
        polygonOffsetFactor={-1}
        renderOrder={99}
      />
      {pair.show && (
        <Html position={midPoint} center zIndexRange={[0, 0]} style={{ zIndex: 1 }}>
          <div
            style={{
              padding: '0.5rem',
              borderRadius: '0.5rem',
              backgroundColor: '#ff6f00',
              color: 'white',
              fontSize: '1rem',
              boxShadow: '0 0 4px rgba(0,0,0,0.3)',
              whiteSpace: 'nowrap',
            }}
          >
            {pair.distance.toFixed(3)} mm
          </div>
        </Html>
      )}
    </group>
  );
};
export default MeasureLine;
