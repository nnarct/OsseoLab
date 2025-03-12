import { Suspense, useCallback, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { Button, ColorPicker, Dropdown, Flex, List, Radio, Slider, Typography } from 'antd';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';

import type { TranslateMode } from './types';
import Model from './Model';
import Controllers from './Controllers';
import ClippingPlane from './ClippingPlane';
import { FaCheck, FaTrashAlt } from 'react-icons/fa';

const StlDisplay = ({ url }: { url: string }) => {
  const [planes, setPlanes] = useState<
    {
      id: string;
      plane: THREE.Plane;
      position: THREE.Vector3;
      mode: TranslateMode;
      frontColor: string;
      backColor: string;
      opacity: number;
    }[]
  >([]);
  const [activePlaneId, setActivePlaneId] = useState<string | null>(null);
  const [applyClipping, setApplyClipping] = useState(false);

  const addPlane = useCallback(() => {
    const id = uuid();
    const newPlane = {
      id,
      plane: new THREE.Plane(new THREE.Vector3(1, 0, 0), 0),
      position: new THREE.Vector3(0, 0, 0),
      mode: 'translate' as TranslateMode,
      frontColor: 'rgb(0,255,0)',
      backColor: 'rgb(255,0,0)',
      opacity: 0.5,
    };

    setPlanes((prevPlanes) => [...prevPlanes, newPlane]);
    setActivePlaneId(id);
  }, []);

  const removePlane = useCallback((id: string) => {
    setPlanes((prevPlanes) => prevPlanes.filter((plane) => plane.id !== id));
    setActivePlaneId((prevActiveId) => (prevActiveId === id ? null : prevActiveId));
  }, []);

  const updatePlaneProperty = useCallback(
    (
      id: string,
      property: Partial<{ mode: TranslateMode; frontColor: string; backColor: string; opacity: number }>
    ) => {
      setPlanes((prevPlanes) => prevPlanes.map((plane) => (plane.id === id ? { ...plane, ...property } : plane)));
    },
    []
  );

  const handleSelectPlane = useCallback((id: string) => setActivePlaneId(id), []);
  
  return (
    <>
      <div className='flex gap-3 p-3'>
        <Button onClick={addPlane}>Add Cutting Plane</Button>
        <Button onClick={() => setApplyClipping(!applyClipping)}>{applyClipping ? 'Reset Cut' : 'Cut'}</Button>
      </div>

      {planes.length > 0 && (
        <div className='px-3'>
          <List header='Plane List' bordered className='bg-white'>
            {planes.map((plane, idx) => (
              <List.Item
                key={plane.id}
                actions={[
                  <Dropdown
                    overlay={
                      <div className='rounded-md bg-white p-3 shadow-lg'>
                        <p>Front Color</p>
                        <ColorPicker
                          disabledAlpha={true}
                          format='rgb'
                          value={plane.frontColor}
                          onChange={(color) => updatePlaneProperty(plane.id, { frontColor: color.toRgbString() })}
                        />
                        <p className='mt-2'>Back Color</p>
                        <ColorPicker
                          disabledAlpha={true}
                          format='rgb'
                          value={plane.backColor}
                          onChange={(color) => updatePlaneProperty(plane.id, { backColor: color.toRgbString() })}
                        />
                        <p className='mt-2'>Opacity</p>
                        <Slider
                          min={0}
                          max={1}
                          step={0.05}
                          value={plane.opacity}
                          onChange={(value) => updatePlaneProperty(plane.id, { opacity: value })}
                        />
                      </div>
                    }
                    trigger={['click']}
                  >
                    <Button>Customize</Button>
                  </Dropdown>,
                  <Button
                    onClick={() => handleSelectPlane(plane.id)}
                    type={plane.id === activePlaneId ? 'primary' : 'default'}
                    icon={<FaCheck />}
                    shape={'circle'}
                  />,
                  <Button onClick={() => removePlane(plane.id)} icon={<FaTrashAlt />} />,
                ]}
              >
                <Flex gap={12} align='center'>
                  <Typography.Text>Plane {idx + 1} :</Typography.Text>
                  <Radio.Group
                    optionType='button'
                    buttonStyle='solid'
                    disabled={activePlaneId !== plane.id}
                    value={plane.mode}
                    onChange={(e) => updatePlaneProperty(plane.id, { mode: e.target.value })}
                    options={[
                      { value: 'translate', label: 'Move' },
                      { value: 'scale', label: 'Scale' },
                      { value: 'rotate', label: 'Rotate' },
                    ]}
                  />
                </Flex>
              </List.Item>
            ))}
          </List>
        </div>
      )}

      <Canvas shadows style={{ height: '90vh' }} className='mt-3 rounded-lg bg-black'>
        <Controllers />
        <Suspense fallback={<>Loading...</>}>
          <Model url={url} clippingPlanes={applyClipping ? planes.map((p) => p.plane) : []} />
        </Suspense>
        {planes.map((planeObj) => (
          <ClippingPlane key={planeObj.id} {...planeObj} isActive={planeObj.id === activePlaneId} />
        ))}
      </Canvas>
    </>
  );
};

export default StlDisplay;
