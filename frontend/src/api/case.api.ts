import axios from '@/config/axiosConfig';
import type { CaseData, CaseSummary, QuickCaseData } from '@/types/case';

export const getCaseById = async (id: string): Promise<CaseData> => {
  try {
    const response = await axios.get(`/case/${id}`);
    console.log({data: response.data.data})
    return response.data.data;
  } catch (error) {
    console.error('Failed to fetch case by ID:', error);
    throw error;
  }
};

export const getCaseList = async (): Promise<CaseSummary[]> => {
  try {
    const response = await axios.get('/case/list');
    return response.data.data;
  } catch (error) {
    console.error('Failed to fetch case list:', error);
    throw error;
  }
};

export const deleteCaseById = async (caseId: string): Promise<void> => {
  try {
    await axios.delete(`/case/${caseId}`);
  } catch (error) {
    console.error('Failed to delete case:', error);
    throw error;
  }
};

export const submitQuickCase = async (formData: FormData): Promise<void> => {
  try {
    await axios.post('/case/quick-submit-combined', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  } catch (error) {
    console.error('Failed to submit quick case:', error);
    throw error;
  }
};

export const getQuickCaseList = async (): Promise<QuickCaseData[]> => {
  try {
    const response = await axios.get('/case/quick-list');
    return response.data.data;
  } catch (error) {
    console.error('Failed to fetch quick case list:', error);
    throw error;
  }
};

export const deleteQuickCaseById = async (quickCaseId: string): Promise<void> => {
  try {
    await axios.delete(`/case/quick-delete/${quickCaseId}`);
  } catch (error) {
    console.error('Failed to delete quick case:', error);
    throw error;
  }
};


export const getQuickCaseById = async (id: string): Promise<QuickCaseData> => {
  try {
    const response = await axios.get(`/case/quick/${id}`);
    return response.data.data;
  } catch (error) {
    console.error('Failed to fetch quick case by ID:', error);
    throw error;
  }
};
