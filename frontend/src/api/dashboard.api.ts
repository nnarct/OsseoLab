import { axios } from '@/config/axiosConfig';

export const fetchAdminDashboardData =  async () => {
  try {
    const response = await axios.get('/dashboard/admin');
    return response.data.data;
  } catch (error) {
    console.log({ error });
    throw error;
  }
};
