// import { Suspense, useState } from 'react';
// import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
// import Loader from '../../StlEssential/Loader';
// import Editor from '../../StlEssential/Editor';
// import { Canvas } from '@react-three/fiber';
// import { Object3D } from 'three';
// import { Panel } from '../../StlEssential/MultiLeva';
// interface StlDisplayProps {
//   url?: string;
// }
// const StlDisplay: React.FC<StlDisplayProps> = ({ url = 'mandible1.stl' }) => {
//   const [selected, setSelected] = useState<Object3D[]>();

//   return (
//     // <div className='h-screen'>
//     <>
//       <Canvas style={{ backgroundColor: 'black', borderRadius: 8 }}>
//         <Suspense fallback={<Loader />}>
//           <PerspectiveCamera
//             makeDefault
//             fov={60}
//             aspect={window.innerWidth / window.innerHeight}
//             position={[3, 0.15, 3]}
//             near={1}
//             far={5000}
//             position-z={600}
//           ></PerspectiveCamera>
//           <Editor setSelected={setSelected} url={url} />
//           <directionalLight color={0xeb4634} position={[1, 0.75, 0.5]} />
//           <directionalLight color={0xccccff} position={[-1, 0.75, -0.5]} />
//         </Suspense>
//         <OrbitControls />
//       </Canvas>
//       <Panel selected={selected} />
//     </>
//     // </div>
//   );
// };

// export default StlDisplay;


const StlDisplay = () => {
  return 'STL Display'
}

export default StlDisplay