import { useGetDoctors } from '@/services/admin/user.service';
import { Card, Table } from 'antd';
import { userColumns } from '@/components/feature/UserList/userColumns';

const DoctorList = () => {
  const { data, isLoading } = useGetDoctors();

  return (
    <Card title='Doctor List'>
      <Table dataSource={data} columns={userColumns} loading={isLoading} rowKey={'id'} />
    </Card>
  );
};

export default DoctorList;
