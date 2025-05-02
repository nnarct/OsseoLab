import axios from '@/config/axiosConfig';

export const uploadCaseFile = async (formData: FormData): Promise<CaseFileUploadResponse> => {
  try {
    const response = await axios.post(`/case-file/upload`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data.data || [];
  } catch (error) {
    console.error('...', error);
    throw error;
  }
};

export const deleteCaseFileById = async (fileId: string): Promise<void> => {
  try {
    await axios.delete(`/case-file/${fileId}`);
  } catch (error) {
    console.error('Failed to delete case file:', error);
    throw error;
  }
};

export const renameCaseFile = async (fileId: string, newFilename: string): Promise<void> => {
  try {
    await axios.patch(`/case-file/${fileId}/rename`, { filename: newFilename });
  } catch (error) {
    console.error('Failed to rename case file:', error);
    throw error;
  }
};

interface CaseFileUploadResponse {
  id: string;
  nickname: string;
  url: string;
}
