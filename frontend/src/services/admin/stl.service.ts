import { getStlList } from '@/api/stl.api';
import { STL_LIST_QUERY_KEY } from '@/constants/queryKey';
import { useQuery } from '@tanstack/react-query';

export const useGetStlList = () => {
  return useQuery({
    queryKey: [STL_LIST_QUERY_KEY],
    queryFn: getStlList,
  });
};
