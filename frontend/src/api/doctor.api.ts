import { axios } from "@/config/axiosConfig";

export interface DoctorSelectOption {
  id: string;
  firstname: string;
  lastname: string;
}

export const getDoctorSelectOptions = async (): Promise<DoctorSelectOption[]> => {
  try {
    const response = await axios.get('/doctor/select-options');
    return response.data.data || [];
  } catch (error) {
    console.error('Failed to fetch doctor options:', error);
    return [];
  }
};