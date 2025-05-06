export interface Doctor {
  created_at: number;
  doctor_registration_id: string | null;
  email: string;
  firstname: string;
  hospital: string | null;
  id: string;
  last_updated: number;
  lastname: 'name';
  phone: string | null;
  user_id: string;
  username: string;
}

export interface DoctorSelectOption {
  id: string;
  firstname: string;
  lastname: string;
}
