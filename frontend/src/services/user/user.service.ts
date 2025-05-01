import { useMutation, useQuery } from '@tanstack/react-query';
import { fetchCurrentUser, updateCurrentUser } from '@/api/user.api';
import { CURRENT_USER_QUERY_KEY } from '@/constants/queryKey';
import { FormUserProfile } from '@/types/user';
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
