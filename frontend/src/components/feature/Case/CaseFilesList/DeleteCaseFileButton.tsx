import { Button, Popconfirm, message } from 'antd';
import { FaRegTrashAlt } from 'react-icons/fa';
import { deleteCaseFileById } from '@/api/case-file.api';
import { invalidateCaseQueries } from './invalidateCaseQueries';

type DeleteCaseFileButtonProps = {
  caseFileId: string;
  caseId: string;
};

const DeleteCaseFileButton = ({ caseFileId, caseId }: DeleteCaseFileButtonProps) => {
  const [messageApi, contextHolder] = message.useMessage();

  const handleDelete = async () => {
    try {
      await deleteCaseFileById(caseFileId);
      invalidateCaseQueries(caseId);
      messageApi.success('File deleted successfully!');
    } catch {
      messageApi.error('Failed to delete file');
    }
  };

  return (
    <>
      {contextHolder}
      <Popconfirm
        placement='topRight'
        title='Are you sure to delete this file?'
        onConfirm={handleDelete}
        okText='Yes'
        cancelText='No'
      >
        <Button type='text' danger icon={<FaRegTrashAlt />} />
      </Popconfirm>
    </>
  );
};

export default DeleteCaseFileButton;
