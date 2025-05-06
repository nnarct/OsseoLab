import { useQuery } from '@tanstack/react-query';

import { getTechniciansByCaseId } from '@/api/case-technicians.api';

export const useTechniciansByCaseId = (id: string) => {
  return useQuery<CaseTechnicianPair[]>({ queryKey: ['technicians-by-case', id], queryFn: () => getTechniciansByCaseId(id) });
};
export interface CaseTechnicianPair {
  pair_id: string;
  technician_id: string;
  firstname: string;
  lastname: string;
}
