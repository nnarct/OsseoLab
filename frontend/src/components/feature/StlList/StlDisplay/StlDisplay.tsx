import { Suspense, useCallback, useRef, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { Button, Dropdown, List, Select, MenuProps } from 'antd';
import { Canvas } from '@react-three/fiber';
import * as THREE from 'three';

import type { TransformControlsMode, PlaneDataType } from './types';
import Model from './Model';
import Controllers from './Controllers';
import ClippingPlane from './ClippingPlane';
import PlaneListItem from './PlaneListItem';
import SceneHandler from './SceneHandler';

const StlDisplay = ({ url }: { url: string }) => {
  const [planes, setPlanes] = useState<PlaneDataType[]>([]);
  const [activePlaneId, setActivePlaneId] = useState<string | null>(null);
  const [selectedCutPlanes, setSelectedCutPlanes] = useState<(string | undefined)[]>([undefined, undefined]);
  const sceneHandlerRef = useRef<{ applyCut: () => void } | null>(null);
  const [apply, setApply] = useState<boolean>(false);
  const addPlane = useCallback(() => {
    const id = uuid();
    const newPlane = {
      id,
      plane: new THREE.Plane(new THREE.Vector3(1, 0, 0), 0),
      position: new THREE.Vector3(0, 0, 0),
      mode: 'translate' as TransformControlsMode,
      frontColor: '#00ff00',
      backColor: '#ff0000',
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
      property: Partial<{ mode: TransformControlsMode; frontColor: string; backColor: string; opacity: number }>
    ) => {
      setPlanes((prevPlanes) => prevPlanes.map((plane) => (plane.id === id ? { ...plane, ...property } : plane)));
    },
    []
  );

  const handleSelectPlane = useCallback((id: string) => setActivePlaneId(id), []);

  // ✅ Fix: Ensure Plane 2 dropdown correctly excludes Plane 1
  const handlePlaneSelect = (index: number, value: string | undefined) => {
    setSelectedCutPlanes((prev) => {
      const updated = [...prev];
      updated[index] = value;

      // If Plane 1 is changed and matches Plane 2, reset Plane 2
      if (index === 0 && updated[1] === value) {
        updated[1] = undefined;
      }

      return updated;
    });
  };

  const applyCut = () => {
    // sceneHandlerRef.current?.applyCut();
    setApply(true);
  };
  const unapplyCut = () => {
    // sceneHandlerRef.current?.applyCut();
    setApply(false);
  };

  return (
    <>
      <div className='flex gap-3 p-3'>
        <Button onClick={addPlane}>Add Cutting Plane</Button>
        <Dropdown
          overlay={
            <div className='flex flex-col gap-y-4 rounded-md bg-white p-3 inset-shadow-2xs'>
              <Select
                value={selectedCutPlanes[0]}
                className='min-w-24'
                allowClear
                placeholder='Select Plane 1'
                onChange={(value) => handlePlaneSelect(0, value)}
                disabled={planes.length === 0}
              >
                {planes.map(({ id }, idx) => (
                  <Select.Option value={id} key={id}>
                    {id}
                  </Select.Option>
                ))}
              </Select>

              <Select
                value={selectedCutPlanes[1]}
                className='min-w-24'
                allowClear
                placeholder='Select Plane 2'
                onChange={(value) => handlePlaneSelect(1, value)}
                disabled={planes.length < 2}
              >
                {planes
                  .filter(({ id }) => id !== selectedCutPlanes[0]) // ✅ Properly filters out Plane 1
                  .map(({ id }, idx) => (
                    <Select.Option value={id} key={id}>
                      {id}
                    </Select.Option>
                  ))}
              </Select>

              <Button onClick={applyCut} disabled={!selectedCutPlanes[0]} className='mt-2 w-full'>
                Apply Cut
              </Button>
              <Button onClick={unapplyCut} disabled={!selectedCutPlanes[0]} className='mt-2 w-full'>
                Unapply Cut
              </Button>
            </div>
          }
          trigger={['click']}
        >
          <Button>Cut</Button>
        </Dropdown>
      </div>

      {planes.length > 0 && (
        <div className='px-3'>
          <List header='Plane List' bordered className='bg-white'>
            {planes.map((plane, idx) => (
              <PlaneListItem
                key={plane.id}
                plane={plane}
                idx={idx}
                activePlaneId={activePlaneId}
                handleSelectPlane={handleSelectPlane}
                removePlane={removePlane}
                updatePlaneProperty={updatePlaneProperty}
              />
            ))}
          </List>
        </div>
      )}

      <Canvas shadows style={{ height: '90vh' }} className='mt-3 rounded-lg bg-black'>
        <Controllers />
        <Suspense fallback={<>Loading...</>}>
          <Model url={url} clippingPlanes={apply ? planes.map((p) => p.plane) : []} />
        </Suspense>
        {planes.map((planeObj) => (
          <ClippingPlane key={planeObj.id} {...planeObj} isActive={planeObj.id === activePlaneId} />
        ))}
        <SceneHandler ref={sceneHandlerRef} selectedCutPlanes={selectedCutPlanes as string[]} planes={planes} />
      </Canvas>
    </>
  );
};

export default StlDisplay;
