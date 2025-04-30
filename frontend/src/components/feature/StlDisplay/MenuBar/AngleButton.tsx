import { RxAngle } from 'react-icons/rx';
import MenuButton from './MenuButton';
import { useStlDisplay } from '@/hooks/useStlDisplay';
import { useCallback } from 'react';

const AngleButton = () => {
  const {
    angleHandler: { isActive },
    tool: { toggleTool },
  } = useStlDisplay();
  const handleToggleAngle = useCallback(() => toggleTool('angle'), [toggleTool]);

  return (
    <MenuButton onClick={handleToggleAngle} text='Angle' icon={<RxAngle />} type={isActive ? 'primary' : 'default'} />
  );
};

export default AngleButton;
