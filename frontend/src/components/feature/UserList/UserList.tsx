import { useGetUsers } from '@/services/admin/user.service';
import { UserRole } from '@/types/user';
import { Card, Table } from 'antd';
import { userColumns } from './userColumns';

const UserList = () => {
  const { data, isLoading } = useGetUsers();
  const roleColumn = { key: 'role', dataIndex: 'role', title: 'Role' };
  const columns =
    userColumns && userColumns.length > 1
      ? [...userColumns.slice(0, userColumns.length - 1), roleColumn, userColumns[userColumns.length - 1]]
      : [...(userColumns ?? []), roleColumn];
  return (
    <Card title='User List'>
      <Table dataSource={data} columns={columns} loading={isLoading} rowKey={'id'} scroll={{ x: 'auto' }} />
    </Card>
  );
};

export default UserList;

export interface UserListDataType {
  order: number;
  id: string;
  role: UserRole;
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  phone: string | null;
  dob: number | string | null;
  gender: 'male' | 'female' | 'other';
  profile_image: string | null;
  country: string | null;
  created_at: number | string;
  last_updated: number | string;
}
