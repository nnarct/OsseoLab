import { Button, List, Radio, Flex, Typography } from 'antd';
import { FaCheck, FaTrashAlt } from 'react-icons/fa';
import PlaneSettings from './PlaneSettings';
import type { PlaneDataType } from '@/types/stlDisplay';
import { useStlDisplay } from '@/hooks/useStlDisplay';

const PlaneListItem = ({ plane, idx }: { plane: PlaneDataType; idx: number }) => {
  const { removePlane, setActivePlaneId, activePlaneId, updatePlaneProperty } = useStlDisplay();

  return (
    <List.Item
      actions={[
        <PlaneSettings plane={plane} />,
        <Button onClick={() => removePlane(plane.id)} icon={<FaTrashAlt />} danger />,
      ]}
    >
      <Flex gap={12} align='center'>
        <Button
          onClick={() => setActivePlaneId(plane.id)}
          type={plane.id === activePlaneId ? 'primary' : 'default'}
          icon={<FaCheck />}
          shape={'circle'}
        />
        <Typography.Text>Plane {idx + 1} :</Typography.Text>
        <Radio.Group
          optionType='button'
          buttonStyle='solid'
          disabled={activePlaneId !== plane.id}
          value={plane.mode}
          onChange={(e) => updatePlaneProperty(plane.id, { mode: e.target.value })}
          options={[
            { value: 'translate', label: 'Move' },
            { value: 'scale', label: 'Scale' },
            { value: 'rotate', label: 'Rotate' },
          ]}
        />
      </Flex>
    </List.Item>
  );
};

export default PlaneListItem;
