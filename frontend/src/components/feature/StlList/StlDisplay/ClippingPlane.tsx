import { TransformControls } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { useCallback, useEffect, useRef } from 'react';
import * as THREE from 'three';
import type { TransformControlsMode } from '@/types/stlDisplay';
import { generateFragmentShader, hexToShaderRGB, vertexShader } from '@/utils/stlUtils';
import { useStlDisplay } from '@/hooks/useStlDisplay';

const ClippingPlane = ({
  plane,
  mode,
  id,

  frontColor = '#00ff00',
  backColor = '#ff0000',
  opacity = 0.5,
}: {
  plane: THREE.Plane;
  id: string;
  mode: TransformControlsMode;

  frontColor?: string;
  backColor?: string;
  opacity?: number;
}) => {
  const planeRef = useRef<THREE.Mesh>(null);
  const transformRef = useRef<THREE.TransformControls>(null);
  const { camera, gl } = useThree();
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);
  const { setPlanes, activePlaneId } = useStlDisplay();
  const isActive = id === activePlaneId;

  // Attach TransformControls to the active plane
  useEffect(() => {
    if (isActive && transformRef.current && planeRef.current) {
      transformRef.current.attach(planeRef.current);
    }
  }, [isActive]);

  // Update plane shader colors dynamically
  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.fragmentShader = generateFragmentShader(
        hexToShaderRGB(frontColor),
        hexToShaderRGB(backColor),
        opacity
      );
      materialRef.current.needsUpdate = true;
    }
  }, [frontColor, backColor, opacity]);

  return (
    <>
      {isActive && (
        <TransformControls
          ref={transformRef}
          object={planeRef.current || undefined}
          mode={mode}
          camera={camera}
          domElement={gl.domElement}
        />
      )}
      <mesh ref={planeRef}>
        <planeGeometry args={[50, 50]} />
        <shaderMaterial
          ref={materialRef}
          transparent={true}
          vertexShader={vertexShader}
          fragmentShader={generateFragmentShader(hexToShaderRGB(frontColor), hexToShaderRGB(backColor), opacity)}
          side={THREE.DoubleSide}
          uniforms={{
            resolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
            planeSize: { value: new THREE.Vector2(planeRef.current?.scale.x || 1, planeRef.current?.scale.y || 1) },
          }}
        />
      </mesh>
    </>
  );
};

export default ClippingPlane;
