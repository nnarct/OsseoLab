import { useGetTechnicians } from '@/services/admin/user.service';
import { Card, Input, Layout, Table } from 'antd';
import { userColumns } from '@/components/feature/UserList/userColumns';
import { useMemo, useState } from 'react';
import CustomHeader from '@/components/common/CustomHeader';

const TechnicianList = () => {
  const { data, isLoading } = useGetTechnicians();
  const [searchTerm, setSearchTerm] = useState<string>('');

  const filteredData = useMemo(() => {
    if (!data) return [];
    return data.filter((item) => {
      const query = searchTerm.toLowerCase();
      return (
        `${item.firstname} ${item.lastname}`.toLowerCase().includes(query) ||
        item.firstname?.toLowerCase().includes(query) ||
        item.lastname?.toLowerCase().includes(query) ||
        item.email?.toLowerCase().includes(query) ||
        item.phone?.toLowerCase().includes(query) ||
        item.username?.toLowerCase().includes(query)
      );
    });
  }, [data, searchTerm]);

  return (
    <>
      <CustomHeader>
        <p className='text-2xl font-bold'>Technician List</p>
      </CustomHeader>
      <Layout.Content className='p-4'>
        
        <Card title='Technician List'>
         <div className='flex w-full items-center justify-between gap-x-4 pb-4'>
          <Input.Search
            placeholder='Search by name, username, email, or mobile'
            allowClear
            onChange={(e) => setSearchTerm(e.target.value)}
            className='max-w-sm'
          />
          {/* <CreateDoctorModal /> */}
        </div> <Table
            dataSource={filteredData}
            columns={userColumns}
            loading={isLoading}
            rowKey={'id'}
            scroll={{ x: 'auto' }}
          />
        </Card>
      </Layout.Content>
    </>
  );
};

export default TechnicianList;
