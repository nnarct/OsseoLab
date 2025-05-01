import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Spin } from 'antd';
import { QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/context/AuthContext';

import AppLayout from '@/components/common/Layout';
import ProtectedRoute from '@/components/common/ProtectedRoute';
import routesConfig from '@/config/routesConfig';

import LoginPage from '@/pages/AuthPage/LoginPage';
import RegisterPage from '@/pages/AuthPage/RegisterPage';
import Homepage from '@/pages/Homepage/Homepage';
import { queryClient } from '@/config/queryClient';
import { UserRole } from '@/types/user';

const DoctorList = lazy(() => import('@/components/feature/UserList/DoctorList'));
const AdminList = lazy(() => import('@/components/feature/UserList/AdminList'));
const UserList = lazy(() => import('@/components/feature/UserList/UserList'));
const TechnicianList = lazy(() => import('@/components/feature/UserList/TechnicianList'));
const Case = lazy(() => import('@/pages/StlList/Case'));
const ProfilePage = lazy(() => import('@/pages/AuthPage/ProfilePage'));

const createRoleRoute = (path: string, roles: string[], element: JSX.Element) => (
  <Route path={path} element={<ProtectedRoute requiredRole={roles} />}>
    <Route index element={element} />
  </Route>
);
const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <Suspense fallback={<Spin size='large' style={{ display: 'block', margin: '20px auto' }} />}>
            <Routes>
              {/* Public Routes */}
              <Route path='/login' element={<LoginPage />} />
              <Route path='/register' element={<RegisterPage />} />
              <Route path='/' element={<AppLayout />}>
                <Route path='*' element={<Navigate to={'/'} />} />
                <Route index element={<Homepage />} />
                {createRoleRoute('/user/list', [UserRole.Admin], <UserList />)}
                {createRoleRoute('/admin/list', [UserRole.Admin], <AdminList />)}
                {createRoleRoute('/technician/list', [UserRole.Admin], <TechnicianList />)}
                {createRoleRoute('/doctor/list', [UserRole.Admin], <DoctorList />)}
                {createRoleRoute('/case', [UserRole.Admin, UserRole.Technician, UserRole.Doctor], <Case />)}
                {createRoleRoute('/profile', [UserRole.Admin, UserRole.Technician, UserRole.Doctor], <ProfilePage />)}
              </Route>
              {/* </Route> */}
            </Routes>
          </Suspense>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
