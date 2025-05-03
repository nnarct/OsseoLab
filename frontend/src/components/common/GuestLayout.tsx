import { Layout, Menu } from 'antd';
import { useEffect, useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';

const GuestLayout = () => {
  const location = useLocation();

  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);

  const menuItems = [
    {
      key: '/upload',
      label: <Link to='/upload'>Quick Case</Link>,
    },
    {
      key: '/login',
      label: <Link to='/login'>Login</Link>,
    },
    {
      key: '/register',
      label: <Link to='/register'>Register</Link>,
    },
  ];

  useEffect(() => {
    setSelectedKeys([location.pathname]); // Updates the selected key when route changes
  }, [location.pathname]);

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Layout.Header style={{ background: '#ffffff' }}>
        <Menu mode='horizontal' theme='light' selectable={false} items={menuItems} selectedKeys={selectedKeys} />
      </Layout.Header>
      <Layout.Content className='bg-primary flex items-center justify-center p-4'>
        <Outlet />
      </Layout.Content>
    </Layout>
  );
};

export default GuestLayout;
