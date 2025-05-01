import { useMutation, useQuery } from '@tanstack/react-query';
import { fetchCurrentUser, updateCurrentUser, createDoctorUser } from '@/api/user.api';
import { CURRENT_USER_QUERY_KEY, DOCTORS_QUERY_KEY } from '@/constants/queryKey';
import type { CreateDoctorFormData, FormUserProfile } from '@/types/user';
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
