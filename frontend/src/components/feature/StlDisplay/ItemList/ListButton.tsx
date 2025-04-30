import { useItemListPanelStateStore } from '@/store/useItemListPanelStateStore';
import MenuButton from '../MenuBar/MenuButton';
import { Tooltip } from 'antd';
import { CiViewTable } from "react-icons/ci";

const ListButton = () => {
  const { isOpen, setIsOpen } = useItemListPanelStateStore();
  const handleClick = () => {
    setIsOpen(!isOpen);
  };
  return (
    <Tooltip title='Show mesh list'>
      <MenuButton onClick={handleClick} icon={<CiViewTable />} type={isOpen ? 'primary' : 'default'} text='Items' />
    </Tooltip>
  );
};

export default ListButton;
