// src/components/feature/StlList/StlDisplay/MenuBar.tsx
import { Button } from 'antd';
import PlaneList from './PlaneList';
import { useStlDisplay } from '@/hooks/useStlDisplay';

interface MenuBarProps {
  onSave: () => void;
  saving: boolean;
}

const MenuBar = ({
  onSave,
  saving,  
}: MenuBarProps) => {
  const { apply, addPlane, applyCut, unapplyCut, toggleAngleActive, isAngleActive} = useStlDisplay();

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
      </div>

      <PlaneList />
    </>
  );
};

export default MenuBar;
