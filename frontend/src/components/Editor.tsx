import React, { FC, Suspense, useRef } from 'react';
import { Center, Select } from '@react-three/drei';
import Stls from '@/components/Stls';
import { useLoader } from '@react-three/fiber';

import Loader from '@/components/Loader';
import { STLLoader } from 'three/examples/jsm/Addons.js';

const files = ['test'];
const color = ['#9c9ea1', '#781e14', '#d66154'];
const opacity = [1, 1, 1];

interface Props {
  setSelected: any;
}

const Editor: FC<Props> = ({ setSelected }) => {
  const stl = useLoader(STLLoader, ['mandible1.stl']);
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
