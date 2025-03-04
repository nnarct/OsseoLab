import { useGetUsers } from '@/services/admin/user.service';
import { UserRole } from '@/types/user';
import { Card, Table } from 'antd';
import { userColumns } from './userColumns';

const UserList = () => {
  const { data, isLoading } = useGetUsers();

  return (
    <Card title='Admin List'>
      <Table dataSource={data} columns={userColumns} loading={isLoading} rowKey={'id'} />
    </Card>
  );
};

export default UserList;

export interface UserListDataType {
  email: string;
  firstname: string;
  id: string;
  lastname: string;
  role: UserRole;
}
