import { getDoctorSelectOptions } from '@/api/doctor.api';
import { fetchDoctors } from '@/api/doctor.api';
import { DOCTORS_QUERY_KEY } from '@/constants/queryKey';
import type { Doctor } from '@/types/doctor';
import { useQuery } from '@tanstack/react-query';

export const useDoctorSelectOptions = () => {
  return useQuery({ queryKey: ['doctor-select-options'], queryFn: getDoctorSelectOptions });
};

export const useGetDoctors = () => {
  return useQuery<Doctor[]>({
    queryKey: DOCTORS_QUERY_KEY,
    queryFn: fetchDoctors,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
};
