import { Button, Modal, Input, message } from 'antd';
import { useState } from 'react';
import { renameCaseFileVersion } from '@/api/case-file.api';
import { BiSolidEdit } from 'react-icons/bi';
import queryClient from '@/config/queryClient';

interface EditFilenameModalProps {
  initialFilename: string;
  version_id: string;
  caseId: string;
  disabled?: boolean;
}

const EditFilenameModal = ({ initialFilename, version_id, caseId, disabled }: EditFilenameModalProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [filename, setFilename] = useState(initialFilename);
  const [messageApi, contextHolder] = message.useMessage();
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const onSubmit = async () => {
    try {
      await renameCaseFileVersion(version_id, filename);
      messageApi.success('Model name updated');
      queryClient.invalidateQueries({ queryKey: ['case', caseId] });

      queryClient.invalidateQueries({ queryKey: ['case-file-versions', caseId] });
      closeModal();
    } catch {
      messageApi.error('Failed to update filename');
    }
  };

  return (
    <>
      {contextHolder}
      <Button type='text' onClick={openModal} icon={<BiSolidEdit />} disabled={disabled} />
      <Modal
        centered
        open={isOpen}
        title='Edit File Display name (Model Name)'
        onCancel={closeModal}
        onOk={onSubmit}
        okText='Save'
      >
        <Input value={filename} onChange={(e) => setFilename(e.target.value)} placeholder='Enter new filename' />
      </Modal>
    </>
  );
};

export default EditFilenameModal;
