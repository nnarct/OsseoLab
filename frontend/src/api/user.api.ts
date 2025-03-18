import { axios } from '@/config/axiosConfig';

export const fetchUsers = async () => {
  try {
    const response = await axios.get('/user/list');
    console.log({ response });
    return response.data.data;
  } catch (error) {
    console.log({ error });
  }
};

export const fetchAdmins = async () => {
  const response = await axios.get('/user/admin/list');
  console.log({ fetchAdmins: response });
  return response.data.data;
};

export const fetchTechnicians = async () => {
  const response = await axios.get('/user/tech/list');
  console.log({ fetchTechnicians: response });
  return response.data.data;
};

export const fetchDoctors = async () => {
  const response = await axios.get('/user/doctor/list');
  console.log({ fetchDoctors: response });
  return response.data.data;
};
