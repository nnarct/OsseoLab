import { getTechnicianSelectOptions,fetchTechnicians } from '@/api/technician.api';
import { TECHNICIANS_QUERY_KEY } from '@/constants/queryKey';
import type { Technician } from '@/types/technician';
import { useQuery } from '@tanstack/react-query';

export const useTechnicianSelectOptions = () => {
  return useQuery({ queryKey: ['technician-select-options'], queryFn: getTechnicianSelectOptions });
};

export const useGetTechnicians = () => {
  return useQuery<Technician[]>({
    queryKey: TECHNICIANS_QUERY_KEY,
    queryFn: fetchTechnicians,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
};
