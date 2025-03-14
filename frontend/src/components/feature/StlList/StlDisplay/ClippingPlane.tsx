import { TransformControls } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import type { TransformControlsMode } from './types';

const ClippingPlane = ({
  mode,
  isActive,
  frontColor = 'rgb(0,255,0)',
  backColor = 'rgb(255,0,0)',
  opacity = 0.5,
}: {
  mode: TransformControlsMode;
  isActive: boolean;
  frontColor?: string;
  backColor?: string;
  opacity?: number;
}) => {
  const planeRef = useRef<THREE.Mesh>(null);
  const transformRef = useRef<THREE.TransformControls>(null);
  const { camera, gl } = useThree();
  const materialRef = useRef<THREE.ShaderMaterial | null>(null);

  const rgbToShader = (rgb: string) => {
    const match = rgb.match(/\d+/g)?.map((n) => parseInt(n) / 255);
    return match ? `${match[0]}, ${match[1]}, ${match[2]}` : '1.0, 1.0, 1.0';
  };
  const hexToShaderRGB = (hex: string) => {
    const color = new THREE.Color(hex); // Convert Hex to THREE.Color
    return `${color.r.toFixed(2)}, ${color.g.toFixed(2)}, ${color.b.toFixed(2)}`;
  };
  const vertexShader = `
    varying vec3 vNormal;
    void main() {
      vNormal = normal;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragmentShader = (frontHex: string, backHex: string, alpha: number) => `
  varying vec3 vNormal;
  void main() {
    if (gl_FrontFacing) {
      gl_FragColor = vec4(${frontHex}, ${alpha});
    } else {
      gl_FragColor = vec4(${backHex}, ${alpha});
    }
  }
`;

  useEffect(() => {
    if (isActive && transformRef.current && planeRef.current) {
      transformRef.current.attach(planeRef.current);
    }
  }, [isActive]);

  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.fragmentShader = fragmentShader(
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
          fragmentShader={fragmentShader(rgbToShader(frontColor), rgbToShader(backColor), opacity)}
          side={THREE.DoubleSide}
        />
      </mesh>
    </>
  );
};

export default ClippingPlane;
