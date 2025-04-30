import MenuButton from './MenuButton';
import { PiFloppyDiskBackDuotone } from "react-icons/pi";

const SaveButton = () => {
  return <MenuButton icon={<PiFloppyDiskBackDuotone />} tooltip='Save Model' text='Save'/>
};

export default SaveButton;
