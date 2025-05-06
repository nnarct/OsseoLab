import { axios } from '@/config/axiosConfig';
import type { Technician, TechnicianSelectOption } from '@/types/technician';


export const getTechnicianSelectOptions = async (): Promise<TechnicianSelectOption[]> => {
  try {
    const response = await axios.get('/technician/select-options');
    return response.data.data || [];
  } catch (error) {
    console.error('Failed to fetch technician options:', error);
    return [];
  }
};

export const fetchTechnicians = async () :Promise<Technician[]> => {
  try {
    const { data } = await axios.get('/technician/list');
    return data.data;
  } catch (error) {
    console.error('Error fetching technicians:', error);
    throw error;
  }
};
