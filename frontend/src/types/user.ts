import { Dayjs } from 'dayjs';

export enum UserRole {
  Technician = 'technician',
  Doctor = 'doctor',
  Admin = 'admin',
}

export enum CaseStatus {
  creation = 'Case Creation',
  planning = 'Planning & Design',
  surgeonReview = 'Surgeon Review',
  deviceDesign = 'Device Design',
  designConfirmation = 'Design Confirmation',
  manufacturing = 'Manufacturing',
  complete = 'Case Complete',
}

export interface UserProfile {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string | null;
  dob: number | null;
  username: string | null;
  gender: Gender;
  role: UserRole;
  country: string | null;
  profile_image: string | null;
  created_at: number;
  last_updated: number;
  hospital?: string | null;
  reference?: string | null;
  doctor_registration_id?: string | null;
}

export interface FormUserProfile {
  firstname: string | null;
  lastname: string | null;
  phone: string | null;
  dob: Dayjs | string | null;
  username: string | null;
  gender: Gender;
  country: string | null;
  hospital?: string | null;
  reference?: string | null;
  doctor_registration_id?: string | null;
}

export interface CreateDoctorFormData {
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  phone: string | null;
  country: string | null;
  gender: Gender | null;
  dob: Dayjs | string | null;
  password: string;
}
export interface CreateTechFormData {
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  phone: string | null;
  country: string | null;
  gender: Gender | null;
  dob: Dayjs | string | null;
  password: string;
}
export interface CreateAdminFormData {
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  phone: string | null;
  country: string | null;
  gender: Gender | null;
  dob: Dayjs | string | null;
  password: string;
}

export interface CreateUserFormData {
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  phone: string | null;
  country: string | null;
  gender: Gender | null;
  dob: Dayjs | string | null;
  password: string;
  role: UserRole;
}

export type Gender = 'male' | 'female' | 'other';
