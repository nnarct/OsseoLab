// src/components/feature/StlList/StlDisplay/MenuBar.tsx
import { Button } from 'antd';
import PlaneList from './PlaneList';
import { useStlDisplay } from '@/hooks/useStlDisplay';
import { useMeasureStore } from '@/store/useMeasureStore';
import LineList from '../MeasureTool/LineList';

// import { MeasureDistance } from './MeasureDistance';

interface MenuBarProps {
  onSave: () => void;
  saving: boolean;
}

const MenuBar = ({
  onSave,
  saving,  
}: MenuBarProps) => {
  const { apply, addPlane, applyCut, unapplyCut, toggleAngleActive, isAngleActive} = useStlDisplay();
  const { activeMeasure, setActiveMeasure, panelInfo } = useMeasureStore();
  const setMeasure = () => {
    setActiveMeasure(!activeMeasure);
  };
  return (
    <>
      <div className="flex gap-3 p-3">
        <Button onClick={addPlane}>Add Cutting Plane</Button>
        <Button onClick={apply ? unapplyCut : applyCut}>
          {apply ? 'Undo Cut' : 'Cut'}
        </Button>

        <Button
          type={isAngleActive ? 'primary' : 'default'}
          onClick={toggleAngleActive}
        >
          {isAngleActive ? 'Cancel Angle' : 'Angle'}
        </Button>

        <Button onClick={onSave} loading={saving}>
          Save
        </Button>
        <Button onClick={setMeasure} type={activeMeasure ? 'primary' : 'default'}>
          {/* className={`measure-button ${activeMeasure ? 'active' : ''}`}*/}
          {activeMeasure ? 'Exit Measure' : 'Measure'}
        </Button>
      </div>
      {activeMeasure && (
        <>
          <div className='bg-blue-100 py-2'>{panelInfo}</div>
          <LineList />
        </>
      )}
      <PlaneList />
      {/* <MeasureDistance /> */}
    </>
  );
};

export default MenuBar;
