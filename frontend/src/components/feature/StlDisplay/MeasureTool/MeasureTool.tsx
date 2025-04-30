import * as THREE from 'three';
import { useState } from 'react';
import { useThree } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import type { IntersectionData } from '@/types/measureTool';
import { useStlDisplay } from '@/hooks/useStlDisplay';

import Marker from './Marker';
import usePointerInteraction from '@/hooks/usePointerInteraction';

export const MeasureTool = () => {
  const { camera, scene, gl } = useThree();
  // const { markerPairs, setMarkerPairs, addMarker, currentMarker } = useMeasureStore();
  const {
    measureHandler: { addMarker, currentMarker },
    tool: { markerRadius },
  } = useStlDisplay();
  const [hoverMarker, setHoverMarker] = useState<IntersectionData | null>(null);

  // const handleClick = (intersection: IntersectionData | null) => {
  //   if (!intersection) {
  //     clear();
  //     setPanelInfo('Select a point.');
  //     return;
  //   }

  //   const movedPoint = intersection.point.clone().add(intersection.normal.clone().multiplyScalar(0.01));

  //   const markerData = {
  //     point: movedPoint,
  //     normal: intersection.normal,
  //   };

  //   addMarker(markerData);
  // };

  usePointerInteraction(camera, scene, gl, setHoverMarker, addMarker);

  return (
    <>
      {hoverMarker && (
        <Marker position={hoverMarker.point} normal={hoverMarker.normal} radius={markerRadius} lookAtNormal={true} />
      )}
      {currentMarker && <Marker position={currentMarker.point} normal={currentMarker.normal} radius={markerRadius} />}
      {currentMarker && hoverMarker && (
        <Line
          points={[currentMarker.point, hoverMarker.point]}
          color='red'
          lineWidth={1}
          depthTest={false}
          polygonOffset={true}
          polygonOffsetFactor={-1}
        />
      )}
    </>
  );
};
