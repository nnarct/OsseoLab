import { fetchAdminDashboardData } from '@/api/dashboard.api';
import { ADMIN_DASHBOARD_QUERY_KEY } from '@/constants/queryKey';
import { useQuery } from '@tanstack/react-query';

export const useGetAdminDashboardData = () => {
  return useQuery({
    queryKey: [ADMIN_DASHBOARD_QUERY_KEY],
    queryFn: fetchAdminDashboardData,
  });
};
