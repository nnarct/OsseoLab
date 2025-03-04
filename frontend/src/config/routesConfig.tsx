import { lazy } from 'react';
import { UserRole } from '@/types/user';
import StlList from '@/pages/StlList/StlList';

const DoctorList = lazy(() => import('@/components/feature/UserList/DoctorList'));
const AdminList = lazy(() => import('@/components/feature/UserList/AdminList'));
const UserList = lazy(() => import('@/components/feature/UserList/UserList'));
const TechnicianList = lazy(() => import('@/components/feature/UserList/TechnicianList'));

// { id: 'homepage', name: 'Homepage', path: '/', element: <Homepage /> },

const adminRoutes = [
  {
    id: 'user  list',
    name: 'User List',
    path: '/user/list',
    element: <UserList />,
    requiredRole: [UserRole.Admin],
  },
  {
    id: 'stl  list',
    name: 'Stl List',
    path: '/stl/list',
    element: <StlList />,
    requiredRole: [UserRole.Admin],
  },
  {
    id: 'admin  list',
    name: 'Admin List',
    path: '/admin/list',
    element: <AdminList />,
    requiredRole: [UserRole.Admin],
  },
  {
    id: 'technician list',
    name: 'Technician List',
    path: '/technician/list',
    element: <TechnicianList />,
    requiredRole: [UserRole.Admin],
  },

  {
    id: 'doctor list',
    name: 'Doctor List',
    path: '/doctor/list',
    element: <DoctorList />,
    requiredRole: [UserRole.Admin],
  },
];
const routesConfig = adminRoutes;
// {
//   id: 'admin',
//   name: 'Admin Dashboard',
//   path: '/admin',
//   element: <AdminHomepage />,
//   requiredRole: [UserRole.Admin],
// },
// {
//   id: 'admin-stl',
//   name: 'STL list',
//   path: '/stl/list',
//   element: <StlList />,
//   requiredRole: [UserRole.Admin],
// },
// {
//   id: 'tech',
//   name: 'Tech Dashboard',
//   path: '/tech',
//   element: <TechnicianHomepage />,
//   requiredRole: [UserRole.Technician],
// },
// {
//   id: 'doctor',
//   name: 'Doctor Dashboard',
//   path: '/doctor',
//   element: <DoctorHomepage />,
//   requiredRole: [UserRole.Doctor],
// },
// ];

// routesConfig['admin'] = adminRoutes;

export default routesConfig;

// interface Route {
//   id: string;
//   name: React.ReactNode;
//   path: string;
//   element: JSX.Element;
//   requiredRole?: UserRole[];
// }
