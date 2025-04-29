// src/components/feature/StlList/StlDisplay/MenuBar.tsx
import { useCallback, useEffect, useState } from 'react';
import { Button, Slider, Tooltip } from 'antd';
import PlaneList from '../ClippingPlane/PlaneList';
import { useStlDisplay } from '@/hooks/useStlDisplay';
import LineList from '../MeasureTool/LineList';
import { FiRefreshCcw } from 'react-icons/fi';
import * as THREE from 'three';
import { MAX_ZOOM, MIN_ZOOM } from '@/constants/stlDisplay';
import { FaRuler } from 'react-icons/fa';
import { MdOutlineContentCut } from 'react-icons/md';
// import { MeasureDistance } from './MeasureDistance';
import { RxAngle } from 'react-icons/rx';
import { FaFloppyDisk } from "react-icons/fa6";
import { LuSquareDashedBottom } from "react-icons/lu";
interface MenuBarProps {
  onSave: () => void;
  saving: boolean;
}

const MenuBar = ({ onSave, saving }: MenuBarProps) => {
  const { sceneHandlerRef, planeHandler, angleHandler, measureHandler, tool, resetModel } = useStlDisplay();
  const { toggleTool } = tool;
  const { isCut, add: addPlane, applyCut, unapplyCut } = planeHandler;
  const { isActive: isAngleActive } = angleHandler;
  const { isActive: isMeasureActive, panelInfo } = measureHandler;

  const handleAddPlane = useCallback(() => addPlane(), [addPlane]);
  const handleCutToggle = useCallback(() => (isCut ? unapplyCut() : applyCut()), [isCut, unapplyCut, applyCut]);
  const handleToggleAngle = useCallback(() => toggleTool('angle'), [toggleTool]);
  const handleToggleMeasure = useCallback(() => toggleTool('measure'), [toggleTool]);
  const handleSave = useCallback(() => onSave(), [onSave]);

  const [zoom, setZoom] = useState<number>(100); // เริ่มที่ 100 (เหมือน faceFront)

  const handleZoomChange = (value: number) => {
    setZoom(value);
    if (sceneHandlerRef.current) {
      const camera = sceneHandlerRef.current.camera;
      const controls = sceneHandlerRef.current.controls;
      if (camera && controls) {
        const dir = new THREE.Vector3();
        dir.subVectors(camera.position, controls.target).normalize();
        const newPos = dir.multiplyScalar(value).add(controls.target);
        camera.position.copy(newPos);
        controls.update();
      }
    }
  };
  // ➡️ เพิ่มตรงนี้
  useEffect(() => {
    const controls = sceneHandlerRef.current?.controls;
    if (!controls) return;

    const handleChange = () => {
      const camera = sceneHandlerRef.current?.camera;
      if (camera && controls) {
        const distance = camera.position.distanceTo(controls.target);
        setZoom(distance);
      }
    };

    controls.addEventListener('change', handleChange); // ดัก event ตอนกล้องเปลี่ยน

    return () => {
      controls.removeEventListener('change', handleChange);
    };
  }, [sceneHandlerRef]);

  return (
    <>
      <div className='flex gap-3 p-3'>
        <Button onClick={handleAddPlane} icon={<LuSquareDashedBottom/>}>Plane</Button>
        <Button
          onClick={handleCutToggle}
          disabled={planeHandler.getPlanes().length === 0}
          icon={<MdOutlineContentCut />}
        >
          {isCut ? 'Undo Cut' : 'Cut'}
        </Button>
        <Button type={isAngleActive ? 'primary' : 'default'} onClick={handleToggleAngle} icon={<RxAngle />}>
          {isAngleActive ? 'Cancel Angle' : 'Angle'}
        </Button>
        <Tooltip defaultOpen title={isMeasureActive ? 'Exit Measure' : 'Measure'}>
          {' '}
          <Button type={isMeasureActive ? 'primary' : 'default'} onClick={handleToggleMeasure} icon={<FaRuler />}>
            {/* {isMeasureActive ? 'Exit Measure' : 'Measure'} */}
          </Button>
        </Tooltip>
        <Button onClick={handleSave} loading={saving} icon={<FaFloppyDisk />}>
          Save
        </Button>
        <Tooltip title='Reset 3D Model'>
          <Button onClick={resetModel} icon={<FiRefreshCcw />} />
        </Tooltip>
      </div>
      {isMeasureActive && (
        <>
          <div className='bg-blue-100 py-2'>{panelInfo}</div>
          <LineList />
        </>
      )}
      <PlaneList />
      <div style={{ position: 'fixed', right: 20, top: 100, height: 200, zIndex: 100 }}>
        <Slider reverse vertical min={MIN_ZOOM} max={MAX_ZOOM} value={zoom} onChange={handleZoomChange} />
      </div>
      {/* <MeasureDistance /> */}
    </>
  );
};

export default MenuBar;
