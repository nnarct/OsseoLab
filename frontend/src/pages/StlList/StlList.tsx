import { getStlList, STLDataType } from '@/api/stl.api';
import StlUploader from '@/components/feature/StlList/StlUploader';
import StlDisplay from '@/components/feature/StlList/StlDisplay';
import { Button, Card, Input, Table, TableProps, Tooltip, Typography } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { IoMdCheckmark, IoMdCopy } from 'react-icons/io';
// import StlViewer from './STLViewer';

const StlList = () => {
  const stlDisplayRef = useRef<HTMLDivElement | null>(null);
  const [stls, setStls] = useState<STLDataType[]>([]);
  const [selectedStl, setSelectedStl] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchValue, setSearchValue] = useState<string>('');
  const [filteredData, setFilteredData] = useState<STLDataType[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getStlList();
        setStls(data);
        setFilteredData(data);
      } catch (error) {
        console.error('Error fetching STL files:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const filtered = stls.filter((stl) => stl.filename.toLowerCase().includes(searchValue.toLowerCase()));
    setFilteredData(filtered);
  }, [searchValue, stls]);

  const handleViewClick = (url: string) => {
    setSelectedStl(url);
    setTimeout(() => {
      stlDisplayRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  const handleCopyId = async (id: string) => {
    try {
      await navigator.clipboard.writeText(id);
      setCopiedId(id);

      setTimeout(() => setCopiedId(null), 1500);
    } catch (error) {
      console.error('Failed to copy ID:', error);
    }
  };

  const columns: TableProps<STLDataType>['columns'] = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: '45%',
      render: (id) => (
        <div className='flex items-center space-x-1'>
          <span className='whitespace-nowrap'>{id}</span>
          <Tooltip title={copiedId === id ? 'Copied!' : 'Copy'}>
            <Button
              type='text'
              icon={copiedId === id ? <IoMdCheckmark style={{ color: 'green' }} /> : <IoMdCopy />}
              onClick={() => handleCopyId(id)}
            />
          </Tooltip>
        </div>
      ),
    },
    {
      title: 'Filename',
      dataIndex: 'filename',
      key: 'filename',
      width: '45%',
      render: (filename) => <span className='whitespace-nowrap'>{filename}</span>,
      sorter: (a, b) => a.filename.localeCompare(b.filename),
    },
    {
      title: 'Action',
      dataIndex: 'url',
      key: 'url',
      width: '10%',
      align: 'center',
      render: (url) => (
        <Button type='primary' onClick={() => handleViewClick(url)}>
          View
        </Button>
      ),
    },
  ];

  return (
    <div className='container mx-auto'>
      <Card title={'STL List'}>
        <div className='mb-6 flex justify-between'>
          <Input.Search allowClear placeholder='Enter STL name' className='mr-6 max-w-80' onSearch={setSearchValue} />
          <StlUploader />
        </div>
        <Table dataSource={filteredData} columns={columns} rowKey='id' scroll={{ x: 'auto' }} />
      </Card>
      <div ref={stlDisplayRef} className='mt-6 h-[60vw] max-h-[80vh] rounded-lg bg-slate-800'>
        {selectedStl ? (
          <div className='h-full w-full'>
            <StlDisplay url={selectedStl} />
          </div>
        ) : (
          <Typography.Title className='flex h-full w-full items-center justify-center !text-white' level={3}>
            Select one STL to display
          </Typography.Title>
        )}
      </div>
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
