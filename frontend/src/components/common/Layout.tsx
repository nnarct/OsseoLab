import { Layout, Image } from 'antd';
import { Outlet, useNavigate } from 'react-router-dom';
// import routesConfig from '@/config/routesConfig'; // Import the routes array

import { HOMEPAGE_PATH } from '@/constants/path';
import LOGO_IMG from '@/assets/OsseoLabsLogo.svg';

import SidebarMenu from '@/components/common/SidebarMenu';
import SidebarUserInfo from '@/components/common/SidebarUserInfo';

const { Content, Sider, Footer } = Layout;

const AppLayout = () => {
  const navigate = useNavigate();

  // 🔹 Convert `routesConfig` into Ant Design `Menu` items format
  // const menuItems = routesConfig.map((route) => ({
  //   key: route.path, // Menu item key (must match route)
  //   label: <Link to={route.path}>{route.name}</Link>, // Render link inside menu
  // }));
  const siderStyle: React.CSSProperties = {
    overflow: 'auto',
    height: '100vh',
    position: 'sticky',
    insetInlineStart: 0,
    top: 0,
    bottom: 0,
    // scrollbarWidth: 'thin',
    // scrollbarColor:'black',
    // scrollbar
    // scrollbarGutter: 'stable',
    background: 'white',
  };

  return (
    <Layout hasSider style={{ minHeight: '100vh' }}>
      {/* 🔹 Navigation Bar */}
      {/* <Header>
        <Menu
          theme='dark'
          mode='horizontal'
          selectedKeys={[location.pathname]} // Highlight the active menu item
          items={menuItems} // ✅ Use `items` prop instead of `Menu.Item`
        />
      </Header> */}
      {/* <div className='container mx-auto flex h-full items-center justify-between'> */}
      <Sider style={siderStyle}>
        <div className='flex h-full w-full flex-col'>
          <div className='flex justify-center py-3' style={{ borderBottom: '1px solid rgb(5,5,5,0.05)' }}>
            <Image
              preview={false}
              onClick={() => navigate(HOMEPAGE_PATH)}
              src={LOGO_IMG}
              height={48}
              className='px-4'
            />
          </div>
          <SidebarMenu />
          <SidebarUserInfo />
        </div>
      </Sider>
      <Layout>
        {/* 🔹 Page Content */}
        <Content className='p-8' style={{ flex: 1, overflow: 'initial' }}>
          <Outlet /> {/* 🚀 This renders the current route's component */}
        </Content>

        {/* 🔹 Footer */}
        <Footer style={{ textAlign: 'center' }}>STL Viewer ©{new Date().getFullYear()}</Footer>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
