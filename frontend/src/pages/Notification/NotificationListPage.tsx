import { Card, Layout } from 'antd';
import { useAuth } from '@/hooks/useAuth';
import { UserRole } from '@/types/user';
import NotificationListAdmin from '@/components/feature/Notification/NotificationListAdmin';
import NotificationListTechnician from '@/components/feature/Notification/NotificationListTechnician';
import CustomHeader from '@/components/common/CustomHeader';

const NotificationListPage = () => {
  const { role } = useAuth();

  return (
    <>
      <CustomHeader>
        <p className='text-2xl font-bold'>Notifications</p>
      </CustomHeader>
      <Layout.Content title='Notifications' className='p-4'>
        <Card>
          {role === UserRole.Admin && <NotificationListAdmin />}
          {role === UserRole.Technician && <NotificationListTechnician />}
        </Card>
      </Layout.Content>
    </>
  );
};

export default NotificationListPage;
