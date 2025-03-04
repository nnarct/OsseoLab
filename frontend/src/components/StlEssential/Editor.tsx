import React, { FC, Suspense, useRef } from 'react';
import { Center, Select } from '@react-three/drei';
import Stls from './Stls';
import { useLoader } from '@react-three/fiber';
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader';
import Loader from './Loader';

const files = ['mandible1.stl'];
const color = ['#9c9ea1', '#781e14', '#d66154'];
const opacity = [1, 1, 1];

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setSelected: any;
  url: string;
}

const Editor: FC<Props> = ({ setSelected, url }) => {
  const stl = useLoader(STLLoader, [url]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const group = useRef<any>(null!);

  return (
    <Suspense fallback={<Loader />}>
      <Center>
        <Select onChange={setSelected}>
          <group rotation={[-Math.PI / 2, 0, 0]} ref={group}>
            {stl.map((stl, idx) => (
              <Stls key={idx} opacity={opacity[idx]} organName={files[idx]} stl={stl} color={color[idx]} />
            ))}
          </group>
        </Select>
      </Center>
    </Suspense>
  );
};

export default Editor;
