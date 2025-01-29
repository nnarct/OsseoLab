import Unauthorized from '@/pages/Unauthorized/Unauthorized';
// import TechnicianPage from "./pages/TechnicianPage";
// import DoctorPage from "./pages/DoctorPage";
// import AdminPage from "./pages/AdminPage";
// import ProtectedRoute from "./components/ProtectedRoute";

// Route Configuration
export const routes = [
  {
    path: '/unauthorized',
    element: <Unauthorized />,
    protected: false,
    allowedRoles: [],
  },
  // { path: "/technician", element: <TechnicianPage />, protected: true, allowedRoles: [UserRole.Technician, UserRole.Admin] },
  // { path: "/doctor", element: <DoctorPage />, protected: true, allowedRoles: [UserRole.Doctor, UserRole.Admin] },
  // { path: "/admin", element: <AdminPage />, protected: true, allowedRoles: [UserRole.Admin] },
];
