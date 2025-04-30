import { ColorPicker, Dropdown, Slider, Button, Flex } from 'antd';

import { RiEqualizer3Line } from 'react-icons/ri';
import { useStlDisplay } from '@/hooks/useStlDisplay';
import type { PlaneDataType } from '@/types/stlDisplay';

const PlaneSettings = ({ plane }: { plane: PlaneDataType }) => {
  const { planeHandler } = useStlDisplay();
  const { updateProperty: updatePlaneProperty } = planeHandler;
  return (
    <Dropdown
      placement='bottomRight'
      overlay={
        <div className='rounded-md bg-white p-3 inset-shadow-2xs'>
          <Flex vertical className=''>
            <ColorPicker
              disabledAlpha={true}
              format='hex'
              value={plane.frontColor}
              onChange={(color) => updatePlaneProperty(plane.id, { frontColor: color.toRgbString() })}
              showText={() => <>Front color</>}
            />

            <ColorPicker
              className='mt-3'
              disabledAlpha={true}
              format='hex'
              value={plane.backColor}
              onChange={(color) => updatePlaneProperty(plane.id, { backColor: color.toRgbString() })}
              showText={() => <>Back Color</>}
            />
            <p className='mt-2'>Opacity</p>
            <Slider
              min={0}
              max={1}
              step={0.05}
              value={plane.opacity}
              onChange={(value) => updatePlaneProperty(plane.id, { opacity: value })}
            />
          </Flex>
        </div>
      }
      trigger={['click']}
    >
      <Button size='small' type='text' icon={<RiEqualizer3Line />} />
    </Dropdown>
  );
};

export default PlaneSettings;
