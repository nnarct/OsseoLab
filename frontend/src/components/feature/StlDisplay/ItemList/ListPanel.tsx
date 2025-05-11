import { useStlDisplay } from '@/hooks/useStlDisplay';
import { useItemListPanelStateStore } from '@/store/useItemListPanelStateStore';
import { Card, Typography, Button } from 'antd';
import { IoEyeOutline } from 'react-icons/io5';
import { IoEyeSharp } from 'react-icons/io5';
import { RxCross1 } from 'react-icons/rx';

import PlaneControls from '../ClippingPlane/PlaneControls';

const ListPanel = () => {
  const { isOpen } = useItemListPanelStateStore();
  const {
    planeHandler: { getPlanes, togglePlaneVisibility, removePlaneById},
    measureHandler: { markerPairs, togglePairVisibility, removePairById },
    angleHandler: { angleGroup, toggleAngleVisibility, removeAngleGroupById },
  } = useStlDisplay();
  const planes = getPlanes();

  const renderGroup = <T extends { id: string; show: boolean }>(
    label: string,
    data: T[],
    renderValue: (item: T) => React.ReactNode,
    onToggle: (id: string) => void,
    onRemove: (id: string) => void
  ) => {
    if (data.length === 0) return null;
    return (
      <div>
        <div className='border-b border-black pb-1'>{label}</div>
        {data.map((item, index) => {
          const isLast = index === data.length - 1;
          return (
            <div key={item.id} className={`py-1 pr-0 ${isLast ? '' : 'border-b border-dashed border-gray-300'}`}>
              <div className='flex w-full items-center justify-between'>
                {renderValue(item)}
                <div className='flex'>
                  <Button
                    type='text'
                    icon={item.show ? <IoEyeSharp size={20} /> : <IoEyeOutline size={20} />}
                    style={{ verticalAlign: 'middle' }}
                    onClick={() => onToggle(item.id)}
                  />
                  <Button
                    type='text'
                    danger
                    icon={<RxCross1 />}
                    style={{ verticalAlign: 'middle' }}
                    onClick={() => onRemove(item.id)}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  // if (!isOpen) return null;
  return (
    <div
      className={`fixed z-[1000] origin-top transition-all duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] ${
        isOpen ? 'scale-y-100 opacity-100' : 'pointer-events-none scale-y-95 opacity-0'
      }`}
    >
      <div
        style={{
          boxShadow: `0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05)`,
          borderRadius: '8px',
          marginTop: '6px',
        }}
      >
        <Card
          title={
            <Typography.Title level={5} className='!mb-0 px-12 text-center'>
              Measurement List
            </Typography.Title>
          }
          size='small'
          style={{ minWidth: 240, border: 'none' }}
        >
          <div className='flex flex-col'>
            {markerPairs.length === 0 && angleGroup.length === 0 && planes.length === 0 && (
              <div className='whitespace-nowrap'>Select a point.</div>
            )}
            {renderGroup(
              'Distance',
              markerPairs,
              (pair) => pair.distance.toFixed(2),
              togglePairVisibility,
              removePairById
            )}
            {renderGroup(
              'Angle',
              angleGroup,
              (group) => `${group.angleDeg.toFixed(2)} °`,
              toggleAngleVisibility,
              removeAngleGroupById
            )}
            {renderGroup(
              'Plane',
              planes,
              (plane) => {
                return (
                  <div className='flex items-center gap-1'>
                    <span>{`Plane ${plane.number}`}</span>
                    <PlaneControls plane={plane} />
                  </div>
                );
              },
              togglePlaneVisibility,
              removePlaneById
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ListPanel;
