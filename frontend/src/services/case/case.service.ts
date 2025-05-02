import { useQuery } from '@tanstack/react-query';

import { getCaseById, getCaseList } from '@/api/case.api';

export const useGetCaseList = () => {
  return useQuery({ queryKey: ['case-list'], queryFn: getCaseList });
};
export const useGetCaseById = (id: string) => {
  return useQuery({ queryKey: ['case', id], queryFn: () => getCaseById(id) });
};
