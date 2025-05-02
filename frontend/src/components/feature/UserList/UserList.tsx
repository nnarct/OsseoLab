import { useGetUsers } from '@/services/admin/user.service';
import { UserRole } from '@/types/user';
import { Card, Input, Layout, Table } from 'antd';
import { userColumns } from './userColumns';
import CustomHeader from '@/components/common/CustomHeader';
import { useMemo, useState } from 'react';

const UserList = () => {
  const { data, isLoading } = useGetUsers();
  const [searchTerm, setSearchTerm] = useState<string>('');

  const roleColumn = {
    key: 'role',
    dataIndex: 'role',
    title: 'Role',
    sorter: (a: { role: UserRole }, b: { role: UserRole }) => a.role.localeCompare(b.role),
    render: (role: UserRole) => {
      if (role === UserRole.Admin) {
        return 'Admin';
      }
      if (role === UserRole.Technician) {
        return 'Technician';
      }
      if (role === UserRole.Doctor) {
        return 'Surgeon';
      }
    },
  };
  const columns =
    userColumns && userColumns.length > 1
      ? [...userColumns.slice(0, userColumns.length - 1), roleColumn, userColumns[userColumns.length - 1]]
      : [...(userColumns ?? []), roleColumn];

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
        <p className='text-2xl font-bold'>User List</p>
      </CustomHeader>
      <Layout.Content className='p-4'>
        <Card title='User List'>
          <div className='flex w-full items-center justify-between gap-x-4 pb-4'>
            <Input.Search
              placeholder='Search by name, username, email, or mobile'
              allowClear
              onChange={(e) => setSearchTerm(e.target.value)}
              className='max-w-sm'
            />
            {/* <CreateUserModal /> */}
          </div>
          <Table dataSource={filteredData} columns={columns} loading={isLoading} rowKey={'id'} scroll={{ x: 'auto' }} />
        </Card>
      </Layout.Content>
    </>
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
