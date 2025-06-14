import { AngleGroupDataType } from '@/types/measureTool';
import { Line, Html } from '@react-three/drei';
import Marker from '../MeasureTool/Marker';

const AngleLine = ({ triple, markerRadius }: { triple: AngleGroupDataType; markerRadius: number }) => {
  return (
    <group visible={triple.show}>
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

      <group renderOrder={99}>
        <Line
          points={[triple.origin.point, triple.middle.point]}
          color='#ff6f00'
          lineWidth={1}
          depthTest={false}
          depthWrite={false}
          polygonOffset={true}
          polygonOffsetFactor={-10}
        />
        <Line
          points={[triple.middle.point, triple.destination.point]}
          color='#ff6f00'
          lineWidth={1}
          depthTest={false}
          depthWrite={false}
          polygonOffset={true}
          polygonOffsetFactor={-10}
        />
      </group>
      {triple.show && (
        <Html position={triple.middle.point} center zIndexRange={[0, 0]} style={{ zIndex: 1 }}>
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
            {triple.angleDeg.toFixed(2)}°
          </div>
        </Html>
      )}
    </group>
  );
};
export default AngleLine;
