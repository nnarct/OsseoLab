import { useMutation, useQuery, QueryClient } from '@tanstack/react-query';
import { fetchCurrentUser, updateCurrentUser } from '@/api/user.api';
import { CURRENT_USER_QUERY_KEY } from '@/constants/queryKey';

export const useCurrentUser = () => {
  return useQuery({
    queryKey: [CURRENT_USER_QUERY_KEY],
    queryFn: fetchCurrentUser,
  });
};

export const useUpdateCurrentUser = () => {
  const queryClient = new QueryClient();
  return useMutation({
    mutationFn: (data: any) => {
      return updateCurrentUser(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [CURRENT_USER_QUERY_KEY] });
    },
  });
};
