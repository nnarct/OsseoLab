import axios from '@/config/axiosConfig';

export const getCaseById = async (id: string): Promise<CaseData> => {
  try {
    const response = await axios.get(`/case/${id}`);
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

export interface CaseSummary {
  id: string;
  case_number: number;
  created_at: number;
  last_updated: number;
  order: number;
  patient_gender: string;
  patient_name: string;
  surgeon: Surgeon;
  surgery_date: number;
  case_code: string
}

interface CaseFile {
  id: string;
  filename: string;
  url: string;
  created_at: number;
}

export interface Surgeon {
  id: string;
  firstname: string;
  lastname: string;
}

export const deleteCaseById = async (caseId: string): Promise<void> => {
  try {
    await axios.delete(`/case/${caseId}`);
  } catch (error) {
    console.error('Failed to delete case:', error);
    throw error;
  }
};
interface CaseData {
  additional_note: string | null;
  anticipated_ship_date: number | null;
  case_code: string | null;
  case_number: number;
  created_at: number;
  created_by: {
    id: string;
    username: string;
    firstname: string;
    lastname: string;
  };
  files: CaseFile[];
  id: string;
  last_updated: number;
  patient_age: string | number | null;
  patient_dob: number | null;
  patient_gender: 'male' | 'female' | 'other' | null;
  patient_name: string;
  priority: string | null;
  problem_description: string | null;
  product: string | null;
  scan_type: string | null;
  status: string | null;
  surgeon: Surgeon;
  surgery_date: number;
}
