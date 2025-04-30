import { useStlDisplay } from '@/hooks/useStlDisplay';
import MeasureLine from './MeasureLine';

const MeasureLineGroup = () => {
  const {
    measureHandler: { markerPairs },
    tool: { markerRadius },
  } = useStlDisplay();

  return (
    <>
      {markerPairs.map((pair, index) => {
        return <MeasureLine pair={pair} key={index} markerRadius={markerRadius} />;
      })}
    </>
  );
};

export default MeasureLineGroup;
