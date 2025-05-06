import { Button, Card, Table, message, Switch, Input } from 'antd';
import { useState } from 'react';
import axios from '@/config/axiosConfig';
import queryClient from '@/config/queryClient';
import { IoPersonAddOutline } from 'react-icons/io5';
import { FaRegTrashAlt } from 'react-icons/fa';
import TechnicalSelectModal from './TechnicalSelectModal';
import { useTechniciansByCaseId } from '@/services/case/case-technician.service';

const EngineerList = ({ caseId }: { caseId: string }) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [selectedEngineer, setSelectedEngineer] = useState<string>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const { data: engineers } = useTechniciansByCaseId(caseId);

  const filteredEngineers = (engineers || []).filter((s) =>
    `${s.firstname} ${s.lastname}`.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleSubmit = async () => {
    if (!selectedEngineer) {
      messageApi.warning('Please select an engineer');
      return;
    }
    try {
      await axios.post('/case-technician/add', { case_id: caseId, technician_id: selectedEngineer });
      messageApi.success('Engineer added successfully');
      setSelectedEngineer(undefined);
      setIsModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ['technicians-by-case', caseId] });
    } catch (error) {
      messageApi.error('Failed to add engineer');
      console.error(error);
    }
  };

  const handleDelete = async (pair_id: string) => {
    try {
      await axios.delete(`/case-technician/${pair_id}`);
      messageApi.success('Engineer removed');
      queryClient.invalidateQueries({ queryKey: ['technicians-by-case', caseId] });
    } catch (error) {
      console.log({ error });
      messageApi.error('Failed to delete engineer');
    }
  };

  const handleActive = async (pair_id: string) => {
    try {
      await axios.patch(`/case-technician/${pair_id}/toggle-active`);
      messageApi.success('Status updated');
      queryClient.invalidateQueries({ queryKey: ['technicians-by-case', caseId] });
    } catch (error) {
      console.log({ error });
      messageApi.error('Failed to update status');
    }
  };

  return (
    <>
      {contextHolder}
      <Card title='Permitted Engineers'>
        <div className='flex items-center justify-between gap-x-4 pb-4'>
          <Input.Search
            className='max-w-xs'
            placeholder='Search engineer'
            allowClear
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Button onClick={() => setIsModalOpen(true)} icon={<IoPersonAddOutline />}>
            Add Engineer
          </Button>
        </div>
        <TechnicalSelectModal
          open={isModalOpen}
          onOk={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
          technician={engineers}
          selectedTechnician={selectedEngineer}
          setSelectedTechnician={setSelectedEngineer}
        />
        <Table
          rowKey='pair_id'
          dataSource={filteredEngineers}
          columns={[
            {
              title: 'Engineer',
              key: 'name',
              render: (_, record) => `${record.firstname} ${record.lastname}`,
            },
            {
              width: '0',
              minWidth: 100,
              align: 'center',
              title: 'Active',
              dataIndex: 'active',
              key: 'active',
              render: (active, record) => <Switch checked={active} onChange={() => handleActive(record.pair_id)} />,
            },
            {
              width: '0',
              minWidth: 100,
              align: 'center',
              title: 'Action',
              key: 'action',
              render: (_, record) => (
                <Button icon={<FaRegTrashAlt />} danger onClick={() => handleDelete(record.pair_id)} />
              ),
            },
          ]}
        />
      </Card>
    </>
  );
};

export default EngineerList;
