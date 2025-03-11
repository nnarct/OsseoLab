import { Suspense, useEffect, useRef } from 'react';
import { ContactShadows, GizmoHelper, GizmoViewcube, OrbitControls } from '@react-three/drei';
import { Canvas, useFrame, useLoader, useThree } from '@react-three/fiber';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import * as THREE from 'three';

const Model = ({ url }: { url: string }) => {
  const geometry = useLoader(STLLoader, url);
  const meshRef = useRef<THREE.Mesh>(null);
  const { camera } = useThree();

  useEffect(() => {
    if (geometry) {
      geometry.computeBoundingBox();
      const center = new THREE.Vector3();
      geometry.boundingBox?.getCenter(center);
      geometry.translate(-center.x, -center.y, -center.z);

      const size = new THREE.Vector3();
      geometry.boundingBox?.getSize(size);
      const maxSize = Math.max(size.x, size.y, size.z);
      camera.position.set(0, 0, maxSize);
      camera.lookAt(0, 0, 0);

      geometry.computeVertexNormals();
      meshRef.current?.rotation.set(-Math.PI / 2, 0, 0);
    }
  }, [geometry, camera]);

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshStandardMaterial color='#E8D7C0' metalness={0.1} roughness={0.6} flatShading={false} />
    </mesh>
  );
};

const MovingLight = () => {
  const whiteLightRef = useRef<THREE.DirectionalLight>(null);
  const darkLightRef = useRef<THREE.DirectionalLight>(null);
  const { camera } = useThree();

  useFrame(() => {
    if (whiteLightRef.current) {
      // Position the light slightly in front of the camera
      const offset = new THREE.Vector3(10, 10, 10);
      whiteLightRef.current.position.copy(camera.position.clone().add(offset));
      whiteLightRef.current.target.position.copy(camera.position);
    }
    if (darkLightRef.current) {
      // Position the light slightly in front of the camera
      const offset = new THREE.Vector3(10, 10, -10);
      darkLightRef.current.position.copy(camera.position.clone().add(offset));
      darkLightRef.current.target.position.copy(camera.position);
    }
  });

  return (
    <>
      <directionalLight ref={whiteLightRef} intensity={2} color={0xffffff} />;
      <directionalLight ref={darkLightRef} intensity={2} color={0x4f4f} />;
    </>
  );
};

const StlDisplay = ({ url }: { url: string }) => {
  return (
    <>
      <Canvas shadows style={{ backgroundColor: 'black', borderRadius: 8 }}>
        <OrbitControls makeDefault />
        <GizmoHelper alignment='bottom-right' margin={[80, 80]}>
          <GizmoViewcube />
        </GizmoHelper>
        <MovingLight />
        <ContactShadows position={[0, -1.5, 0]} opacity={0.35} blur={3} color={'#A9A9A9'} />
        <Suspense fallback={<>Loading...</>}>
          <Model url={url} />
        </Suspense>
      </Canvas>
    </>
  );
};

export default StlDisplay;

const visibilities = [
  <>
    <ambientLight intensity={0.6} color={'#FFFFFF'} />
    <directionalLight position={[5, 10, 5]} intensity={1.5} castShadow color={'#FFF8E7'} />
    <directionalLight position={[-5, -10, -5]} intensity={1.2} castShadow color={'#FFFFFF'} />
    <spotLight position={[0, 10, -10]} intensity={1.5} angle={0.4} penumbra={1} color={'#F0ECE2'} />
  </>,
  <>
    <directionalLight position={[5, 10, 5]} intensity={1.5} castShadow color={'#FFF8E7'} />
    <directionalLight position={[-5, -10, -5]} intensity={1.2} castShadow color={'#FFFFFF'} />
  </>,
  <>
    <directionalLight color={0xeb4634} position={[1, 0.75, 0.5]} />
    <directionalLight color={0xccccff} position={[-1, 0.75, -0.5]} />
  </>,
  <>
    <directionalLight color={0x004bf9} position={[1, 0.75, 0.5]} />
    <directionalLight color={0xeb4634} position={[-1, 0.75, 0.5]} />
    <directionalLight color={0xccccff} position={[-1, 0.75, -0.5]} />
  </>,
  <>
    <ambientLight intensity={0.5} />
    <directionalLight position={[0, 5, 5]} intensity={1.5} castShadow />
    <directionalLight position={[5, 0, -5]} intensity={1.2} />
    <spotLight position={[0, 10, -10]} intensity={1.5} angle={0.4} penumbra={1} />
    <pointLight position={[-5, -5, 5]} intensity={1.2} />
  </>,
  <>
    <ambientLight intensity={0.5} /> // General light
    <directionalLight position={[0, 10, 10]} intensity={1.5} castShadow />
    <directionalLight position={[10, 0, -10]} intensity={1.0} />
    <spotLight position={[0, 10, -10]} intensity={1.5} angle={0.4} penumbra={1} />
    <pointLight position={[-10, -10, 10]} intensity={1.2} />
  </>,
  <>
    <ambientLight intensity={0.6} />
    <directionalLight position={[5, 5, 5]} intensity={1.5} castShadow />
    <directionalLight position={[-5, -5, 5]} intensity={1.5} castShadow />

    <spotLight position={[0, 10, -10]} intensity={1.5} angle={0.4} penumbra={1} />
    <hemisphereLight color={'#ffffff'} groundColor={'#444444'} intensity={0.9} />
  </>,
  <>
    <ambientLight intensity={0.6} color={'#FFFFFF'} /> // Soft natural light
    <directionalLight position={[5, 10, 5]} intensity={1.8} castShadow color={'#FFD700'} /> // Warm golden light
    <directionalLight position={[-5, -10, -5]} intensity={1.2} castShadow color={'#FFF5E1'} /> // Soft white light
    <spotLight position={[0, 10, -10]} intensity={1.5} angle={0.4} penumbra={1} color={'#FAF0E6'} /> // Light cream
    highlight
  </>,
];
const Visibility = ({ version }: { version: number }) => {
  return visibilities[version];
};
//whiter
// <ambientLight intensity={0.5} />  // General light
// <directionalLight position={[0, 10, 10]} intensity={1.5} castShadow />
// <directionalLight position={[10, 0, -10]} intensity={1.0} />
// <pointLight position={[-10, -10, 10]} intensity={1.2} />

// interface StlDisplayProps {
//   fileUrl: string;
// }
// const Model: React.FC<{ fileUrl: string } & JSX.IntrinsicElements["group"]> = ({ fileUrl, ...props }) => {
//   const { scene } = useGLTF(fileUrl);
//   return <primitive object={scene} {...props} />;
// };

// const StlDisplay: React.FC<StlDisplayProps> = ({ fileUrl }) => {
//   return (
//     <>
//       <Canvas>
//         <ambientLight />
//         <Suspense fallback={null}>
//           <Model fileUrl={fileUrl} />
//         </Suspense>
//       </Canvas>
//     </>
//   );
// };

// export default StlDisplay;

// // import modelPath from './path/to/model.glb'

// // function Model(props) {
// //   const gltf = useGLTF(modelPath)
// //   return <primitive {...props} object={gltf.scene} />
// // }

// // export default function App() {
// //   return (
// //     <Canvas>
// //       <ambientLight />
// //       <Suspense>
// //         <Model />
// //       </Suspense>
// //     </Canvas>
// //   )
// // }
