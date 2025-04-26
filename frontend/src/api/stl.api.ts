import { axios } from '@/config/axiosConfig.ts';
import type { STLResponseDataType, STLLinkDataType } from '@/types/stlDisplay';

export const getStlList = async (): Promise<STLResponseDataType[]> => {
  try {
    const response = await axios.get('/stl/list');

    return response.data.data;
  } catch (error) {
    console.log({ error });
    throw error;
  }
};

export const getStlById = async (id: string): Promise<STLLinkDataType> => {
  try {
    const response = await axios.get(`/stl/${id}`);
    console.log({ response });
    return {
      id: response.data.data.id,
      url: response.data.data.url,
    };
  } catch (error) {
    console.log({ error });
    throw error;
  }
};
