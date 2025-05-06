import axios from '@/config/axiosConfig';

export const getTechniciansByCaseId = async (caseId: string) => {
  try {
    const response = await axios.get(`/case-technician/case/${caseId}`);
    return response.data.data || [];
  } catch (error) {
    console.error('Failed to fetch additional technicians:', error);
    throw error;
  }
};

