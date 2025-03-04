// import { Outlet, useNavigate } from 'react-router-dom';
// import { Layout as AntdLayout, Avatar, Button, Image, Space, Typography } from 'antd';
// import { HOMEPAGE_PATH } from '@/constants/path';
// import { useAuth } from '@/hooks/useAuth';
// import LOGO_IMG from '@/assets/OsseoLabsLogo.svg';
// import { OrbitControls } from '@react-three/drei';
// import { Canvas } from '@react-three/fiber';
// import { Suspense } from 'react';
// import { Model } from './Model';
// // import Sidebar from '@/components/Sidebar';
// // import Header from '@/components/Header';

// const { Content, Header } = AntdLayout;

// const Layout = ({ children }: { children?: React.ReactNode }) => {
//   const navigate = useNavigate();
//   const { logout, user } = useAuth();
//   const onLogout = () => {
//     logout();
//   };
//   return (
//     <AntdLayout className='!min-h-screen'>
//       <Header className='flex items-center justify-between !bg-white'>
//         <Image preview={false} onClick={() => navigate(HOMEPAGE_PATH)} height={20} src={LOGO_IMG} />
//         <Space>
//           <Avatar className='!bg-primary align-middle' size='large'>
//             {user?.username[0].toUpperCase()}
//           </Avatar>
//           <Typography.Text ellipsis>{user?.username}</Typography.Text>
//           <Typography.Text ellipsis type='secondary'>
//             ( {user?.role} )
//           </Typography.Text>
//           <Button onClick={onLogout}>Logout</Button>
//         </Space>
//       </Header>
//       <Canvas camera={{ position: [0, 10, 100] }}>
//         <Suspense fallback={null}>
//           <Model url={'./../assets/test.stl'} />
//         </Suspense>
//         <OrbitControls />
//       </Canvas>
//       <Content className='p-6'>{children ? children : <Outlet />}</Content>
//     </AntdLayout>
//   );
// };

// export default Layout;
