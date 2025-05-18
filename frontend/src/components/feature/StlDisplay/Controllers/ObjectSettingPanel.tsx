import { useStlModel } from '@/hooks/useStlModel';
import { Button, Card, ColorPicker, Tooltip, Switch } from 'antd';
import { IoReloadSharp } from 'react-icons/io5';
const ObjectSettingPanel = ({ isOpen }: { isOpen: boolean }) => {
  const { totalMesh, meshColors, updateMeshColor, resetMeshColor, names, meshVisibility, updateMeshVisibility } =
    useStlModel();
console.log({meshVisibility})
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
          {names.map((name, index) => (
            <div
              key={index}
              className='flex items-center justify-between px-1 py-2'
              style={{ borderBottom: '1px solid #c7c7c7' }}
            >
              <div className='flex items-center gap-x-1'>
                <Tooltip title='Reset'>
                  <Button icon={<IoReloadSharp />} type='text' onClick={() => resetMeshColor(index)} />
                </Tooltip>
                <span>
                  {index + 1}. {name}
                </span>
              </div>
              <Switch
                checked={meshVisibility[index]}
                onChange={(checked) => updateMeshVisibility(index, checked)}
                size='small'
              />
              <ColorPicker
                value={meshColors[index]}
                onChange={(color) => updateMeshColor(index, color.toHexString())}
                style={{ marginLeft: '8px' }}
              />
              // buttton to update mesh opacity
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
};

export default ObjectSettingPanel;
