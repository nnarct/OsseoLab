import { getStlList, getStlById } from '@/api/stl.api';
import { STL_LIST_QUERY_KEY, ADMIN_GET_STL_BY_ID_QUERY_KEY } from '@/constants/queryKey';
import { useQuery } from '@tanstack/react-query';

export const useGetStlList = () => {
  return useQuery({
    queryKey: [STL_LIST_QUERY_KEY],
    queryFn: getStlList,
  });
};

export const useGetStlById = (id: string) => {
  return useQuery({ queryKey: [ADMIN_GET_STL_BY_ID_QUERY_KEY], queryFn: () => getStlById(id) });
};
