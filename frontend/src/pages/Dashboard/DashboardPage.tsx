import CustomHeader from '@/components/common/CustomHeader';
import { useGetAdminDashboardData } from '@/services/admin/dashboard.service';
import { Button, Card, Flex, Layout, Spin, Typography } from 'antd';
import { FiExternalLink } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

// Add this above the main component

const DashboardCard = ({ title, count, link }: { title: string; count: number; link: string }) => {
  const navigate = useNavigate();
  return (
    <Card title={title}>
      <Flex justify='space-between' align='center'>
        <Typography.Text>
          <span className='text-2xl font-bold'>{count}</span> accounts
        </Typography.Text>
        <Button type='link' icon={<FiExternalLink />} iconPosition='end' onClick={() => navigate(link)}>
          See
        </Button>
      </Flex>
    </Card>
  );
};

const DashboardPage = () => {
  const { data, isLoading, isError } = useGetAdminDashboardData();
  if (isLoading) {
    return <Spin />;
  }
  if (!data || isError) {
    return <div>Error loading data</div>;
  }

  return (
    <>
      <CustomHeader>
        <p className='text-2xl font-bold'>Dashboard</p>
      </CustomHeader>
      <Layout.Content className='p-4'>
        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-4'>
          <DashboardCard title='User' count={data.users.user} link='/user/list' />
          <DashboardCard title='Admin' count={data.users.admin} link='/admin/list' />
          <DashboardCard title='Technician' count={data.users.tech} link='/technician/list' />
          <DashboardCard title='Surgeon' count={data.users.doctor} link='/doctor/list' />
        </div>
      </Layout.Content>
    </>
  );
};

export default DashboardPage;
