import { axios } from '@/config/axiosConfig';
import type { Doctor, DoctorSelectOption } from '@/types/doctor';


export const getDoctorSelectOptions = async (): Promise<DoctorSelectOption[]> => {
  try {
    const response = await axios.get('/doctor/select-options');
    return response.data.data || [];
  } catch (error) {
    console.error('Failed to fetch doctor options:', error);
    return [];
  }
};

export const fetchDoctors = async () :Promise<Doctor[]> => {
  try {
    const { data } = await axios.get('/doctor/list');
    return data.data;
  } catch (error) {
    console.error('Error fetching doctors:', error);
    throw error;
  }
};
