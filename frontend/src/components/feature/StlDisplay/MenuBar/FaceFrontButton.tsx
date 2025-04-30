import MenuButton from './MenuButton';
import { useStlDisplay } from '@/hooks/useStlDisplay';
import { PiCubeFocusFill } from "react-icons/pi";

const FaceFrontButton = () => {
  const { faceFront } = useStlDisplay();
  return <MenuButton onClick={faceFront} icon={<PiCubeFocusFill />} tooltip='Face Front' text='Home' />;
};

export default FaceFrontButton;
