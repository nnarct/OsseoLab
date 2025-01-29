import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { routes } from '@/routes/routes.config';
import ProtectedRoute from '@/routes/ProtectedRoute';
import { useAuth } from '@/hooks/useAuth';
import { LOGIN_PATH, HOMEPAGE_PATH } from '@/constants/path';
import Layout from '@/components/Layout';
import LoginPage from '@/pages/LoginPage/LoginPage';
import Homepage from './pages/Homepage/Homepage';

const App = () => {
  const { user } = useAuth(); // ✅ Get user state
  console.log('app', user);
  return (
    <Router>
      <Routes>
        <Route path={LOGIN_PATH} element={user ? <Navigate to={HOMEPAGE_PATH} replace /> : <LoginPage />} />
      
          <Route
            path={HOMEPAGE_PATH}
            element={
              user ? (
                <Layout>
                  <Homepage />
                </Layout>
              ) : (
                <Navigate to={LOGIN_PATH} replace />
              )
            }
          />
 
        <Route element={<Layout />}>
          {routes.map(({ path, element, protected: isProtected, allowedRoles }) =>
            isProtected ? (
              <Route key={path} element={<ProtectedRoute allowedRoles={allowedRoles} />}>
                <Route path={path} element={element} />
              </Route>
            ) : (
              <Route key={path} path={path} element={element} />
            )
          )}
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
