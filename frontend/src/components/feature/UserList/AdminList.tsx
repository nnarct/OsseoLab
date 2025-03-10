import { useGetAdmins } from '@/services/admin/user.service';
import { Card, Table } from 'antd';
import { userColumns } from '@/components/feature/UserList/userColumns';

const AdminList = () => {
  const { data, isLoading } = useGetAdmins();

  return (
    <Card title='Admin List'>
      <Table dataSource={data} columns={userColumns} loading={isLoading} rowKey={'id'} scroll={{ x: 'auto' }} />
    </Card>
  );
};

export default AdminList;
