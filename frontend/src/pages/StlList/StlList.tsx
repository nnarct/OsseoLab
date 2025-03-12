import { getStlList, STLDataType } from '@/api/stl.api';
import StlUploader from '@/components/feature/StlList/UploadForm/StlUploader';
import StlDisplay from '@/components/feature/StlList/StlDisplay/StlDisplay';
import { Button, Card, Input, Table, TableProps, Tooltip, Typography } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { IoMdCheckmark, IoMdCopy } from 'react-icons/io';
// import StlViewer from './STLViewer';

const DEMO_STL = 'http://localhost:5002//stl_files/d0bc50ed-6143-489f-ac3c-f8323d2fe86c';

const StlList = () => {
  const stlDisplayRef = useRef<HTMLDivElement | null>(null);
  const [stls, setStls] = useState<STLDataType[]>([]);
  const [selectedStl, setSelectedStl] = useState<string | null>(DEMO_STL);
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
      title: 'Model Name',
      dataIndex: 'filename',
      key: 'filename',
      width: '45%',
      render: (filename) => <span className='whitespace-nowrap'>{filename}</span>,
      sorter: (a, b) => a.filename.localeCompare(b.filename),
    },
    {
      title: 'Filename',
      dataIndex: 'original_filename',
      key: 'original_filename',
      width: '45%',
      render: (original_filename) => <span className='whitespace-nowrap'>{original_filename}</span>,
      sorter: (a, b) => a.original_filename.localeCompare(b.original_filename),
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
      <div ref={stlDisplayRef} className='mb-6 rounded-lg bg-slate-800'>
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

      <Card title={'STL List'}>
        <div className='mb-6 flex justify-between'>
          <Input.Search allowClear placeholder='Enter STL name' className='mr-6 max-w-80' onSearch={setSearchValue} />
          <StlUploader />
        </div>
        <Table dataSource={filteredData} columns={columns} rowKey='id' scroll={{ x: 'auto' }} />
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
