import { Tooltip } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { MdColorLens } from 'react-icons/md';
import MenuButton from './MenuButton';
import ObjectSettingPanel from '../Controllers/ObjectSettingPanel';

const MeshsButton = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const handleClick = () => setIsOpen(!isOpen);

  const panelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (panelRef.current && panelRef.current.contains(target)) return;

      const popup = document.querySelector('.ant-popover');
      if (popup && popup.contains(target)) return;

      setIsOpen(false);
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <div ref={panelRef} className='relative'>
        <Tooltip title='Change model color'>
          <MenuButton
            onClick={handleClick}
            icon={<MdColorLens />}
            type={isOpen ? 'primary' : 'default'}
            text='Objects'
          />
        </Tooltip>
        <ObjectSettingPanel isOpen={isOpen} />
      </div>
    </>
  );
};

export default MeshsButton;
