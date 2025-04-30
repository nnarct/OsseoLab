import { FaRuler } from 'react-icons/fa';
import MenuButton from './MenuButton';
import { useStlDisplay } from '@/hooks/useStlDisplay';
import { useCallback } from 'react';

const MeasureButton = () => {
  const {
    measureHandler: { isActive },
    tool: { toggleTool },
  } = useStlDisplay();
  const handleToggleMeasure = useCallback(() => toggleTool('measure'), [toggleTool]);

  return (
    <MenuButton
      onClick={handleToggleMeasure}
      text='Measure'
      icon={<FaRuler />}
      type={isActive ? 'primary' : 'default'}
    />
  );
};

export default MeasureButton;
