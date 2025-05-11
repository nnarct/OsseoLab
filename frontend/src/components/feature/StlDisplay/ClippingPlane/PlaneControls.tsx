import { PlaneDataType } from '@/types/stlDisplay';
import PlaneSettings from './PlaneSettings';
import { Tooltip, Button } from 'antd';
import { FaCheck } from 'react-icons/fa';
import { HiOutlineArrowsExpand } from 'react-icons/hi';
import { IoMdMove } from 'react-icons/io';
import { TbRotate360 } from 'react-icons/tb';
import { useStlDisplay } from '@/hooks/useStlDisplay';
import { MdFlip } from 'react-icons/md';

const PlaneControls = ({ plane }: { plane: PlaneDataType }) => {
  const {
    updateProperty: updatePlaneProperty,
    activePlaneId,
    toggleActivePlaneId,
    flipPlane,
  } = useStlDisplay().planeHandler;
  const isActive = activePlaneId === plane.id;

  return (
    <>
      <PlaneSettings plane={plane} />
      <Tooltip title='Flip'>
        <Button size='small' type={'text'} icon={<MdFlip />} onClick={() => flipPlane(plane.id)} />
      </Tooltip>
      <Tooltip title='Move'>
        <Button
          type={plane.mode === 'translate' ? 'primary' : 'text'}
          size='small'
          icon={<IoMdMove />}
          disabled={!isActive}
          onClick={() => updatePlaneProperty(plane.id, { mode: 'translate' })}
        />
      </Tooltip>
      <Tooltip title='Scale'>
        <Button
          type={plane.mode === 'scale' ? 'primary' : 'text'}
          size='small'
          icon={<HiOutlineArrowsExpand />}
          disabled={!isActive}
          onClick={() => updatePlaneProperty(plane.id, { mode: 'scale' })}
        />
      </Tooltip>
      <Tooltip title='Rotate'>
        <Button
          type={plane.mode === 'rotate' ? 'primary' : 'text'}
          size='small'
          icon={<TbRotate360 />}
          disabled={!isActive}
          onClick={() => updatePlaneProperty(plane.id, { mode: 'rotate' })}
        />
      </Tooltip>
      <Button
        size='small'
        onClick={() => toggleActivePlaneId(plane.id)}
        type={isActive ? 'primary' : 'text'}
        icon={<FaCheck />}
        shape='circle'
      />
    </>
  );
};
export default PlaneControls;
