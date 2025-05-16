import { useStlModel } from '@/hooks/useStlModel';
import { Button, Card, ColorPicker, Tooltip } from 'antd';
import { IoReloadSharp } from 'react-icons/io5';
const MeshColorPicker = ({ isOpen }: { isOpen: boolean }) => {
  const { totalMesh, meshColors, updateMeshColor, resetMeshColor } = useStlModel();

  return (
    isOpen && (
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
          <Card size='small' style={{ minWidth: 240, border: 'none' }}>
            {Array.from({ length: totalMesh }).map((_, index) => (
              <div
                key={index}
                className='flex items-center justify-between border-b-1 border-b-gray-500 p-1 hover:bg-gray-200'
              >
                <div className='flex items-center gap-x-1'>
                  <Tooltip title='Reset'>
                    <Button icon={<IoReloadSharp />} type='text' onClick={() => resetMeshColor(index)} />
                  </Tooltip>
                  <span>Mesh {index + 1}</span>
                </div>
                <ColorPicker
                  value={meshColors[index]}
                  onChange={(color) => updateMeshColor(index, color.toHexString())}
                  style={{ marginLeft: '8px' }}
                />
              </div>
            ))}
          </Card>
        </div>
      </div>
    )
  );
};

export default MeshColorPicker;
