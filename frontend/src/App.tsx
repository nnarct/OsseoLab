import { Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Spin } from 'antd';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '@/context/AuthContext';

import AppLayout from '@/components/common/Layout';
import ProtectedRoute from '@/components/common/ProtectedRoute';
import routesConfig from '@/config/routesConfig';

import LoginPage from '@/pages/AuthPage/LoginPage';
import RegisterPage from '@/pages/AuthPage/RegisterPage';
import Homepage from '@/pages/Homepage/Homepage';
const queryClient = new QueryClient();

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
                {/* Protected Routes */}
                <Route element={<ProtectedRoute />}>
                  <Route path='/' element={<AppLayout />}>
                    <Route path='*' element={<Navigate to={'/'} />} />
                    <Route index element={<Homepage />} />
                    {routesConfig.map(({ id, path, element, requiredRole }) =>
                      requiredRole ? (
                        <Route key={id} path={path} element={<ProtectedRoute requiredRole={requiredRole} />}>
                          <Route index element={element} />
                        </Route>
                      ) : (
                        <Route key={id} path={path} element={element} />
                      )
                    )}
                  </Route>
                </Route>
              </Routes>
            </Suspense>
          </Router>
        
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;