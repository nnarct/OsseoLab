import { useMeasureStore } from '@/store/useMeasureStore';
import { Typography } from 'antd';

const LineList = () => {
  const { markerPairs, removePair } = useMeasureStore();
  return (
    <div className='p-4' style={{ background: 'pink' }}>
      {markerPairs.map((pair, idx) => {
        const { origin, destination } = pair;
        const distance = origin.point.distanceTo(destination.point).toFixed(3);
        const angle = origin.normal.angleTo(destination.normal) * (180 / Math.PI);
        return (
          <Typography.Paragraph key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span>
              {idx + 1}. Distance: {distance} units | Angle: {angle.toFixed(1)}
            </span>
            <button onClick={() => removePair(idx)}>Remove</button>
          </Typography.Paragraph>
        );
      })}
    </div>
  );
};
export default LineList;
