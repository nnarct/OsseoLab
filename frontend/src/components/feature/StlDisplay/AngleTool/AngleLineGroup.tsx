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
        if (triple.show) return <AngleLine key={index} triple={triple} markerRadius={markerRadius} />;
      })}
    </>
  );
};

export default AngleLineGroup;
