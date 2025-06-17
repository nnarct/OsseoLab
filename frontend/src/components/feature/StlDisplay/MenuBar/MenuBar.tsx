import SaveButton from './SaveButton';
import PlaneButton from './PlaneButton';
import MeasureButton from './MeasureButton';
import AngleButton from './AngleButton';
import ItemListPanel from '../ItemList/ItemListPanel';
import ResetModelButton from './ResetModelButton';
import FaceFrontButton from './FaceFrontButton';
import MeshsButton from './MeshsButton';
import SurgicalSettingButton from './SurgicalSettingButton';

interface MenuBarProps {
  onSave: () => Promise<void>;
}

const MenuBar = (props: MenuBarProps) => {
  return (
    <>
      <div
        className='p-3'
        style={{
          background: '#fff',
          borderBottom: '1px solid rgba(5, 5, 5, 0.05)',
          position: 'sticky',
          top: 73,
          zIndex: 1000,
          borderLeft: '1px solid rgba(5, 5, 5, 0.05)',
        }}
      >
        <div className='flex flex-wrap items-center justify-between gap-3'>
          <div className='flex flex-wrap gap-3'>
            <MeshsButton />
            <ItemListPanel />
            {/* <VisibilityButton/> */}
            <FaceFrontButton />
            <PlaneButton />
            <MeasureButton />
            <AngleButton />
            <ResetModelButton />
            <SaveButton onClick={props.onSave} />
          </div>
          <SurgicalSettingButton />
        </div>
      </div>
    </>
  );
};

export default MenuBar;
