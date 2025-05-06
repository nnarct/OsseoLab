import { fetchAdminDashboardData,fetchTechnicianDashboardData } from '@/api/dashboard.api';
import { ADMIN_DASHBOARD_QUERY_KEY,TECHNICIAN_DASHBOARD_QUERY_KEY } from '@/constants/queryKey';
import { useQuery } from '@tanstack/react-query';

export const useGetAdminDashboardData = () => {
  return useQuery({
    queryKey: [ADMIN_DASHBOARD_QUERY_KEY],
    queryFn: fetchAdminDashboardData,
  });
};
export const useGetTechnicianDashboardData = () => {
  return useQuery({
    queryKey: [TECHNICIAN_DASHBOARD_QUERY_KEY],
    queryFn: fetchTechnicianDashboardData,
  });
};
