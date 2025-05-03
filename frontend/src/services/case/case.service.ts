import { useQuery, useMutation } from '@tanstack/react-query';

import { getCaseById, getCaseList, submitQuickCase } from '@/api/case.api';
import { getQuickCaseList } from '@/api/case.api';

export const useGetCaseList = () => {
  return useQuery({ queryKey: ['case-list'], queryFn: getCaseList });
};

export const useGetCaseById = (id: string) => {
  return useQuery({ queryKey: ['case', id], queryFn: () => getCaseById(id) });
};

export const useSubmitQuickCase = () => {
  return useMutation({
    mutationFn: submitQuickCase,
  });
};

export const useGetQuickCaseList = () => {
  return useQuery({ queryKey: ['quick-cases'], queryFn: getQuickCaseList });
};
