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

  // Enable local clipping
  gl.localClippingEnabled = true;

  // Compute bounding box
  geometry.computeBoundingBox();
  const center = new THREE.Vector3();
  geometry.boundingBox?.getCenter(center);
  geometry.translate(-center.x, -center.y, -center.z);

  // Adjust camera to fit model
  const size = new THREE.Vector3();
  geometry.boundingBox?.getSize(size);
  const maxSize = Math.max(size.x, size.y, size.z);
  camera.position.set(0, 0, maxSize);
  camera.lookAt(0, 0, 0);

  // Improve shading
  geometry.computeVertexNormals();

  // Set mesh rotation
  if (meshRef.current) {
    meshRef.current.rotation.set(-Math.PI / 2, 0, 0);
  }
};

/**
 * Converts a hex color to a Three.js shader-compatible RGB string.
 * @param hex - The hex color string.
 * @returns A string formatted as `r, g, b` values.
 */
export const hexToShaderRGB = (hex: string) => {
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
export const generateFragmentShader = (frontHex: string, backHex: string, alpha: number) => `
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