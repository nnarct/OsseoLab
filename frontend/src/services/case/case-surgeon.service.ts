import { useQuery } from '@tanstack/react-query';

import { getSurgeonsByCaseId } from '@/api/case-surgeons.api';

export const useSurgeonsByCaseId = (id: string) => {
  return useQuery<CaseSurgeonPair[]>({ queryKey: ['surgeons-by-case', id], queryFn: () => getSurgeonsByCaseId(id) });
};
export interface CaseSurgeonPair {
  pair_id: string;
  doctor_id: string;
  firstname: string;
  lastname: string;
}
