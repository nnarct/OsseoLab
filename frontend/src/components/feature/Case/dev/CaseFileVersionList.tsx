import { Button, message, Popconfirm, Table, TableProps } from 'antd';
import { axios } from '@/config/axiosConfig';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import queryClient from '@/config/queryClient';
import EditFilenameModal from '../EditFilenameModal';

const fetchCaseFileVersions = async (id: string): Promise<D[]> => {
  const response = await axios.get(`/case-file-versions/${id}`);
  return response.data.data;
};

const CaseFileVersionList = () => {
  const { id } = useParams();
  const { data = [], isLoading } = useCaseFileVersions(id as string);
  const [messageApi, contextHolder] = message.useMessage();

  const reverseVersion = async (versionId: string) => {
    try {
      await axios.put(`/case-file-version/reverse/${versionId}`);
      messageApi.success('Reversed to selected version');
      queryClient.invalidateQueries({ queryKey: ['case-file-versions', id] });
      queryClient.invalidateQueries({ queryKey: ['case', id] });
    } catch (error) {
      console.error(error);
      messageApi.error('Failed to reverse version');
    }
  };

  if (isLoading) return <div>Loading...</div>;

  const columns: TableProps<D>['columns'] = [
    { dataIndex: 'id', title: 'Version ID' },
    { dataIndex: 'case_file_id', title: 'Case File ID' },
    { dataIndex: 'filename', title: 'File name' },
    {
      dataIndex: 'nickname',
      title: 'Model name',
      render: (nickname, record) => (
        <>
          <EditFilenameModal version_id={record.id} initialFilename={nickname} caseId={id as string} />
          {nickname}
        </>
      ),
    },
    { dataIndex: 'version_number', title: 'Version Number', align: 'center' },
    {
      title: 'Action',
      render: (_, record) => {
        const maxVersion = Math.max(...data.map((item) => item.version_number));
        const isCurrent = record.version_number === maxVersion;
        return isCurrent ? (
          '-'
        ) : (
          <Popconfirm title='Revert to this version?' onConfirm={() => reverseVersion(record.id)}>
            <Button type='link'>Revert</Button>
          </Popconfirm>
        );
      },
      align: 'center',
    },
  ];

  return (
    <div>
      {contextHolder}
      <Table
        dataSource={[...data].sort((a, b) => b.version_number - a.version_number)}
        columns={columns}
        rowKey={'id'}
      />
    </div>
  );
};

export default CaseFileVersionList;

interface D {
  case_file_id: string;
  file_path: string;
  id: string;
  uploaded_at: number;
  uploaded_by: string | null;
  version_number: number;
}

const useCaseFileVersions = (caseId: string) => {
  return useQuery({
    queryKey: ['case-file-versions', caseId],
    queryFn: () => fetchCaseFileVersions(caseId),
  });
};
