import * as THREE from 'three';
import { useState, useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { Line, Html } from '@react-three/drei';
import type { IntersectionData } from '@/types/measureTool';
import { useStlDisplay } from '@/hooks/useStlDisplay';

import Marker from '@/components/feature/StlDisplay/MeasureTool/Marker';
import AngleLine from './AngleLine';
import usePointerInteraction from '@/hooks/usePointerInteraction';

const AngleTool = () => {
  const { camera, scene,gl } = useThree();

  // const [markerRadius, setMarkerRadius] = useState<number>(1.0);
  const [hoverMarker, setHoverMarker] = useState<IntersectionData | null>(null);
  const {
    
    angleHandler: { currentAngleGroup,  addMarker, },

    tool: { markerRadius },
  } = useStlDisplay();

  usePointerInteraction(camera, scene, gl, setHoverMarker, addMarker );

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

      {/* {angleGroup?.map((triple, index) => {
        // const midPoint = triple.origin.point
        //   .clone()
        //   .add(triple.destination.point)
        //   .multiplyScalar(0.5)
        //   .add(new THREE.Vector3(0, markerRadius * 2, 0));

        return <AngleLine key={index} triple={triple} markerRadius={markerRadius} />;
      })} */}
    </>
  );
};

export default AngleTool;
