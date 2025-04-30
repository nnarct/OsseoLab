import MenuButton from './MenuButton';
import { FaFloppyDisk } from 'react-icons/fa6';

const SaveButton = () => {
  return <MenuButton icon={<FaFloppyDisk />} tooltip='Save Model' text='Save'/>
};

export default SaveButton;
