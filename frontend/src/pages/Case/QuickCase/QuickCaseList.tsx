import { Card, Layout, Table, Input, Button, Popconfirm, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useGetQuickCaseList } from '@/services/case/case.service';
import { QuickCase } from '@/types/case';
import CustomHeader from '@/components/common/CustomHeader';
import { useState, useMemo } from 'react';
import { PRODUCTS } from '@/constants/option';
import { deleteQuickCaseById } from '@/api/case.api';
import { FaRegTrashAlt } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import queryClient from '@/config/queryClient';

const QuickCaseList = () => {
  const { data = [], isLoading } = useGetQuickCaseList();
  const [searchText, setSearchText] = useState('');
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const fullName = `${item.firstname} ${item.lastname}`.toLowerCase();
      return (
        fullName.includes(searchText.toLowerCase()) ||
        item.email.toLowerCase().includes(searchText.toLowerCase()) ||
        item.product.toLowerCase().includes(searchText.toLowerCase()) ||
        item.anatomy.toLowerCase().includes(searchText.toLowerCase())
      );
    });
  }, [data, searchText]);

  const handleDelete = async (id: string) => {
    try {
      await deleteQuickCaseById(id);
      message.success('Quick case deleted');
      queryClient.invalidateQueries({ queryKey: ['quick-cases'] });
    } catch (error) {
      console.error(error);
      message.error('Failed to delete quick case');
    }
  };

  const columns: ColumnsType<QuickCase> = [
    {
      title: 'Submitted At',
      dataIndex: 'created_at',
      sorter: (a, b) => a.created_at - b.created_at,
      render: (value) => new Date(value * 1000).toLocaleString(),
    },
    {
      title: 'Full Name',
      dataIndex: 'firstname',
      sorter: (a, b) => `${a.firstname} ${a.lastname}`.localeCompare(`${b.firstname} ${b.lastname}`),
      render: (_, record) => `${record.firstname} ${record.lastname}`,
    },
    {
      title: 'Email Address',
      dataIndex: 'email',
      sorter: (a, b) => a.email.localeCompare(b.email),
    },
    {
      title: 'Phone Number',
      dataIndex: 'phone',
      sorter: (a, b) => a.phone.localeCompare(b.phone),
    },
    {
      title: 'Product',
      dataIndex: 'product',
      sorter: (a, b) => a.product.localeCompare(b.product),
      filters: PRODUCTS.map((p) => ({ text: p.label, value: p.value })),
      onFilter: (value, record) => record.product === value,
    },
    {
      title: 'Anatomical Region',
      dataIndex: 'anatomy',
      sorter: (a, b) => a.anatomy.localeCompare(b.anatomy),
    },
    {
      title: 'Planned Surgery Date',
      dataIndex: 'surgery_date',
      sorter: (a, b) => a.surgery_date - b.surgery_date,
      render: (value) => new Date(value * 1000).toLocaleDateString(),
    },
    {
      title: 'Actions',
      dataIndex: 'id',
      width: '0',
      align: 'center',
      render: (id) => (
        <Button>
          <Link to={`/case/quick-case/${id}`} type='primary'>
            View
          </Link>
        </Button>
      ),
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      width: '0',
      align: 'center',
      render: (_, record) => (
        <Popconfirm
          title='Are you sure to delete this case?'
          onConfirm={() => handleDelete(record.id)}
          okText='Yes'
          cancelText='No'
        >
          <Button type='text' icon={<FaRegTrashAlt />} danger />
        </Popconfirm>
      ),
    },
  ];

  return (
    <>
      <CustomHeader>
        <p className='text-2xl font-bold'>Quick Cases</p>
      </CustomHeader>
      <Layout.Content className='p-4'>
        <Card title='Requested case list'>
          <Input.Search
            className='max-w-sm'
            placeholder='Search by name, email, product, anatomy...'
            onChange={(e) => setSearchText(e.target.value)}
            style={{ marginBottom: 16 }}
          />
          <Table
            columns={columns}
            dataSource={filteredData}
            loading={isLoading}
            rowKey='id'
            scroll={{ x: 'max-content' }}
          />
        </Card>
      </Layout.Content>
    </>
  );
};

export default QuickCaseList;
