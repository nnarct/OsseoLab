// src/components/feature/StlList/StlDisplay/MenuBar.tsx
// import { useCallback, useEffect, useState } from 'react';
// import { Slider } from 'antd';
// import PlaneList from '../ClippingPlane/PlaneList';
// import { useStlDisplay } from '@/hooks/useStlDisplay';
// import LineList from '../MeasureTool/LineList';
// import * as THREE from 'three';
// import { MAX_ZOOM, MIN_ZOOM } from '@/constants/stlDisplay';
// import { MeasureDistance } from './MeasureDistance';
import SaveButton from './SaveButton';
import PlaneButton from './PlaneButton';
import MeasureButton from './MeasureButton';
import AngleButton from './AngleButton';
// interface MenuBarProps {
//   onSave: () => void;
//   saving: boolean;
// }

const MenuBar = () => {
  // const { sceneHandlerRef, measureHandler } = useStlDisplay();

  // const [zoom, setZoom] = useState<number>(100); // เริ่มที่ 100 (เหมือน faceFront)

  // const handleZoomChange = (value: number) => {
  //   setZoom(value);
  //   if (sceneHandlerRef.current) {
  //     const camera = sceneHandlerRef.current.camera;
  //     const controls = sceneHandlerRef.current.controls;
  //     if (camera && controls) {
  //       const dir = new THREE.Vector3();
  //       dir.subVectors(camera.position, controls.target).normalize();
  //       const newPos = dir.multiplyScalar(value).add(controls.target);
  //       camera.position.copy(newPos);
  //       controls.update();
  //     }
  //   }
  // };
  // // ➡️ เพิ่มตรงนี้
  // useEffect(() => {
  //   const controls = sceneHandlerRef.current?.controls;
  //   if (!controls) return;

  //   const handleChange = () => {
  //     const camera = sceneHandlerRef.current?.camera;
  //     if (camera && controls) {
  //       const distance = camera.position.distanceTo(controls.target);
  //       setZoom(distance);
  //     }
  //   };

  //   controls.addEventListener('change', handleChange); // ดัก event ตอนกล้องเปลี่ยน

  //   return () => {
  //     controls.removeEventListener('change', handleChange);
  //   };
  // }, [sceneHandlerRef]);

  return (
    <>
      <div className='flex gap-3 p-3'>
        <PlaneButton />
        <MeasureButton />
        <AngleButton />
        <SaveButton />
      </div>
      {/* {isMeasureActive && (
        <>
          <div className='bg-blue-100 py-2'>{panelInfo}</div>
          <LineList />
        </>
      )}
      <PlaneList /> */}
      {/* <div style={{ position: 'fixed', right: 20, top: 100, height: 200, zIndex: 100 }}>
        <Slider reverse vertical min={MIN_ZOOM} max={MAX_ZOOM} value={zoom} onChange={handleZoomChange} />
      </div> */}
    </>
  );
};

export default MenuBar;
