import { axios } from '@/config/axiosConfig';
import type {
  CreateAdminFormData,
  CreateDoctorFormData,
  CreateTechFormData,
  FormUserProfile,
  UserProfile,
} from '@/types/user';

// ---------- Fetch Lists ----------
export const fetchUsers = async () => {
  try {
    const { data } = await axios.get('/user/list');
    return data.data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const fetchAdmins = async () => {
  try {
    const { data } = await axios.get('/user/admin/list');
    return data.data;
  } catch (error) {
    console.error('Error fetching admins:', error);
    throw error;
  }
};

export const fetchTechnicians = async () => {
  try {
    const { data } = await axios.get('/user/technician/list');
    return data.data;
  } catch (error) {
    console.error('Error fetching technicians:', error);
    throw error;
  }
};

export const fetchDoctors = async () => {
  try {
    const { data } = await axios.get('/user/doctor/list');
    return data.data;
  } catch (error) {
    console.error('Error fetching doctors:', error);
    throw error;
  }
};

// ---------- Current User ----------
export const fetchCurrentUser = async (): Promise<UserProfile> => {
  try {
    const { data } = await axios.get('/user/me');
    return data.data;
  } catch (error) {
    console.error('Error fetching current user:', error);
    throw error;
  }
};

export const updateCurrentUser = async (data: FormUserProfile) => {
  try {
    const response = await axios.put('/user/me', data);
    return {
      data: response.data.data,
      accessToken: response.data.accessToken,
    };
  } catch (error) {
    console.error('Error updating user:', error);
    throw error;
  }
};

// ---------- Create Doctor ----------
export const createDoctorUser = async (data: CreateDoctorFormData) => {
  try {
    const response = await axios.post('/admin/create/doctor', {
      ...data,
      role: 'doctor',
    });
    return response.data;
  } catch (error) {
    console.error('Error creating doctor:', error);
    throw error;
  }
};
export const createTechUser = async (data: CreateTechFormData) => {
  try {
    const response = await axios.post('/admin/create/technician', {
      ...data,
      role: 'technician',
    });
    return response.data;
  } catch (error) {
    console.error('Error creating technician:', error);
    throw error;
  }
};

export const createAdminUser = async (data: CreateAdminFormData) => {
  try {
    const response = await axios.post('/admin/create/admin', {
      ...data,
      role: 'admin',
    });
    return response.data;
  } catch (error) {
    console.error('Error creating admin:', error);
    throw error;
  }
};

export const deleteUserById = async (userId: string): Promise<void> => {
  try {
    await axios.delete(`/user/${userId}`);
  } catch (error) {
    console.error('Error deleting user:', error);
    throw error;
  }
};
