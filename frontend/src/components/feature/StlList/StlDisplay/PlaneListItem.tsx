import { Button, List, Radio, Flex, Typography } from 'antd';
import { FaCheck, FaTrashAlt } from 'react-icons/fa';
import PlaneSettings from './PlaneSettings';
import type { TransformControlsMode } from './types';

const PlaneListItem = ({
  plane,
  idx,
  activePlaneId,
  handleSelectPlane,
  removePlane,
  updatePlaneProperty,
}: {
  plane: {
    id: string;
    mode: string;
    frontColor: string;
    backColor: string;
    opacity: number;
  };
  idx: number;
  activePlaneId: string | null;
  handleSelectPlane: (id: string) => void;
  removePlane: (id: string) => void;
  updatePlaneProperty: (
    id: string,
    property: Partial<{ mode: TransformControlsMode; frontColor: string; backColor: string; opacity: number }>
  ) => void;
}) => {
  return (
    <List.Item
      actions={[
        <PlaneSettings plane={plane} updatePlaneProperty={updatePlaneProperty} />,

        <Button onClick={() => removePlane(plane.id)} icon={<FaTrashAlt />} danger />,
      ]}
    >
      <Flex gap={12} align='center'>
        <Button
          onClick={() => handleSelectPlane(plane.id)}
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
