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

export const renameCaseFileVersion = async (case_file_version_id: string, newModelName: string): Promise<void> => {
  try {
    await axios.patch(`/case-file-version/${case_file_version_id}/rename`, { nickname: newModelName });
  } catch (error) {
    console.error('Failed to change model name:', error);
    throw error;
  }
};

interface CaseFileUploadResponse {
  id: string;
  nickname: string;
  url: string;
}
