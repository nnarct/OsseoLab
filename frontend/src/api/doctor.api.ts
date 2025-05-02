import { axios } from "@/config/axiosConfig";

export const getDoctorSelectOptions = async () => {
  try {
    const response = await axios.get('/doctor/select-options');
    return response.data.data || [];
  } catch (error) {
    console.error('Failed to fetch doctor options:', error);
    return [];
  }
};