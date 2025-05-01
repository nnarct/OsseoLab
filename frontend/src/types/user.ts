import { Dayjs } from 'dayjs';

export enum UserRole {
  Technician = 'tech',
  Doctor = 'doctor',
  Admin = 'admin',
}

export interface UserProfile {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
  phone: string | null;
  dob: number | null;
  username: string | null;
  gender: 'male' | 'female' | 'other';
  role: UserRole;
  country: string | null;
  profile_pic_url: string | null;
  created_at: number;
  last_updated: number;
}

export interface FormUserProfile {
  firstname: string | null;
  lastname: string | null;
  phone: string | null;
  dob: Dayjs | string | null;
  username: string | null;
  gender: 'male' | 'female' | 'other';
  country: string | null;
}
