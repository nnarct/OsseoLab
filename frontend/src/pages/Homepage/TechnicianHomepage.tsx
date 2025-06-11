import CustomHeader from '@/components/common/CustomHeader';
import { useGetTechnicianDashboardData } from '@/services/admin/dashboard.service';
import { Button, Card, Flex, Layout, Typography } from 'antd';
import type { CardProps } from 'antd';
import { FiExternalLink } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

const TechnicianHomepage = () => {
  const { data, isLoading, isError } = useGetTechnicianDashboardData();

  if (!data || isError) {
    return <Card>Error loading data</Card>;
  }
  return (
    <>
      <CustomHeader>
        <p className='text-2xl font-bold'>Dashboard</p>
      </CustomHeader>
      <Layout.Content className='p-4'>
        <DashboardCard
          title='Assigned Cases'
          count={data.assigned_case_ids?.length || '0'}
          link='/case/list'
          isLoading={isLoading}
          className='max-w-sm'
        />
      </Layout.Content>
    </>
  );
};

export default TechnicianHomepage;

const DashboardCard = ({
  title,
  count,
  link,
  isLoading,
  ...cardProps
}: {
  title: string;
  count: number | string;
  link: string;
  isLoading?: boolean;
} & CardProps) => {
  const navigate = useNavigate();
  return (
    <Card title={title} loading={isLoading} {...cardProps}>
      <Flex justify='space-between' align='center'>
        <Typography.Text>
          <span className='text-2xl font-bold'>{count}</span>
        </Typography.Text>
        <Button type='link' icon={<FiExternalLink />} iconPosition='end' onClick={() => navigate(link)}>
          See
        </Button>
      </Flex>
    </Card>
  );
};
