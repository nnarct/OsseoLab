import { axios } from '@/config/axiosConfig.ts';
export const getStlList = async (): Promise<STLDataType[]> => {
  try {
    const response = await axios.get('/stl/list');

    return response.data.data;
  } catch (error) {
    console.log({ error });
    throw error;
  }
};

export type STLDataType = {
  id: string;
  filename: string;
  url: string;
  original_filename: string;
};
