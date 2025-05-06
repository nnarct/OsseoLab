import { useQuery } from '@tanstack/react-query';
import { fetchUsers, fetchAdmins, fetchTechnicians } from '@/api/user.api';
import { UserListDataType } from '@/components/feature/UserList/UserList';
import { ADMIN_USERS_QUERY_KEY, ADMINS_QUERY_KEY, TECHNICIANS_QUERY_KEY } from '@/constants/queryKey';

export const useGetUsers = () => {
  return useQuery<UserListDataType[]>({
    queryKey: ADMIN_USERS_QUERY_KEY,
    queryFn: fetchUsers,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
};

export const useGetAdmins = () => {
  return useQuery<UserListDataType[]>({
    queryKey: ADMINS_QUERY_KEY,
    queryFn: fetchAdmins,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
};

export const useGetTechnicians = () => {
  return useQuery<UserListDataType[]>({
    queryKey: TECHNICIANS_QUERY_KEY,
    queryFn: fetchTechnicians,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
};
