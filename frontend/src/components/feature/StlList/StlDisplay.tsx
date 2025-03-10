// import { Suspense } from 'react';
// import { Canvas } from '@react-three/fiber/native';
// import { useGLTF } from '@react-three/drei/native';
// import { JSX } from 'react/jsx-runtime';

import { Canvas } from '@react-three/fiber';
import { Typography } from 'antd';

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

const StlDisplay = ({ url }: { url: string }) => {
  console.log({ url });
  return (
    <>
      <Typography.Title>{url}</Typography.Title>
      <Canvas>
        <mesh>
          <boxGeometry />
        </mesh>
      </Canvas>
    </>
  );
};

export default StlDisplay;
