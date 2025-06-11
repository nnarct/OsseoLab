import queryClient from '@/config/queryClient';

export const invalidateCaseQueries = (caseId: string) => {
  queryClient.invalidateQueries({ queryKey: ['case', caseId] });
  queryClient.invalidateQueries({ queryKey: ['case-file-versions'] });
  queryClient.invalidateQueries({ queryKey: ['caseFilesByCaseId', caseId] });
  queryClient.invalidateQueries({ queryKey: ['caseModelByCaseId', caseId] });
};

export const refetchCaseQueries = async (caseId: string) => {
  await queryClient.refetchQueries({ queryKey: ['case', caseId] });
  await queryClient.refetchQueries({ queryKey: ['case-file-versions'] });
  await queryClient.refetchQueries({ queryKey: ['caseFilesByCaseId', caseId] });
  await queryClient.refetchQueries({ queryKey: ['caseModelByCaseId', caseId] });
};
