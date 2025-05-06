import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Spin } from 'antd';
import { QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/context/AuthContext';

import AppLayout from '@/components/common/Layout';
import ProtectedRoute from '@/components/common/ProtectedRoute';

import LoginPage from '@/pages/AuthPage/LoginPage';
import RegisterPage from '@/pages/AuthPage/RegisterPage';
import Homepage from '@/pages/Homepage/Homepage';
import QuickCaseSubmitPage from './pages/Case/QuickCase/QuickCaseSubmitPage';
import GuestLayout from '@/components/common/GuestLayout';

import { queryClient } from '@/config/queryClient';
import { UserRole } from '@/types/user';

const ProfilePage = lazy(() => import('@/pages/AuthPage/ProfilePage'));
const DoctorList = lazy(() => import('@/components/feature/UserList/DoctorList'));
const AdminList = lazy(() => import('@/components/feature/UserList/AdminList'));
const UserList = lazy(() => import('@/components/feature/UserList/UserList'));
const TechnicianList = lazy(() => import('@/components/feature/UserList/TechnicianList'));
// const Case = lazy(() => import('@/pages/StlList/Case'));
const CaseDetailPage = lazy(() => import('@/pages/Case/CaseDetailPage/CaseDetailPage'));
const CaseList = lazy(() => import('@/pages/Case/CaseList'));
const CaseCreateForm = lazy(() => import('@/pages/Case/CaseCreateForm'));
const CaseModelViewer = lazy(() => import('@/pages/Case/CaseModelViewer'));

// quick case
const QuickCaseList = lazy(() => import('@/pages/Case/QuickCase/QuickCaseList'));
const QuickCaseDetail = lazy(() => import('@/pages/Case/QuickCase/QuickCaseDetail'));
const QuickCaseModelViewer = lazy(() => import('@/pages/Case/QuickCase/QuickCaseModelViewer'));

// notification
const NotificationListPage =  lazy(() => import('@/pages/Notification/NotificationListPage'));
const UserDetailPage = lazy(() => import('@/pages/AuthPage/UserDetailPage'));

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
              <Route element={<GuestLayout />}>
                <Route path='/login' element={<LoginPage />} />
                <Route path='/register' element={<RegisterPage />} />
                <Route path='/upload' element={<QuickCaseSubmitPage />} />
              </Route>
              <Route path='/' element={<AppLayout />}>
                <Route path='*' element={<Navigate to={'/'} />} />
                <Route index element={<Homepage />} />
                {createRoleRoute('/user/list', [UserRole.Admin], <UserList />)}
                {createRoleRoute('/admin/list', [UserRole.Admin], <AdminList />)}
                {createRoleRoute('/technician/list', [UserRole.Admin], <TechnicianList />)}
                {createRoleRoute('/doctor/list', [UserRole.Admin], <DoctorList />)}
                {createRoleRoute(
                  '/case/:id',
                  [UserRole.Admin, UserRole.Technician, UserRole.Doctor],
                  <CaseDetailPage />
                )}
                {createRoleRoute('/case/list', [UserRole.Admin, UserRole.Technician, UserRole.Doctor], <CaseList />)}
                {createRoleRoute('/case/list', [UserRole.Doctor], <CaseList />)}
                {createRoleRoute('/case/create', [UserRole.Admin, UserRole.Technician], <CaseCreateForm />)}
                {createRoleRoute(
                  '/case/:caseId/file/:id',
                  [UserRole.Admin, UserRole.Technician, UserRole.Doctor],
                  <CaseModelViewer />
                )}
                {createRoleRoute('/profile', [UserRole.Admin, UserRole.Technician, UserRole.Doctor], <ProfilePage />)}

                {createRoleRoute('/user/:id', [UserRole.Admin, UserRole.Technician], <UserDetailPage />)}

                {createRoleRoute('/case/quick-case', [UserRole.Admin], <QuickCaseList />)}
                {createRoleRoute('/case/quick-case/:id', [UserRole.Admin], <QuickCaseDetail />)}
                {createRoleRoute('/case/quick-case/:quickCaseId/:id', [UserRole.Admin], <QuickCaseModelViewer />)}
                
                {createRoleRoute('/notifications', [UserRole.Admin, UserRole.Technician], <NotificationListPage />)}
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
