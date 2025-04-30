import { useStlDisplay } from '@/hooks/useStlDisplay';
import AngleLine from './AngleLine';

const AngleLineGroup = () => {
  const {
    angleHandler: { angleGroup },
    tool: { markerRadius },
  } = useStlDisplay();

  return (
    <>
      {angleGroup?.map((triple, index) => {
        return <AngleLine key={index} triple={triple} markerRadius={markerRadius} />;
      })}
    </>
  );
};

export default AngleLineGroup;
