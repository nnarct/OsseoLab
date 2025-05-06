import { TableProps, Button } from 'antd';
import { UserListDataType } from './UserList';
import { Doctor } from '@/types/doctor';

const renderTitle = (t: React.ReactNode) => <div className='whitespace-nowrap'>{t}</div>;

export const getUserColumns = (navigate: (path: string) => void): TableProps<UserListDataType>['columns'] => {
  return [
    { key: 'id', dataIndex: 'order', title: 'No.', width: '0', align: 'center', sorter: (a, b) => a.order - b.order },
    {
      key: 'name',
      dataIndex: 'firstname',
      title: 'Name',
      sorter: (a, b) => `${a.firstname} ${a.lastname}`.localeCompare(`${b.firstname} ${b.lastname}`),
      render: (_, record) => `${record.firstname} ${record.lastname}`,
      width: '30%',
    },
    {
      key: 'name',
      dataIndex: 'username',
      title: 'Username',
      sorter: (a, b) => a.username.localeCompare(b.username),
      width: '10%',
    },
    {
      key: 'email',
      dataIndex: 'email',
      title: 'Email',
      sorter: (a, b) => a.email.localeCompare(b.email),
      width: '10%',
    },
    {
      key: 'phone',
      dataIndex: 'phone',
      title: 'Mobile No.',
      sorter: (a, b) => (a.phone ?? '').localeCompare(b.phone ?? ''),
      render: (phone) => phone ?? '-',
      width: '10%',
    },
    {
      key: 'id',
      dataIndex: 'id',
      title: 'Action',
      width: '10%',
      align: 'center',
      render: (_, record) => (
        <Button type='primary' onClick={() => navigate(`/user/${record.id}`)}>
          View
        </Button>
      ),
    },
  ];
};

export const userColumns: TableProps<UserListDataType>['columns'] = [
  { key: 'id', dataIndex: 'order', title: 'No.', width: '0', align: 'center', sorter: (a, b) => a.order - b.order },
  {
    key: 'name',
    dataIndex: 'firstname',
    title: 'Name',
    sorter: (a, b) => `${a.firstname} ${a.lastname}`.localeCompare(`${b.firstname} ${b.lastname}`),
    render: (_, record) => `${record.firstname} ${record.lastname}`,
    width: '25%',
  },
  {
    key: 'name',
    dataIndex: 'username',
    title: 'Username',
    sorter: (a, b) => a.username.localeCompare(b.username),
    width: '25%',
  },
  {
    key: 'email',
    dataIndex: 'email',
    title: 'Email',
    sorter: (a, b) => a.email.localeCompare(b.email),
    width: '25%',
  },
  {
    key: 'phone',
    dataIndex: 'phone',
    title: 'Mobile No.',
    sorter: (a, b) => (a.phone ?? '').localeCompare(b.phone ?? ''),
    render: (phone) => phone ?? '-',
    width: '20%',
  },
];

export const doctorColumns: TableProps<Doctor>['columns'] = [
  // { key: 'id', dataIndex: 'order', title: 'No.', width: '0', align: 'center', sorter: (a, b) => a.order - b.order },
  {
    key: 'name',
    dataIndex: 'firstname',
    title: 'Name',
    sorter: (a, b) => `${a.firstname} ${a.lastname}`.localeCompare(`${b.firstname} ${b.lastname}`),
    render: (_, record) => `${record.firstname} ${record.lastname}`,
    width: '22%',
  },
  {
    key: 'name',
    dataIndex: 'username',
    title: 'Username',
    sorter: (a, b) => a.username.localeCompare(b.username),
    width: '16%',
  },
  {
    key: 'email',
    dataIndex: 'email',
    title: 'Email',
    sorter: (a, b) => a.email.localeCompare(b.email),
    width: '22%',
  },
  {
    key: 'phone',
    dataIndex: 'phone',
    title: renderTitle('Mobile No.'),
    sorter: (a, b) => (a.phone ?? '').localeCompare(b.phone ?? ''),
    render: (phone) => phone ?? '-',
    width: '12%',
  },
  {
    key: 'hospital',
    dataIndex: 'hospital',
    title: renderTitle('Hospital'),
    sorter: (a, b) => (a.hospital ?? '').localeCompare(b.hospital ?? ''),
    render: (hospital) => hospital ?? '-',
    width: '12%',
  },
  {
    key: 'doctor_registration_id',
    dataIndex: 'doctor_registration_id',
    title: renderTitle('Doctor Reg. ID'),
    sorter: (a, b) => (a.doctor_registration_id ?? '').localeCompare(b.doctor_registration_id ?? ''),
    render: (id) => id ?? '-',
    width: '12%',
  },
];
