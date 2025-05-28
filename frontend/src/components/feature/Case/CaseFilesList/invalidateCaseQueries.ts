import queryClient from '@/config/queryClient';

export const invalidateCaseQueries = (caseId: string) => {
  queryClient.invalidateQueries({ queryKey: ['case', caseId] });
  queryClient.invalidateQueries({ queryKey: ['case-file-versions'] });
  queryClient.invalidateQueries({ queryKey: ['caseFilesByCaseId', caseId] });
  queryClient.invalidateQueries({ queryKey: ['caseModelByCaseId', caseId] });
};