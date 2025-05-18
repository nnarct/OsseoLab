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

export const getCaseFilesByCaseId = async (caseId: string): Promise<CaseFileById[]> => {
  try {
    const response = await axios.get(`/case-file/by-case/${caseId}`);
    return response.data.data;
  } catch (error) {
    console.log('Failed to get case files');
    throw error;
  }
};
export const getCaseModelsByCaseId = async (caseId: string): Promise<CaseModelById[]> => {
  try {
    const response = await axios.get(`/case-file/by-case/${caseId}/model`);
    return response.data.data;
  } catch (error) {
    console.log('Failed to get case files');
    throw error;
  }
};

export interface CaseFileById {
  case_file_id: string;
  version_id: string;
  version_number: number;
  nickname: string;
  filename: string;
  filesize: number;
  active: boolean;
  created_at: number;
  uploaded_at: number;
  uploaded_by: string;
  url: string;
}
export interface CaseModelById {
  case_file_id: string;
  active: boolean;
  version_id: string;
  name: string;
  pre: boolean;
  post: boolean;
  url: string;
}
