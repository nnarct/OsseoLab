import { LuSquareDashedBottom } from 'react-icons/lu';
import { RiScissorsCutLine } from 'react-icons/ri';
import { Dropdown, Menu } from 'antd';
import MenuButton from './MenuButton';
import { useStlDisplay } from '@/hooks/useStlDisplay';
import { useCallback } from 'react';

const PlaneButton = () => {
  const {
    planeHandler: { add: addPlane, setIsPlaneActive, getPlanes, isCut, isActive, applyCut, unapplyCut },
    tool,
  } = useStlDisplay();
  const { toggleTool, clear: clearTool } = tool;
  const planes = getPlanes();

  const handleAddPlane = useCallback(() => {
    tool.select.plane();
    addPlane();
  }, [addPlane, tool.select]);

  const handleCutToggle = useCallback(() => (isCut ? unapplyCut() : applyCut()), [isCut, unapplyCut, applyCut]);

  const handleInactivatePlane = useCallback(() => {
    setIsPlaneActive(false);
    clearTool();
  }, [clearTool, setIsPlaneActive]);

  const handleActivatePlane = useCallback(() => {
    setIsPlaneActive(true);
    toggleTool('plane');
  }, [setIsPlaneActive, toggleTool]);

  return (
    <>
      <Dropdown
        overlay={
          <Menu
            items={[
              {
                key: 'addPlane',
                label: 'Create Plane',
                onClick: handleAddPlane,
              },
              ...(planes.length > 0
                ? [
                    {
                      key: 'activePlane',
                      label: isActive ? 'Hide Plane' : `Show Plane (${planes.length})`,
                      onClick: isActive ? handleInactivatePlane : handleActivatePlane,
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
          <MenuButton text='Plane' icon={<LuSquareDashedBottom />} type={isActive ? 'primary' : 'default'} />
        </div>
      </Dropdown>

      <MenuButton
        onClick={handleCutToggle}
        text='Cut'
        disabled={planes.length === 0 || !isActive}
        icon={<RiScissorsCutLine />}
      />
    </>
  );
};

export default PlaneButton;
