import { Outlet, useNavigate } from 'react-router-dom';
import { Layout as AntdLayout, Avatar, Button, Image, Space, Typography } from 'antd';
import { HOMEPAGE_PATH } from '@/constants/path';
import { useAuth } from '@/hooks/useAuth';
import LOGO_IMG from '@/assets/OsseoLabsLogo.svg';
// import Sidebar from '@/components/Sidebar';
// import Header from '@/components/Header';

const { Content, Header } = AntdLayout;

const Layout = ({ children }: { children?: React.ReactNode }) => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  const onLogout = () => {
    logout();
  };
  return (
    <AntdLayout className='!min-h-screen'>
      <Header className='flex items-center justify-between !bg-white'>
        <Image preview={false} onClick={() => navigate(HOMEPAGE_PATH)} height={20} src={LOGO_IMG} />
        <Space>
          <Avatar className='!bg-primary align-middle' size='large'>
            {user?.username[0].toUpperCase()}
          </Avatar>
          <Typography.Text>{user?.username}</Typography.Text>
          <Typography.Text type='secondary'>( {user?.role} )</Typography.Text>
          <Button onClick={onLogout}>Logout</Button>
        </Space>
      </Header>
      <Content className='p-6'>{children ? children : <Outlet />}</Content>
    </AntdLayout>
  );
};

export default Layout;
