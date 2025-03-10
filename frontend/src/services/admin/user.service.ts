import { useQuery } from '@tanstack/react-query';
import { fetchUsers, fetchAdmins, fetchTechnicians, fetchDoctors } from '@/api/user.api';
import { UserListDataType } from '@/components/feature/UserList/UserList';

export const useGetUsers = () => {
  return useQuery<UserListDataType[]>({
    queryKey: ['users'],
    queryFn: fetchUsers,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
};

export const useGetAdmins = () => {
  return useQuery<UserListDataType[]>({
    queryKey: ['admins'],
    queryFn: fetchAdmins,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
};

export const useGetTechnicians = () => {
  return useQuery<UserListDataType[]>({
    queryKey: ['technicians'],
    queryFn: fetchTechnicians,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
};

export const useGetDoctors = () => {
  return useQuery<UserListDataType[]>({
    queryKey: ['doctors'],
    queryFn: fetchDoctors,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
};
