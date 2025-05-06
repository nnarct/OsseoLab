import { Button, Modal, Input, message } from 'antd';
import { useState } from 'react';
import { renameCaseFile } from '@/api/case-file.api';
import { BiSolidEdit } from 'react-icons/bi';
import queryClient from '@/config/queryClient';

interface EditFilenameModalProps {
  initialFilename: string;
  id: string;
  caseId: string;
  disabled? : boolean
}

const EditFilenameModal = ({ initialFilename, id, caseId, disabled }: EditFilenameModalProps) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [filename, setFilename] = useState(initialFilename);
  const [messageApi, contextHolder] = message.useMessage();
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const onSubmit = async () => {
    try {
      await renameCaseFile(id, filename);
      messageApi.success('Filename updated');
      queryClient.invalidateQueries({ queryKey: ['case', caseId] });
      closeModal();
    } catch {
      messageApi.error('Failed to update filename');
    }
  };

  return (
    <>
      {contextHolder}
      <Button type='text' onClick={openModal} icon={<BiSolidEdit />} disabled={disabled}/>
      <Modal centered open={isOpen} title='Edit Filename' onCancel={closeModal} onOk={onSubmit} okText='Save'>
        <Input value={filename} onChange={(e) => setFilename(e.target.value)} placeholder='Enter new filename' />
      </Modal>
    </>
  );
};

export default EditFilenameModal;
