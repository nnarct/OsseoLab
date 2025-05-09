import { getCaseFileGroupItems, getCaseFileGroups, getCaseFileVersions, getCuttingPlanes } from "@/api/files.api";
import { useQuery } from '@tanstack/react-query';

export const useCaseFileGroups = () => {
  return useQuery({ queryKey: ['caseFileGroups'], queryFn: getCaseFileGroups });
};
export const useCaseFileGroupItems = () => {
  return useQuery({ queryKey: ['caseFileGroupItems'], queryFn: getCaseFileGroupItems });
};
export const useCaseFileVersions = () => {
  return useQuery({ queryKey: ['caseFileVersions'], queryFn: getCaseFileVersions });
};
export const useCuttingPlanes = () => {
  return useQuery({ queryKey: ['cuttingPlanes'], queryFn: getCuttingPlanes });
};