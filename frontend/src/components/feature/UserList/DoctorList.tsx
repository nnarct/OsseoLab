import { useGetDoctors } from '@/services/doctor/doctor.service';
import { Card, Table, Input, Layout } from 'antd';
import { useState, useMemo } from 'react';
import { doctorColumns } from '@/components/feature/UserList/userColumns';
import CreateDoctorModal from './CreateDoctorModal';
import CustomHeader from '@/components/common/CustomHeader';

const DoctorList = () => {
  const { data, isLoading } = useGetDoctors();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = useMemo(() => {
    if (!data) return [];
    const query = searchTerm.toLowerCase();
    return data.filter((item) => {
      return (
        `${item.firstname} ${item.lastname}`.toLowerCase().includes(query) ||
        item.firstname?.toLowerCase().includes(query) ||
        item.lastname?.toLowerCase().includes(query) ||
        item.email?.toLowerCase().includes(query) ||
        item.phone?.toLowerCase().includes(query) ||
        item.username?.toLowerCase().includes(query) ||
        item.hospital?.toLowerCase().includes(query) ||
        item.doctor_registration_id?.toLowerCase().includes(query)
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
          <div className='flex w-full items-center justify-between gap-x-4 pb-4'>
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
            columns={doctorColumns}
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
