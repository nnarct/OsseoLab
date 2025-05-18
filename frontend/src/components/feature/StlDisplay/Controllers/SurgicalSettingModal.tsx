import { useEffect, useState } from 'react';
import { Modal, Table, Checkbox, TableProps, message } from 'antd';
import { axios } from '@/config/axiosConfig';
import queryClient from '@/config/queryClient';

type Props = {
  caseId: string;
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
};

type CaseFile = {
  id: string;
  name: string;
  pre: boolean;
  post: boolean;
};

const SurgicalSettingModal = ({ caseId, isOpen, closeModal }: Props) => {
  const [caseFiles, setCaseFiles] = useState<CaseFile[]>([]);
  const [updatedFiles, setUpdatedFiles] = useState<Record<string, { pre: boolean; post: boolean }>>({});
  const [messageApi, contextHolder] = message.useMessage();
  useEffect(() => {
    if (caseId && isOpen) {
      axios
        .get(`/case-files/${caseId}/active`)
        .then((res) => setCaseFiles(res.data))
        .catch((err) => console.error('Failed to fetch case files:', err));
    }
  }, [caseId, isOpen]);

  const handleCheckboxChange = (id: string, field: 'pre' | 'post', checked: boolean) => {
    setUpdatedFiles((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: checked,
      },
    }));
  };

  const handleSave = async () => {
    try {
      await axios.patch('/case-files/update-pre-post', updatedFiles);
      messageApi.success('Saved successfully');
      queryClient.invalidateQueries({ queryKey: ['caseFileByCaseId', caseId] });
      closeModal();
    } catch (err) {
      console.error('Failed to update case files:', err);
      messageApi.error('Failed to save. Please try again.');
    }
  };

  const columns: TableProps<CaseFile>['columns'] = [
    {
      title: 'Object',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Pre',
      dataIndex: 'pre',
      key: 'pre',
      align: 'center',
      width: '56px',
      render: (_: boolean, record: CaseFile) => (
        <Checkbox
          checked={updatedFiles[record.id]?.pre ?? record.pre}
          onChange={(e) => handleCheckboxChange(record.id, 'pre', e.target.checked)}
        />
      ),
    },
    {
      title: 'Post',
      dataIndex: 'post',
      key: 'post',
      align: 'center',
      width: '56px',
      render: (_: boolean, record: CaseFile) => (
        <Checkbox
          checked={updatedFiles[record.id]?.post ?? record.post}
          onChange={(e) => handleCheckboxChange(record.id, 'post', e.target.checked)}
        />
      ),
    },
  ];

  return (
    <>
      {contextHolder}
      <Modal
        open={isOpen}
        onClose={closeModal}
        onCancel={closeModal}
        onOk={handleSave}
        okText='Save'
        centered
        title='Define Pre surgical and post surgical'
      >
        <Table size='small' bordered dataSource={caseFiles} columns={columns} rowKey='id' pagination={false} />
      </Modal>
    </>
  );
};

export default SurgicalSettingModal;
