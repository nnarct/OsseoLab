import { useStlModel } from '@/hooks/useStlModel';
import { Button, Card, ColorPicker, Tooltip, Slider } from 'antd';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { IoReloadSharp } from 'react-icons/io5';

const ObjectSettingPanel = ({ isOpen }: { isOpen: boolean }) => {
  const { meshes, updateMeshVisibility, updateMeshColor, updateMeshOpacity, resetMeshColor } = useStlModel();

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
        <Card size='small' style={{ minWidth: 180, border: 'none' }}>
          {meshes.map((mesh, index) => (
            <div
              key={index}
              className='flex items-center justify-between px-1 py-2'
              style={{ borderBottom: '1px solid #c7c7c7' }}
            >
              <div className='flex items-center gap-x-1'>
                <Tooltip title='Reset'>
                  <Button icon={<IoReloadSharp />} type='text' onClick={() => resetMeshColor(mesh.id)} />
                </Tooltip>
                <span>
                  {index + 1}. {mesh.name}
                </span>
              </div>
              <div className='flex items-center gap-x-1 pl-4'>
                <Tooltip title={mesh.visible ? 'Hide' : 'Show'}>
                  <Button
                    type='text'
                    icon={mesh.visible ? <FaEye /> : <FaEyeSlash />}
                    onClick={() => updateMeshVisibility(mesh.id, !mesh.visible)}
                  />
                </Tooltip>
                <Tooltip title={'Change object color'}>
                  <ColorPicker
                    value={mesh.color}
                    onChange={(color) => updateMeshColor(mesh.id, color.toHexString())}
                    style={{ marginLeft: '8px' }}
                  />
                </Tooltip>
                <Tooltip title={'Adjust object opacity'}>
                  <Slider
                    min={0}
                    max={1}
                    step={0.01}
                    value={mesh.opacity}
                    onChange={(value) => updateMeshOpacity(mesh.id, value)}
                    style={{ width: 60, marginLeft: 8 }}
                  />
                </Tooltip>
              </div>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
};

export default ObjectSettingPanel;
