import { useGetTechnicians } from '@/services/admin/user.service';
import { Card, Table } from 'antd';
import { userColumns } from '@/components/feature/UserList/userColumns';

const TechnicianList = () => {
  const { data, isLoading } = useGetTechnicians();
  return (
    <Card title='Admin List'>
      <Table dataSource={data} columns={userColumns} loading={isLoading} rowKey={'id'} />
    </Card>
  );
};

export default TechnicianList;
