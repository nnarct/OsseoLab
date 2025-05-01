import { useGetDoctors } from '@/services/admin/user.service';
import { Card, Table, Input } from 'antd';
import { useState, useMemo } from 'react';
import { userColumns } from '@/components/feature/UserList/userColumns';
import CreateDoctorModal from './CreateDoctorModal';

const DoctorList = () => {
  const { data, isLoading } = useGetDoctors();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = useMemo(() => {
    if (!data) return [];
    return data.filter((item) => {
      const query = searchTerm.toLowerCase();
      return (
        (`${item.firstname} ${item.lastname}`).toLowerCase().includes(query) ||
        item.firstname?.toLowerCase().includes(query) ||
        item.lastname?.toLowerCase().includes(query) ||
        item.email?.toLowerCase().includes(query) ||
        item.phone?.toLowerCase().includes(query)||
        item.username?.toLowerCase().includes(query)
      );
    });
  }, [data, searchTerm]);

  return (
    <Card title='Surgeon List'>
      <div className='flex w-full justify-between items-center pb-4'>
        <Input.Search
          placeholder='Search by name, username, email, or mobile'
          allowClear
          onChange={(e) => setSearchTerm(e.target.value)}
          className='max-w-sm'
        />
        <CreateDoctorModal />
      </div>
      <Table dataSource={filteredData} columns={userColumns} loading={isLoading} rowKey={'id'} scroll={{ x: 'auto' }} />
    </Card>
  );
};

export default DoctorList;
