import { useMutation, useQuery } from '@tanstack/react-query';
import { fetchCurrentUser, updateCurrentUser, createDoctorUser, createTechUser, createAdminUser,getUserById } from '@/api/user.api';
import {
  ADMIN_USERS_QUERY_KEY,
  ADMINS_QUERY_KEY,
  CURRENT_USER_QUERY_KEY,
  DOCTORS_QUERY_KEY,
  TECHNICIANS_QUERY_KEY,
} from '@/constants/queryKey';
import type {
  CreateAdminFormData,
  CreateDoctorFormData,
  CreateTechFormData,
  CreateUserPayloadData,
  FormUserProfile,
  UserRole,
} from '@/types/user';
import queryClient from '@/config/queryClient';

export const useCurrentUser = () => {
  return useQuery({
    queryKey: [CURRENT_USER_QUERY_KEY],
    queryFn: fetchCurrentUser,
  });
};

export const useUpdateCurrentUser = () => {
  return useMutation({
    mutationFn: (data: FormUserProfile) => {
      return updateCurrentUser(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CURRENT_USER_QUERY_KEY] });
    },
  });
};

export const useCreateDoctorUser = () => {
  return useMutation({
    mutationFn: (data: CreateDoctorFormData) => {
      return createDoctorUser(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DOCTORS_QUERY_KEY });
    },
  });
};

export const useCreateTechUser = () => {
  return useMutation({
    mutationFn: (data: CreateTechFormData) => {
      return createTechUser(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: TECHNICIANS_QUERY_KEY });
    },
  });
};

export const useCreateAdminUser = () => {
  return useMutation({
    mutationFn: (data: CreateAdminFormData) => {
      return createAdminUser(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ADMINS_QUERY_KEY });
    },
  });
};

export const useCreateUser = () => {
  return useMutation({
    mutationFn: async (data: CreateUserPayloadData & { role: UserRole }) => {
      const { role, ...rest } = data;

      if (role === 'admin') {
        await createAdminUser(rest);
        queryClient.invalidateQueries({ queryKey: ADMIN_USERS_QUERY_KEY });
      } else if (role === 'doctor') {
        await createDoctorUser(rest as CreateDoctorFormData);
        queryClient.invalidateQueries({ queryKey: ADMIN_USERS_QUERY_KEY });
      } else if (role === 'technician') {
        await createTechUser(rest as CreateTechFormData);
        queryClient.invalidateQueries({ queryKey: ADMIN_USERS_QUERY_KEY });
      }
    },
  });
};


export const useGetUserById = (id: string) => {
  return useQuery({ queryKey: ['user', id], queryFn: () => getUserById(id) });
};
