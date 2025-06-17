import { useState, useEffect } from 'react';
import { Modal, Table, Checkbox, type TableProps, message } from 'antd';
import { axios } from '@/config/axiosConfig';
import { invalidateCaseQueries } from '../../Case/CaseFilesList/invalidateCaseQueries';
import { useStlModel } from '@/hooks/useStlModel';

type Props = {
  caseId: string;
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  onUpdate?: () => void;
};

const SurgicalSettingModal = ({ caseId, isOpen, closeModal }: Props) => {
  const [updatedMeshes, setUpdatedMeshes] = useState<Record<string, { pre: boolean; post: boolean }>>({});
  const [messageApi, contextHolder] = message.useMessage();
  const { meshes, setMeshes, currentSurgicalType } = useStlModel();
  useEffect(() => {
    if (isOpen) {
      const initial: Record<string, { pre: boolean; post: boolean }> = {};
      meshes.forEach((mesh) => {
        initial[mesh.id] = { pre: mesh.pre, post: mesh.post };
      });
      setUpdatedMeshes(initial);
    }
  }, [isOpen, meshes]);
  const handleCheckboxChange = (id: string, field: 'pre' | 'post', checked: boolean) => {
    setUpdatedMeshes((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [field]: checked,
      },
    }));
  };

  const handleSave = async () => {
    try {
      await axios.patch('/case-files/update-pre-post', updatedMeshes);
      messageApi.success('Saved successfully');
      invalidateCaseQueries(caseId);
      setMeshes((prev) =>
        prev.map((mesh) => {
          const update = updatedMeshes[mesh.id];
          const newPre = update?.pre ?? mesh.pre;
          const newPost = update?.post ?? mesh.post;
          const shouldBeVisible =
            (currentSurgicalType === 'pre' && newPre) || (currentSurgicalType === 'post' && newPost);
          return {
            ...mesh,
            pre: newPre,
            post: newPost,
            visible: shouldBeVisible,
          };
        })
      );
      closeModal();
    } catch (err) {
      console.error('Failed to update case files:', err);
      messageApi.error('Failed to save. Please try again.');
    }
  };

  const columns: TableProps['columns'] = [
    {
      title: `Object${meshes.length > 1 ? 's' : ''}`,
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Pre',
      dataIndex: 'pre',
      key: 'pre',
      align: 'center',
      width: '56px',
      render: (pre: boolean, record) => (
        <Checkbox
          checked={updatedMeshes[record.id]?.pre ?? false}
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
      render: (post: boolean, record) => (
        <Checkbox
          checked={updatedMeshes[record.id]?.post ?? false}
          onChange={(e) => handleCheckboxChange(record.id, 'post', e.target.checked)}
        />
      ),
    },
  ];

  if (caseId) {
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
          <Table
            size='small'
            bordered
            dataSource={meshes}
            columns={columns}
            rowKey='id'
            pagination={false}
            scroll={{ x: 'auto' }}
          />
        </Modal>
      </>
    );
  }
};

export default SurgicalSettingModal;
