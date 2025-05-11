import MenuButton from './MenuButton';
import { useStlDisplay } from '@/hooks/useStlDisplay';
import { PiCubeFocusFill } from "react-icons/pi";

const FaceFrontButton = () => {
  const { faceBottom } = useStlDisplay();
  return <MenuButton onClick={faceBottom} icon={<PiCubeFocusFill />} tooltip='Face Front' text='Home' />;
};

export default FaceFrontButton;
