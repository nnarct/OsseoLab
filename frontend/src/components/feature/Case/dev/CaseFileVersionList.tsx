import { axios } from '@/config/axiosConfig';
import { Table, TableProps } from 'antd';
import { useQuery } from '@tanstack/react-query';

const fetchCaseFileVersions = async (): Promise<D[]> => {
  const response = await axios.get('/case-file-versions');
  return response.data.data;
};

const CaseFileVersionList = () => {
  const { data = [], isLoading } = useCaseFileVerisons();

  if (isLoading) return <div>Loading...</div>;

  const columns: TableProps<D>['columns'] = [
    { dataIndex: 'case_file_id', title: 'Case File ID' },
    { dataIndex: 'file_path', title: 'File Path' },
    { dataIndex: 'id', title: 'ID' },
    { dataIndex: 'version_number', title: 'Version Number' },
  ];

  return (
    <div>
      <Table dataSource={data} columns={columns} rowKey={'id'} />
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

const useCaseFileVerisons = () => {
  return useQuery({
    queryKey: ['case-file-versions'],
    queryFn: fetchCaseFileVersions,
  });
};
