import * as THREE from 'three';

/**
 * Initializes and centers an STL geometry.
 * @param geometry The STL geometry to process.
 * @param camera The Three.js camera to adjust view.
 * @param meshRef Reference to the mesh object.
 */
export const initializeSTLModel = (
  geometry: THREE.BufferGeometry,
  camera: THREE.Camera & {
    manual?: boolean;
  },
  meshRef: React.RefObject<THREE.Mesh>,
  gl: THREE.WebGLRenderer
) => {
  if (!geometry) return;
  gl.localClippingEnabled = true;

  geometry.computeBoundingBox();
  // const center = new THREE.Vector3();
  // geometry.boundingBox?.getCenter(center);
  // console.log('Bounding box:', geometry.boundingBox);
  const size = new THREE.Vector3();
  geometry.boundingBox?.getSize(size);
  // const maxSize = Math.max(size.x, size.y, size.z);

  if (meshRef.current && !meshRef.current.userData.initialized) {
    // Removed direct geometry rotation to avoid mutation
    meshRef.current.userData.initialized = true;
    meshRef.current.userData.type = 'stlModel';
  }
  // camera.position.set(0, -200, 0);
  camera.position.set(0, 0, 200);
  camera.lookAt(0, 0, 0);

  geometry.computeVertexNormals();
};

/**
 * Converts a hex color to a Three.js shader-compatible RGB string.
 * @param hex - The hex color string
 * @returns A string formatted as `r, g, b` values.
 */
const hexToShaderRGB = (hex: string) => {
  const color = new THREE.Color(hex);
  return `${color.r.toFixed(2)}, ${color.g.toFixed(2)}, ${color.b.toFixed(2)}`;
};

/**
 * Generates a fragment shader for front and back colors with transparency.
 * @param frontHex - Hex color for the front-facing side.
 * @param backHex - Hex color for the back-facing side.
 * @param alpha - Opacity value.
 * @returns GLSL fragment shader code.
 */
const generateFragmentShader = (frontHex: string, backHex: string, alpha: number) => `
  varying vec3 vNormal;
  void main() {
    gl_FragColor = vec4(gl_FrontFacing ? vec3(${frontHex}) : vec3(${backHex}), ${alpha});
  }
`;

// Vertex shader (remains constant)
export const vertexShader = `
  varying vec3 vNormal;
  void main() {
    vNormal = normal;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

/**
 * Creates a shader material for the clipping plane.
 * @param frontColor - Hex color for the front side of the plane.
 * @param backColor - Hex color for the back side of the plane.
 * @param opacity - Opacity of the shader material.
 * @returns A THREE.ShaderMaterial instance.
 */
export const createClippingPlaneMaterial = (frontColor: string, backColor: string, opacity: number) => {
  return new THREE.ShaderMaterial({
    transparent: true,
    vertexShader: vertexShader,
    fragmentShader: generateFragmentShader(hexToShaderRGB(frontColor), hexToShaderRGB(backColor), opacity),
    side: THREE.DoubleSide,
  });
};
