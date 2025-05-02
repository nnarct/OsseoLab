import axios from '@/config/axiosConfig';

export const getSurgeonsByCaseId = async (caseId: string) => {
  try {
    const response = await axios.get(`/case-surgeon/case/${caseId}`);
    return response.data.data || [];
  } catch (error) {
    console.error('Failed to fetch additional surgeons:', error);
    throw error;
  }
};

