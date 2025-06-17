import { LuSquareDashedBottom } from 'react-icons/lu';
import { RiScissorsCutLine } from 'react-icons/ri';
import { Dropdown, Menu } from 'antd';
import MenuButton from './MenuButton';
import { useStlDisplay } from '@/hooks/useStlDisplay';
import { useCallback } from 'react';

const PlaneButton = () => {
  const {
    planeHandler: { add: addPlane, getPlanes, isCut, isActive, applyCut, unapplyCut },
    tool,
  } = useStlDisplay();
  const planes = getPlanes();

  const handleAddPlane = useCallback(() => {
    tool.select.plane();
    addPlane();

    // waiting for user to click on mesh 'stlModel' and then get the position of MouseEvent
    // thn call addPlane(position)
  }, [addPlane, tool.select]);

  const handleCutToggle = useCallback(() => (isCut ? unapplyCut() : applyCut()), [isCut, unapplyCut, applyCut]);

  const handleCancel = useCallback(() => {
    tool.clear();
  }, [tool]);

  return (
    <>
      <Dropdown
        overlay={
          <Menu
            items={[
              {
                key: 'addPlane',
                label: 'Create Plane',
                disabled: planes.length >= 2,
                onClick: handleAddPlane,
              },
              ...(isActive
                ? [
                    {
                      key: 'cancel',
                      label: 'Cancel',
                      onClick: handleCancel,
                    },
                  ]
                : []),
            ]}
          />
        }
        placement='bottomLeft'
        trigger={['click']}
      >
        <div>
          <MenuButton
            onClick={() => tool.select.plane()}
            text='Plane'
            icon={<LuSquareDashedBottom />}
            type={isActive ? 'primary' : 'default'}
          />
        </div>
      </Dropdown>

      <MenuButton
        onClick={handleCutToggle}
        text='Cut'
        type={isCut ? 'primary' : 'default'}
        disabled={planes.length === 0 || !isActive}
        icon={<RiScissorsCutLine />}
      />
    </>
  );
};

export default PlaneButton;
