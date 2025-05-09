import axios from '@/config/axiosConfig';

export const getCaseFileGroupItems = async (): Promise<any[]> => {
  try {
    const response = await axios.get('/case-file-group-items');
    return response.data.data;
  } catch (error) {
    console.log('Failed to fetch case file group items');
    throw error;
  }
};

export const getCaseFileGroups = async (): Promise<any[]> => {
  try {
    const response = await axios.get('/case-file-groups');
    return response.data.data;
  } catch (error) {
    console.log('Failed to fetch case file groups');
    throw error;
  }
};

export const getCaseFileVersions = async (): Promise<any[]> => {
  try {
    const response = await axios.get('/case-file-versions');
    return response.data.data;
  } catch (error) {
    console.log('Failed to fetch case file versions');
    throw error;
  }
};

export const getCaseFiles = async (): Promise<any[]> => {
  try {
    const response = await axios.get('/case-files');
    return response.data.data;
  } catch (error) {
    console.log('Failed to fetch case files');
    throw error;
  }
};

export const getCuttingPlanes = async (): Promise<any[]> => {
  try {
    const response = await axios.get('/cutting-planes');
    return response.data.data;
  } catch (error) {
    console.log('Failed to fetch cutting planes');
    throw error;
  }
};
