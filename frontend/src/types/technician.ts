export interface Technician {
  created_at: number;
  email: string;
  firstname: string;
  id: string;
  last_updated: number;
  lastname: 'name';
  phone: string | null;
  user_id: string;
  username: string;
}

export interface TechnicianSelectOption {
  id: string;
  firstname: string;
  lastname: string;
}
