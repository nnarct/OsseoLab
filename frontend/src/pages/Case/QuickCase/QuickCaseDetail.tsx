import CustomHeader from '@/components/common/CustomHeader';
import { Card, Layout, Descriptions, Button } from 'antd';
import { Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useGetQuickCaseById } from '@/services/case/case.service';
import { StlDisplayProvider } from '@/context/StlDisplayContext';
import Center from '@/components/feature/StlDisplay/Center';
import { useState } from 'react';

const QuickCaseDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { data, isLoading } = useGetQuickCaseById(id!);
  const files = (data?.files as QuickCaseFile[]) || [];

  const columns: ColumnsType<QuickCaseFile> = [
    {
      title: 'File Name',
      dataIndex: 'filename',
    },
    {
      title: 'File Type',
      dataIndex: 'filetype',
    },
    {
      title: 'Size (KB)',
      dataIndex: 'filesize',
      render: (value) => {
        if (!value) return '0 B';
        const i = Math.floor(Math.log(value) / Math.log(1024));
        const size = value / 1024 ** i;
        const unit = ['B', 'KB', 'MB', 'GB', 'TB'][i];
        return `${size.toFixed(2)} ${unit}`;
      },
    },
    {
      title: 'Uploaded At',
      dataIndex: 'uploaded_at',
      render: (value) => new Date(value * 1000).toLocaleString(),
    },
    {
      title: 'View',
      key: 'view',
      dataIndex: 'id',
      render: (_, record) => (
        <Link to={`/case/quick-case/${id}/${record.id}`} state={{ url: record.url, filename: record.filename }}>
          <Button>View</Button>
        </Link>
      ),
    },
  ];

  return (
    <>
      <CustomHeader>
        <p className='text-2xl font-bold'>Case submission</p>
      </CustomHeader>
      <Layout.Content className='p-4'>
        <Card>
          {isLoading ? (
            <p>Loading...</p>
          ) : data ? (
            <>
              <Descriptions
                title='Case Submission Information'
                bordered
                column={1}
                styles={{ label: { width: '200px' } }}
              >
                <Descriptions.Item label='Doctor Name'>{`${data.firstname} ${data.lastname}`}</Descriptions.Item>
                <Descriptions.Item label='Doctor Mobile Phone'>{data.phone}</Descriptions.Item>
                <Descriptions.Item label='Product'>{data.product}</Descriptions.Item>
                <Descriptions.Item label='Anatomy'>{data.anatomy}</Descriptions.Item>
                <Descriptions.Item label='Surgery Date'>
                  {new Date(data.surgery_date * 1000).toLocaleString()}
                </Descriptions.Item>
                <Descriptions.Item label='Submitted At'>
                  {new Date(data.created_at * 1000).toLocaleString()}
                </Descriptions.Item>
                <Descriptions.Item label='Country'>{data.country}</Descriptions.Item>
              </Descriptions>
              {files.length > 0 && (
                <Table
                  columns={columns}
                  dataSource={files}
                  rowKey='id'
                  pagination={false}
                  style={{ marginTop: '2rem' }}
                  bordered
                  title={() => `Submitted Files (${files.length})`}
                />
              )}
            </>
          ) : (
            <></>
          )}
        </Card>
      </Layout.Content>
    </>
  );
};

export default QuickCaseDetail;

export interface QuickCaseFile {
  filename: string;
  filepath: string;
  filesize: number;
  filetype: string;
  id: string;
  quick_case_id: string;
  url: string;
  uploaded_at: number;
}
