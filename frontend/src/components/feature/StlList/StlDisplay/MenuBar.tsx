import { Button } from 'antd';
import PlaneList from './PlaneList';
import { useStlDisplay } from '@/hooks/useStlDisplay';
import { useMeasureStore } from '@/store/useMeasureStore';
import LineList from '../MeasureTool/LineList';

// import { MeasureDistance } from './MeasureDistance';

const MenuBar = ({ onSave, saving }: { onSave: () => void; saving: boolean }) => {
  const { apply, addPlane, applyCut, unapplyCut } = useStlDisplay();
  const { activeMeasure, setActiveMeasure, panelInfo } = useMeasureStore();
  const setMeasure = () => {
    setActiveMeasure(!activeMeasure);
  };
  return (
    <>
      <div className='flex gap-3 p-3'>
        <Button onClick={addPlane}>Add Cutting Plane</Button>

        <Button onClick={apply ? unapplyCut : applyCut}>{apply ? 'undo cut' : 'cut'}</Button>
        <Button onClick={onSave} loading={saving}>
          Save
        </Button>
        <Button onClick={setMeasure} type={activeMeasure ? 'primary' : 'default'}>
          {/* className={`measure-button ${activeMeasure ? 'active' : ''}`}*/}
          {activeMeasure ? 'Exit Measure' : 'Measure'}
        </Button>
      </div>
      {activeMeasure && (
        <>
          <div className='bg-blue-100 py-2'>{panelInfo}</div>
          <LineList />
        </>
      )}
      <PlaneList />
      {/* <MeasureDistance /> */}
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
