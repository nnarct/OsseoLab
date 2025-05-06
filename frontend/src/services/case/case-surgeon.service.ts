import { useQuery } from '@tanstack/react-query';

import { getSurgeonsByCaseId } from '@/api/case-surgeons.api';

export const useSurgeonsByCaseId = (id: string) => {
  return useQuery<CaseSurgeonResponse>({ queryKey: ['surgeons-by-case', id], queryFn: () => getSurgeonsByCaseId(id) });
};
export interface CaseSurgeon {
  pair_id: string;
  doctor_id: string;
  firstname: string;
  lastname: string;
}

export interface CaseSurgeonResponse {
  surgeons: CaseSurgeon[];
  main_surgeon: string;
}