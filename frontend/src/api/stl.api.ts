import { axios } from '@/config/axiosConfig.ts';
import type { STLResponseDataType } from '@/types/stlDisplay';

export const getStlList = async (): Promise<STLResponseDataType[]> => {
  try {
    const response = await axios.get('/stl/list');

    return response.data.data;
  } catch (error) {
    console.log({ error });
    throw error;
  }
};

