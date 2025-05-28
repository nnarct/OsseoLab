import { Table, Typography, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { GrUpload } from 'react-icons/gr';
import { MdOutlineViewInAr } from 'react-icons/md';
import TagCheckbox from './TagCheckbox';
import ActiveToggleSwitch from './ActiveToggleSwitch';
import DeleteCaseFileButton from './DeleteCaseFileButton';
import EditFilenameModal from '../EditFilenameModal';
import type { TableProps } from 'antd';
import type { CaseFileById } from '@/api/files.api';

type CaseFilesTableProps = {
  caseId: string;
  filesData?: CaseFileById[];
  readOnly?: boolean;
  openModal: () => void;
};

const CaseFilesTable = ({ caseId, filesData, readOnly, openModal }: CaseFilesTableProps) => {
  const navigate = useNavigate();
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
        <EditFilenameModal version_id={record.version_id} initialFilename={nickname} caseId={caseId} />
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
      sorter: (a, b) => Number(a.pre) - Number(b.pre),
      render: (pre: boolean, record) => (
        <TagCheckbox
          nickname={record.nickname}
          checked={pre}
          caseFileId={record.case_file_id}
          field='pre'
          caseId={caseId}
        />
      ),
    },
    {
      title: 'Post-surgical',
      key: 'post',
      dataIndex: 'post',
      align: 'center',
      sorter: (a, b) => Number(a.post) - Number(b.post),
      render: (post: boolean, record) => (
        <TagCheckbox
          nickname={record.nickname}
          checked={post}
          caseFileId={record.case_file_id}
          field='post'
          caseId={caseId}
        />
      ),
    },
    {
      title: 'Active',
      key: 'active',
      dataIndex: 'active',
      align: 'center',
      render: (active: boolean, record) => (
        <ActiveToggleSwitch active={active} caseFileId={record.case_file_id} caseId={caseId} />
      ),
      sorter: (a, b) => Number(a.active) - Number(b.active),
    },
    {
      title: 'Created At',
      key: 'created_at',
      dataIndex: 'created_at',
      align: 'center',
      width: '0',
      className: 'whitespace-nowrap px-1',
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
      render: (case_file_id: string) => <DeleteCaseFileButton caseFileId={case_file_id} caseId={caseId} />,
    });
  }

  return (
    <>
      <div className='flex items-center justify-between gap-x-4 pb-4'>
        <Typography.Title level={5} style={{ margin: 0 }}>
          Files
        </Typography.Title>
        <div className='flex gap-x-2'>
          <Button icon={<MdOutlineViewInAr />} onClick={() => navigate(`/case/${caseId}/file`)}>
            3D Viewer
          </Button>
          <Button icon={<GrUpload />} onClick={openModal} type='primary'>
            Upload File
          </Button>
        </div>
      </div>
      <Table
        columns={columns}
        dataSource={filesData}
        rowKey='case_file_id'
        size='small'
        bordered
        scroll={{ x: 'auto' }}
      />
    </>
  );
};

export default CaseFilesTable;
