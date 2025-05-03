import { useState, useMemo } from 'react';
import { Card, Layout, Table, Input, type TableProps, Button, message, Modal } from 'antd';
import CustomHeader from '@/components/common/CustomHeader';
import { useNavigate } from 'react-router-dom';
import { MdFormatListBulletedAdd } from 'react-icons/md';
import { useGetCaseList } from '@/services/case/case.service';
import { CaseSummary } from '@/api/case.api';
import { FaRegTrashAlt } from 'react-icons/fa';
import { deleteCaseById } from '@/api/case.api';
import queryClient from '@/config/queryClient';

const CaseListPageDoctor = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [messageApi, msgContextHolder] = message.useMessage();
  const { data: cases, isLoading: loading } = useGetCaseList();

  const filteredCases = useMemo(() => {
    return (
      cases?.filter((item: CaseSummary) => {
        const q = searchTerm.toLowerCase();
        return (
          item.patient_name?.toLowerCase().includes(q) ||
          `${item.surgeon?.firstname} ${item.surgeon?.lastname}`.toLowerCase().includes(q)
        );
      }) || []
    );
  }, [cases, searchTerm]);

  if (!cases) return <div>Error Fetching Cases</div>;

  const columns: TableProps<CaseSummary>['columns'] = [
    {
      title: <div className='w-14'>Case ID</div>,
      dataIndex: 'case_number',
      key: 'case_number',
      align: 'center',
      sorter: (a, b) => a.case_number - b.case_number,
      render: (c: number) => `CASE${String(c).padStart(3, '0')}`,
      width: '0',
    },
    {
      title: <div className='w-19'>Case Code</div>,
      dataIndex: 'case_code',
      key: 'case_code',
      align: 'center',
      sorter: (a, b) => a.case_code?.localeCompare(b.case_code),
      render: (c) => c || '-',
      width: '0',
    },
    {
      title: 'Surgeon',
      dataIndex: ['surgeon'],
      key: 'surgeon',
      render: (s: CaseSummary['surgeon']) => `${s.firstname} ${s.lastname}`,
      sorter: (a, b) => {
        const aName = `${a.surgeon?.firstname || ''} ${a.surgeon?.lastname || ''}`.toLowerCase();
        const bName = `${b.surgeon?.firstname || ''} ${b.surgeon?.lastname || ''}`.toLowerCase();
        return aName.localeCompare(bName);
      },
      width: '40%',
    },
    {
      title: 'Patient Name',
      dataIndex: 'patient_name',
      key: 'patient_name',

      sorter: (a, b) => a.patient_name.localeCompare(b.patient_name),
      width: '40%',
    },
    // {
    //   title: 'Gender',
    //   dataIndex: 'patient_gender',
    //   key: 'patient_gender',
    //   render: (gender) => gender || '-',
    //   align: 'center',
    //   sorter: (a, b) => (a.patient_gender || '').localeCompare(b.patient_gender || ''),
    // },
    {
      title: <div className='whitespace-nowrap'>Surgery Date</div>,
      dataIndex: 'surgery_date',
      key: 'surgery_date',
      render: (v: number) => new Date(v * 1000).toLocaleDateString('en-GB'),
      sorter: (a, b) => a.surgery_date - b.surgery_date,
      width: '0',
    },
    // {
    //   title: 'Created At',
    //   dataIndex: 'created_at',
    //   key: 'created_at',
    //   render: (v: number) => new Date(v * 1000).toLocaleString(),
    //   sorter: (a, b) => a.created_at - b.created_at,
    // },
    // {
    //   title: 'Last Updated',
    //   dataIndex: 'last_updated',
    //   key: 'last_updated',
    //   render: (v: number) => new Date(v * 1000).toLocaleString(),
    //   sorter: (a, b) => a.last_updated - b.last_updated,
    // },
    {
      title: 'View',
      dataIndex: 'id',
      align: 'center',
      key: 'id',
      width: '0',
      render: (id: number) => (
        <Button type='primary' onClick={() => navigate(`/case/${id}`)}>
          View
        </Button>
      ),
    },
    {
      width: '0',
      align: 'center',
      title: 'Delete',
      dataIndex: 'id',
      key: 'id',
      render: (id) => (
        <Button
          danger
          icon={<FaRegTrashAlt />}
          onClick={() => {
            Modal.confirm({
              centered: true,
              title: 'Are you sure you want to delete this case?',
              content: 'This action will permanently delete the case and all associated files and surgeons.',
              okText: 'Delete',
              okType: 'danger',
              cancelText: 'Cancel',
              onOk: async () => {
                try {
                  await deleteCaseById(id);
                  messageApi.success('Case deleted');
                  queryClient.invalidateQueries({ queryKey: ['case-list'] });
                } catch {
                  messageApi.error('Failed to delete case');
                }
              },
            });
          }}
        />
      ),
    },
  ];

  return (
    <>
      {msgContextHolder}
      <CustomHeader>
        <h1 className='text-2xl font-bold'>Case List</h1>
      </CustomHeader>
      <Layout.Content className='p-4'>
        <Card>
          <div className='flex items-center justify-between gap-x-4 pb-4'>
            <Input.Search
              placeholder='Search cases'
              allowClear
              onChange={(e) => setSearchTerm(e.target.value)}
              className='max-w-sm'
            />
            <Button type='primary' onClick={() => navigate('/case/create')} icon={<MdFormatListBulletedAdd />}>
              Create Case
            </Button>
          </div>
          <Table
            bordered
            columns={columns}
            dataSource={filteredCases}
            rowKey='id'
            loading={loading}
            scroll={{ x: 'auto' }}
          />
        </Card>
      </Layout.Content>
    </>
  );
};

export default CaseListPageDoctor;
