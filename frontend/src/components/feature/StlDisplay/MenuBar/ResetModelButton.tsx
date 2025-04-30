import MenuButton from './MenuButton';
import { useStlDisplay } from '@/hooks/useStlDisplay';
import { LuRefreshCcw } from 'react-icons/lu';

const ResetModelButton = () => {
  const { resetModel } = useStlDisplay();
  return (
    <>
      <MenuButton onClick={resetModel} icon={<LuRefreshCcw />} tooltip='Refresh' text='Refresh' />
    </>
  );
};

export default ResetModelButton;
