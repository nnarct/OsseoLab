import type { STLDataType } from '@/types/stlDisplay';
import StlUploader from '@/components/feature/StlList/StlUploader';
import { Card, Input, } from 'antd';
import { useEffect, useState } from 'react';

import StlTable from '@/components/feature/StlList/StlTable';
import { useGetStlList } from '@/services/admin/stl.service';

// const DEMO_STL = 'http://localhost:5002/stl_files/d0bc50ed-6143-489f-ac3c-f8323d2fe86c';

const StlList = () => {
  const { data } = useGetStlList();
  const [stls, setStls] = useState<STLDataType[]>([]);
  // const [selectedStl, setSelectedStl] = useState<string | null>('');
  // const [selectedStlId, setSelectedStlId] = useState<string>('');
  const [searchValue, setSearchValue] = useState<string>('');
  const [filteredData, setFilteredData] = useState<STLDataType[]>([]);

  useEffect(() => {
    if (data) {
      const sorted = data.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

      setStls(sorted);
      setFilteredData(sorted);
    }
  }, [data]);

  useEffect(() => {
    const filtered = stls.filter((stl) => stl.filename.toLowerCase().includes(searchValue.toLowerCase()));
    setFilteredData(filtered);
  }, [searchValue, stls]);

  return (
    <div className='p-4'>
      <Card title={'STL List'}>
        <div className='mb-6 flex justify-between'>
          <Input.Search allowClear placeholder='Enter STL name' className='mr-6 max-w-80' onSearch={setSearchValue} />
          <StlUploader />
        </div>
        <StlTable
          // setSelectedStl={setSelectedStl}
          // setSelectedStlId={setSelectedStlId}
          // selectedStlId={selectedStlId}
          filteredData={filteredData}
        />
      </Card>
    </div>
  );
};

export default StlList;

// const file = [
//   { filename: 'Final Skull', path: '/case0050/NewFinalMaxilla_Point_duplicate_20250221_032135.stl ' },
//   { filename: 'Pre-move skull', path: '/case0050/NewMaxillaTrim_duplicate_20250221_032135.stl ' },
//   { filename: 'Root [Final position]', path: '/case0050/Root_FinalPosition_20250211_104254.stl ' },
//   { filename: 'Root [Pre-move]', path: '/case0050/Root_Preposition_20250211_104214.stl' },
// ];
