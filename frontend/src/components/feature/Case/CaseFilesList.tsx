import { useNavigate } from 'react-router-dom';
import { axios } from '@/config/axiosConfig';
import dayjs from 'dayjs';
import { useState } from 'react';
import { GrUpload } from 'react-icons/gr';
import { TiUploadOutline } from 'react-icons/ti';
import { deleteCaseFileById, uploadCaseFile } from '@/api/case-file.api';
import { FaRegTrashAlt } from 'react-icons/fa';
import queryClient from '@/config/queryClient';
import EditFilenameModal from './EditFilenameModal';
import { MdOutlineViewInAr } from 'react-icons/md';
import {
  Form,
  Button,
  Modal,
  Table,
  type TableProps,
  Typography,
  message,
  Input,
  Upload,
  Switch,
  Popconfirm,
  Checkbox,
} from 'antd';
import { useCaseFilesByCaseId } from '@/services/case/case-files.service';
import { CaseFileById } from '@/api/files.api';

const CaseFilesList = ({ caseId, readOnly }: { caseId: string; readOnly?: boolean }) => {
  const { data: filesData } = useCaseFilesByCaseId(caseId);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const [file, setFile] = useState<File | null>(null);
  const toggleActive = async (id: string) => {
    try {
      await axios.patch(`/case-file/${id}/toggle-active`);
      const updatedFile = filesData?.find((f) => f.case_file_id === id);
      const newStatus = updatedFile?.active ? 'deactivated' : 'activated';
      messageApi.success(`File ${newStatus}`);
      invalidateQueries(caseId);
    } catch (error) {
      console.error(error);
      messageApi.error('Failed to update status');
    }
  };

  const columns: TableProps<CaseFileById>['columns'] = [
    {
      title: 'No.',
      key: 'order',
      dataIndex: 'order',
      className: 'whitespace-nowrap',
      width: '0',
      align: 'center',
      sorter: (a, b) => a.order - b.order,
      sortDirections: ['descend'],
      showSorterTooltip: false,
    },
    {
      title: 'Model Name',
      key: 'nickname',
      dataIndex: 'nickname',
      sorter: (a, b) => a.nickname.localeCompare(b.nickname),
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
      sorter: (a, b) => a.filename.localeCompare(b.filename),
    },
    {
      title: <div className='whitespace-nowrap'>Size (MB)</div>,
      key: 'size_mb',
      dataIndex: 'filesize',
      render: (size) => `${(size / (1024 * 1024)).toFixed(2)} MB`,
      align: 'center',
      sorter: (a, b) => a.filesize - b.filesize,
    },
    {
      title: 'Pre-surgical',
      key: 'pre',
      dataIndex: 'pre',
      align: 'center',
      render: (pre: boolean, record) => (
        <Checkbox
          checked={pre}
          onChange={async (e) => {
            try {
              await axios.patch(`/surgery_display/case-file/${record.case_file_id}/tag`, {
                pre: e.target.checked,
              });
              messageApi.success(`Marked as ${e.target.checked ? 'Pre-surgical' : 'Not Pre-surgical'}`);
              invalidateQueries(caseId);
            } catch {
              messageApi.error('Failed to update Pre-surgical tag');
            }
          }}
        />
      ),
    },
    {
      title: 'Post-surgical',
      key: 'post',
      dataIndex: 'post',
      align: 'center',
      render: (post: boolean, record) => (
        <Checkbox
          checked={post}
          onChange={async (e) => {
            try {
              await axios.patch(`/surgery_display/case-file/${record.case_file_id}/tag`, {
                post: e.target.checked,
              });
              messageApi.success(`Marked ${record.nickname} as ${e.target.checked ? 'Post-surgical' : 'Not Post-surgical'}`);
              invalidateQueries(caseId);
            } catch {
              messageApi.error('Failed to update Post-surgical tag');
            }
          }}
        />
      ),
    },
    {
      title: 'Active',
      key: 'active',
      dataIndex: 'active',
      align: 'center',
      render: (active: boolean, record) => (
        <Switch checked={active} onChange={() => toggleActive(record.case_file_id)} />
      ),
      sorter: (a, b) => Number(a.active) - Number(b.active),
    },
    {
      title: 'Created At',
      key: 'created_at',
      dataIndex: 'created_at',
      render: (value) => dayjs.unix(value).format('DD-MM-YYYY HH:mm:ss'),
      sorter: (a, b) => a.created_at - b.created_at,
    },
  ];

  if (!readOnly) {
    columns.push({
      width: '0',
      align: 'center',
      title: 'Delete',
      dataIndex: 'case_file_id',
      key: 'delete',
      render: (id: string) => (
        <Popconfirm
          placement='topRight'
          title='Are you sure to delete this file?'
          onConfirm={async () => {
            await deleteCaseFileById(id);
            invalidateQueries(caseId);
            messageApi.success('File deleted successfully!');
          }}
          okText='Yes'
          cancelText='No'
        >
          <Button type='text' danger icon={<FaRegTrashAlt />} />
        </Popconfirm>
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
      form.resetFields();
      queryClient.invalidateQueries({ queryKey: ['case', caseId] });
      queryClient.invalidateQueries({ queryKey: ['case-file-versions'] });
      queryClient.invalidateQueries({ queryKey: ['caseFilesByCaseId', caseId] });
      queryClient.invalidateQueries({ queryKey: ['caseModelByCaseId', caseId] });
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
        <div className='flex gap-x-2'>
          <Button
            icon={<MdOutlineViewInAr />}
            onClick={() => {
              navigate(`/case/${caseId}/file`);
            }}
          >
            3D Viewer
          </Button>
          <Button icon={<GrUpload />} onClick={openModal} type='primary'>
            Upload File
          </Button>
        </div>
      </div>
      <Table columns={columns} dataSource={filesData} rowKey='id' size='small' bordered scroll={{ x: 'auto' }} />
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

const invalidateQueries = (caseId: string) => {
  queryClient.invalidateQueries({ queryKey: ['case', caseId] });
  queryClient.invalidateQueries({ queryKey: ['case-file-versions'] });
  queryClient.invalidateQueries({ queryKey: ['caseFilesByCaseId', caseId] });
  queryClient.invalidateQueries({ queryKey: ['caseModelByCaseId', caseId] });
};
