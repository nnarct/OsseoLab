import { useStlDisplay } from '@/hooks/useStlDisplay';
import { Dropdown, type DropdownProps, type MenuProps } from 'antd';
import MenuButton from './MenuButton';
import { useState } from 'react';
import { FaRegEye } from 'react-icons/fa';
const VisibilityButton = () => {
  const [open, setOpen] = useState(false);

  const { visibleMeshes, toggleVisibility } = useStlDisplay().meshVisibility;
  const handleOpenChange: DropdownProps['onOpenChange'] = (nextOpen, info) => {
    if (info.source === 'trigger' || nextOpen) {
      setOpen(nextOpen);
    }
  };

  const handleMenuClick: MenuProps['onClick'] = (e) => {
    toggleVisibility(e.key);
  };
  const menuItems = Object.keys(visibleMeshes).map((key, index) => ({
    key,
    label: <span>{visibleMeshes[key] ? `Hide Mesh ${index + 1}` : `Show Mesh ${index + 1}`}</span>,
  }));

  return (
    <Dropdown
      // menu={{ items: menuItems }}
      trigger={['click']}
      placement='bottomLeft'
      menu={{
        items: menuItems,
        onClick: handleMenuClick,
      }}
      onOpenChange={handleOpenChange}
      open={open}
    >
      <MenuButton text='Models' icon={<FaRegEye />} />
    </Dropdown>
  );
};

export default VisibilityButton;
