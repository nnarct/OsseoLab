import dayjs from 'dayjs';
import { TableProps, Button, Table } from 'antd';
import type { STLDataType } from '@/types/stlDisplay';
import StlIdCell from './StlIdCell';
import { useNavigate } from 'react-router-dom';

type Props = {
  // selectedStlId: string;
  // setSelectedStl: React.Dispatch<React.SetStateAction<string | null>>;
  // setSelectedStlId: React.Dispatch<React.SetStateAction<string>>;
  // stlDisplayRef: React.MutableRefObject<HTMLDivElement | null>;
  filteredData: STLDataType[];
};

// const StlTable = ({ setSelectedStl, setSelectedStlId, stlDisplayRef, selectedStlId, filteredData }: Props) => {
const StlTable = ({ filteredData }: Props) => {
  // v1: For seeing stl in single same page
  // const handleViewClick = (url: string, id: string) => {
  //   setSelectedStl(url);
  //   setSelectedStlId(id);
  //   setTimeout(() => {
  //     stlDisplayRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  //   }, 100);
  // };

  // v2: For seeing stl in new page
  const navigate = useNavigate();
  const handleViewClick = (id: string) => {
    console.log('handleViewClick', id);
    navigate('/case/' + id);
  };

  const columns: TableProps<STLDataType>['columns'] = [
    {
      title: 'created at',
      dataIndex: 'created_at',
      key: 'created_at',
      width: '15%',
      render: (time) => dayjs(time).format('HH:mm:ss DD MMM'),
    },
    {
      title: 'last updated',
      dataIndex: 'last_updated',
      key: 'last_updated',
      width: '15%',
      sorter: (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
      render: (time) => dayjs(time).format('HH:mm:ss DD MMM'),
    },
    {
      title: 'Model Name',
      dataIndex: 'filename',
      key: 'filename',
      width: '30%',
      render: (filename) => <span className='whitespace-nowrap'>{filename}</span>,
      sorter: (a, b) => a.filename.localeCompare(b.filename),
    },
    {
      title: 'Filename',
      dataIndex: 'original_filename',
      key: 'original_filename',
      width: '30%',
      render: (original_filename) => <span className='whitespace-nowrap'>{original_filename}</span>,
      sorter: (a, b) => a.original_filename.localeCompare(b.original_filename),
    },
    {
      title: 'Action',
      dataIndex: 'url',
      key: 'url',
      width: '10%',
      align: 'center',
      render: (_, record) => (
        <Button type='primary' onClick={() => handleViewClick(record.id)}>
          View
        </Button>
      ),
    },
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      render: (id) => <StlIdCell id={id} />,
    },
  ];
  return <Table dataSource={filteredData} columns={columns} rowKey='id' scroll={{ x: 'auto' }} />;
};

export default StlTable;
