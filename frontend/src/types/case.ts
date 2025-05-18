import type { Dayjs } from 'dayjs';

export interface QuickCaseFormValues {
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  country: string;
  product: string;
  otherProduct?: string;
  anatomy: string;
  surgery_date: Dayjs;
  additionalInfo?: string;
}
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
  case_code: string;
}

// export interface CaseFile {
//   filename: string;
//   id: string;
//   order: number;
//   uploaded_at: number;
//   urls: string[];
// }
export interface CaseFile {
  created_at: number;
  filename: string;
  filesize: number;
  filetype: string;
  id: string;
  nickname: string;
  order: number;
  urls: string[];
  version_id: string;
}

export interface CaseData {
  additional_note: string | null;
  anticipated_ship_date: number | null;
  case_code: string | null;
  case_number: number;
  created_at: number;
  created_by: UserData;
  files: CaseFile[];
  id: string;
  last_updated: number;
  patient_age: number | null;
  patient_dob: null;
  patient_gender: null;
  patient_name: string;
  priority: string | null;
  problem_description: string | null;
  product: string | null;
  scan_type: string | null;
  status: string | null;
  surgeon: SurgeonData;
  surgery_date: number;
}

export interface QuickCaseData {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  country: string;
  product: string;
  other_product?: string;
  anatomy: string;
  surgery_date: number;
  additional_info?: string;
  created_at: number;
  files?: QuickCaseFile[];
}

export interface QuickCase {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  product: string;
  anatomy: string;
  surgery_date: number;
  created_at: number;
  phone: string;
}

export interface QuickCaseFile {
  filename: string;
  filepath: string;
  filesize: number;
  filetype: string;
  id: string;
  quick_case_id: string;
  uploaded_at: number;
}

interface UserData {
  firstname: string;
  id: string;
  lastname: string;
  username: string;
}

interface SurgeonData {
  id: string;
  firstname: string;
  lastname: string;
}
