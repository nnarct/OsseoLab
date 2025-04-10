import { useGetTechnicians } from '@/services/admin/user.service';
import { Card, Table } from 'antd';
import { userColumns } from '@/components/feature/UserList/userColumns';

const TechnicianList = () => {
  const { data, isLoading } = useGetTechnicians();
  return (
    <Card title='Technician List'>
      <Table dataSource={data} columns={userColumns} loading={isLoading} rowKey={'id'} scroll={{ x: 'auto' }} />
    </Card>
  );
};

export default TechnicianList;
