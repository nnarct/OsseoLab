import { useGetDoctors } from '@/services/admin/user.service';
import { Card, Table, Input, Layout } from 'antd';
import { useState, useMemo } from 'react';
import { userColumns } from '@/components/feature/UserList/userColumns';
import CreateDoctorModal from './CreateTechnicianModal';
import CustomHeader from '@/components/common/CustomHeader';

const DoctorList = () => {
  const { data, isLoading } = useGetDoctors();
  const [searchTerm, setSearchTerm] = useState('');

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
        <p className='text-2xl font-bold'>Surgeon List</p>
      </CustomHeader>
      <Layout.Content className='p-4'>
        <Card title='Surgeon List'>
          <div className='flex w-full items-center justify-between pb-4 gap-x-4'>
            <Input.Search
              placeholder='Search by name, username, email, or mobile'
              allowClear
              onChange={(e) => setSearchTerm(e.target.value)}
              className='max-w-sm'
            />
            <CreateDoctorModal />
          </div>
          <Table
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

export default DoctorList;
