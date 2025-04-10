import { useGetAdminDashboardData } from '@/services/admin/dashboard.service';
import { Button, Card, Flex, Space, Spin, Typography } from 'antd';
import { FiExternalLink } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

// Add this above the main component
const DashboardCard = ({
  title,
  count,
  link,
}: {
  title: string;
  count: number;
  link: string;
}) => {
  const navigate = useNavigate();
  return (
    <Card title={title}>
      <Flex justify="space-between" align="center">
        <Typography.Text>{count} accounts</Typography.Text>
        <Button type="link" icon={<FiExternalLink />} iconPosition="end" onClick={() => navigate(link)}>
          See
        </Button>
      </Flex>
    </Card>
  );
};

const DashboardPage = () => {
  const { data, isLoading } = useGetAdminDashboardData();
  if (isLoading) {
    return <Spin />;
  }
  return (
    <>
      <Typography.Title level={3}>Dashboard</Typography.Title>
      <div className="grid grid-cols-4 gap-4">
        <DashboardCard title="User" count={data.users.user} link="/user/list" />
        <DashboardCard title="Admin" count={data.users.admin} link="/admin/list" />
        <DashboardCard title="Technician" count={data.users.tech} link="/technician/list" />
        <DashboardCard title="Doctor" count={data.users.doctor} link="/doctor/list" />
      </div>
    </>
  );
};

export default DashboardPage;
