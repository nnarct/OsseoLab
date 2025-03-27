import { Button } from 'antd';
import PlaneList from './PlaneList';
import { useStlDisplay } from '@/hooks/useStlDisplay';

const MenuBar = ({ onSave, saving }: { onSave: () => void; saving: boolean }) => {
  const { apply, addPlane, applyCut, unapplyCut } = useStlDisplay();

  return (
    <>
      <div className='flex gap-3 p-3'>
        <Button onClick={addPlane}>Add Cutting Plane</Button>

        <Button onClick={apply ? unapplyCut : applyCut}>{apply ? 'undo cut' : 'cut'}</Button>
        <Button onClick={onSave} loading={saving}>
          Save
        </Button>
      </div>

      <PlaneList />
    </>
  );
};

export default MenuBar;

{
  /* <Dropdown
          overlay={
            <div className='flex flex-col gap-y-4 rounded-md bg-white p-3 inset-shadow-2xs'>
              <Select
                value={selectedCutPlanes[0]}
                className='min-w-24'
                allowClear
                placeholder='Select Plane 1'
                onChange={(value) => handleCuttingPlaneSelect(0, value)}
                disabled={planes.length === 0}
              >
                {planes.map(({ id }) => (
                  <Select.Option value={id} key={id}>
                    {id}
                  </Select.Option>
                ))}
              </Select>

              <Select
                value={selectedCutPlanes[1]}
                className='min-w-24'
                allowClear
                placeholder='Select Plane 2'
                onChange={(value) => handleCuttingPlaneSelect(1, value)}
                disabled={planes.length < 2}
              >
                {planes
                  .filter(({ id }) => id !== selectedCutPlanes[0])
                  .map(({ id }) => (
                    <Select.Option value={id} key={id}>
                      {id}
                    </Select.Option>
                  ))}
              </Select>

              <Button onClick={applyCut} disabled={!selectedCutPlanes[0]} className='mt-2 w-full'>
                Apply Cut
              </Button>
              <Button onClick={unapplyCut} disabled={!selectedCutPlanes[0]} className='mt-2 w-full'>
                Unapply Cut
              </Button>
            </div>
          }
          trigger={['click']}
        >
          <Button onClick={apply ? unapplyCut : applyCut}>{apply ? 'undo cut' : 'cut'}</Button>
        </Dropdown> */
}
