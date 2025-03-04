import { TableProps, Button } from 'antd';
import { UserListDataType } from './UserList';

export const userColumns: TableProps<UserListDataType>['columns'] = [
  { key: 'id', dataIndex: 'id', title: 'id', width: '30%' },
  {
    key: 'name',
    dataIndex: 'firstname',
    title: 'name',
    sorter: (a, b) => a.firstname.localeCompare(b.firstname),
    render: (_, record) => `${record.firstname} ${record.lastname}`,
    width: '30%',
  },
  {
    key: 'email',
    dataIndex: 'email',
    title: 'Email',
    sorter: (a, b) => a.email.localeCompare(b.email),
    width: '30%',
  },
  {
    key: 'id',
    dataIndex: 'id',
    title: 'Action',
    width: '10%',
    align: 'center',
    render: () => <Button type='primary'>View</Button>,
  },
];
