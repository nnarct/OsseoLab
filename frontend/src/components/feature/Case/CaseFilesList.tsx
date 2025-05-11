import { Form, Button, Modal, Table, type TableProps, Typography, message, Input, Upload } from 'antd';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { useState } from 'react';
import { GrUpload } from 'react-icons/gr';
import { TiUploadOutline } from 'react-icons/ti';
import { deleteCaseFileById, uploadCaseFile } from '@/api/case-file.api';
import { FaRegTrashAlt } from 'react-icons/fa';
import queryClient from '@/config/queryClient';
import EditFilenameModal from './EditFilenameModal';
import { MdOutlineViewInAr } from 'react-icons/md';
import type { CaseFile } from '@/types/case';

const CaseFilesList = ({
  files,
  caseId,
  caseNumber,
  readOnly,
}: {
  files: CaseFile[];
  caseId: string;
  caseNumber: number;
  readOnly?: boolean;
}) => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const [file, setFile] = useState<File | null>(null);
  const columns: TableProps<CaseFile>['columns'] = [
    {
      width: '0',
      align: 'center',
      dataIndex: 'id',
      title: <div className='whitespace-nowrap'>3D viewer</div>,
      key: 'id',
      render: (_, record) => (
        <Button
          icon={<MdOutlineViewInAr />}
          onClick={() => {
            console.log({ urls: record.urls, caseNumber, filename: record.filename });
            navigate(`/case/${caseId}/file/${record.id}`, {
              state: { urls: record.urls, caseNumber, filename: record.filename },
            });
          }}
        >
          3D Viewer
        </Button>
      ),
    },
    {
      title: 'ID',
      key: 'id',
      dataIndex: 'id',
      className: 'whitespace-nowrap',
      width: '0',
    },
    {
      title: 'Model Name',
      key: 'nickname',
      dataIndex: 'nickname',
      render: (nickname, record) => (
        <>
          <EditFilenameModal version_id={record.version_id} initialFilename={nickname} caseId={caseId} />
          {nickname}
        </>
      ),
    },
    {
      title: 'Filename',
      key: 'filename',
      dataIndex: 'filename',
    },
    {
      title: 'Created At',
      key: 'created_at',
      dataIndex: 'created_at',
      render: (value) => dayjs.unix(value).format('YYYY-MM-DD HH:mm'),
    },
  ];

  if (!readOnly) {
    columns.push({
      width: '0',
      align: 'center',
      title: 'Delete',
      dataIndex: 'id',
      key: 'delete',
      render: (id: string) => (
        <Button
          type='text'
          danger
          icon={<FaRegTrashAlt />}
          onClick={async () => {
            await deleteCaseFileById(id);
            queryClient.invalidateQueries({ queryKey: ['case-file-versions'] });
            queryClient.invalidateQueries({ queryKey: ['case', caseId] });
          }}
        />
      ),
    });
  }

  const handleSubmit = async (values: { nickname: string }) => {
    const nickname = values.nickname;
    if (!nickname.trim()) {
      messageApi.error('Please enter a nickname for the file!');
      return;
    }
    if (!file) {
      messageApi.error('Please select an STL file!');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
    formData.append('nickname', nickname);
    formData.append('case_id', caseId);

    try {
      setLoading(true);
      const response = await uploadCaseFile(formData);

      messageApi.success(`File "${nickname}" uploaded successfully!`);
      console.log('Uploaded:', response);
      // queryClient.invalidateQueries({ queryKey: [STL_LIST_QUERY_KEY] });
      messageApi.success('uploaded');
      setFile(null);
      queryClient.invalidateQueries({ queryKey: ['case', caseId] });
      queryClient.invalidateQueries({ queryKey: ['case-file-versions'] });
    } catch (error) {
      messageApi.error('Upload failed!');
      console.error(error);
    } finally {
      closeModal();
      setLoading(false);
    }
  };

  return (
    <>
      {contextHolder}
      <div className='flex items-center justify-between gap-x-4 pb-4'>
        <Typography.Title level={5} style={{ margin: 0 }}>
          Files
        </Typography.Title>
        <Button icon={<GrUpload />} onClick={openModal} type='primary'>
          Upload File
        </Button>
      </div>
      <Table columns={columns} dataSource={files} rowKey='id' size='small' bordered scroll={{ x: 'auto' }} />
      <Modal centered footer={null} open={isOpen} destroyOnClose onCancel={closeModal} onClose={closeModal}>
        <Typography.Title level={3}>Add new STL file</Typography.Title>
        <Form form={form} onFinish={handleSubmit} requiredMark='optional' disabled={loading}>
          <Form.Item name='nickname' label='File name' rules={[{ required: true, message: 'Please enter file name.' }]}>
            <Input placeholder='Enter file name' />
          </Form.Item>
          <Form.Item label='Select STL File' name={'stl'} rules={[{ required: true, message: 'Please Upload file.' }]}>
            <Upload
              beforeUpload={(file) => {
                setFile(file);
                return false;
              }}
              maxCount={1}
              accept='.stl'
            >
              <Button icon={<TiUploadOutline />}>Upload STL File</Button>
            </Upload>
          </Form.Item>
          <div className='flex justify-center gap-6'>
            <Button onClick={closeModal}>Cancel</Button>
            <Button type='primary' htmlType='submit' loading={loading}>
              Submit
            </Button>
          </div>
        </Form>
      </Modal>
    </>
  );
};

export default CaseFilesList;
