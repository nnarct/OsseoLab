import { Button, Card, Table, message, Switch, Input } from 'antd';
import { useState } from 'react';
import axios from '@/config/axiosConfig';
import { useSurgeonsByCaseId } from '@/services/case/case-surgeon.service';
import queryClient from '@/config/queryClient';
import { IoPersonAddOutline } from 'react-icons/io5';
import { FaRegTrashAlt } from 'react-icons/fa';
import SurgeonSelectModal from './SurgeonSelectModal';
const AdditionalSurgeon = ({ caseId }: { caseId: string }) => {
  const [messageApi, contextHolder] = message.useMessage();
  const [selectedSurgeon, setSelectedSurgeon] = useState<string>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchText, setSearchText] = useState('');
  const { data } = useSurgeonsByCaseId(caseId);
  const { surgeons, main_surgeon } = data ? data : {};
  const filteredSurgeons = (surgeons || []).filter((s) =>
    `${s.firstname} ${s.lastname}`.toLowerCase().includes(searchText.toLowerCase())
  );

  const handleSubmit = async () => {
    if (!selectedSurgeon) {
      messageApi.warning('Please select a surgeon');
      return;
    }
    try {
      await axios.post('/case-surgeon/add', { case_id: caseId, doctor_id: selectedSurgeon });
      messageApi.success('Surgeon added successfully');
      setSelectedSurgeon(undefined);
      setIsModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ['surgeons-by-case', caseId] });
    } catch (error) {
      messageApi.error('Failed to add surgeon');
      console.error(error);
    }
  };

  return (
    <>
      {contextHolder}
      <Card title='Additional Surgeons'>
        <div className='flex items-center justify-between gap-x-4 pb-4'>
          <Input.Search
            className='max-w-xs'
            placeholder='Search by surgeon'
            allowClear
            onChange={(e) => setSearchText(e.target.value)}
          />
          <Button onClick={() => setIsModalOpen(true)} icon={<IoPersonAddOutline />}>
            Add Surgeon
          </Button>
        </div>
        <SurgeonSelectModal
          open={isModalOpen}
          onOk={handleSubmit}
          onCancel={() => setIsModalOpen(false)}
          surgeons={surgeons}
          mainSurgeon={main_surgeon}
          selectedSurgeon={selectedSurgeon}
          setSelectedSurgeon={setSelectedSurgeon}
        />
        <Table
          rowKey='pair_id'
          dataSource={filteredSurgeons}
          columns={[
            {
              title: 'Surgeon',
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
              render: (active, record) => (
                <Switch
                  checked={active}
                  onChange={async () => {
                    try {
                      await axios.patch(`/case-surgeon/${record.pair_id}/toggle-active`);
                      messageApi.success('Status updated');
                      queryClient.invalidateQueries({ queryKey: ['surgeons-by-case', caseId] });
                    } catch (error) {
                      console.log({ error });
                      messageApi.error('Failed to update status');
                    }
                  }}
                />
              ),
            },
            {
              width: '0',
              minWidth: 100,
              align: 'center',
              title: 'Action',
              key: 'action',
              render: (_, record) => (
                <Button
                  icon={<FaRegTrashAlt />}
                  danger
                  onClick={async () => {
                    try {
                      await axios.delete(`/case-surgeon/${record.pair_id}`);
                      messageApi.success('Surgeon removed');
                      queryClient.invalidateQueries({ queryKey: ['surgeons-by-case', caseId] });
                    } catch (error) {
                      console.log({ error });
                      messageApi.error('Failed to delete surgeon');
                    }
                  }}
                />
              ),
            },
          ]}
        />
      </Card>
    </>
  );
};

export default AdditionalSurgeon;
