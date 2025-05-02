import { useGetAdmins } from '@/services/admin/user.service';
import { userColumns } from '@/components/feature/UserList/userColumns';
import { Card, Table, Input, Layout } from 'antd';
import { useState, useMemo } from 'react';
import CustomHeader from '@/components/common/CustomHeader';
import CreateAdminModal from './CreateAdminModal';

const AdminList = () => {
  const { data, isLoading } = useGetAdmins();
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
        <p className='text-2xl font-bold'>Admin List</p>
      </CustomHeader>
      <Layout.Content className='p-4'>
        <Card title='Admin List'>
          <div className='flex w-full items-center justify-between gap-x-4 pb-4'>
            <Input.Search
              placeholder='Search by name, username, email, or mobile'
              allowClear
              onChange={(e) => setSearchTerm(e.target.value)}
              className='max-w-sm'
            />
            <CreateAdminModal />
          </div>
          <Table
            dataSource={filteredData}
            columns={userColumns}
            loading={isLoading}
            rowKey={'id'}
            scroll={{ x: 'auto' }}
          />
        </Card>{' '}
      </Layout.Content>{' '}
    </>
  );
};

export default AdminList;
