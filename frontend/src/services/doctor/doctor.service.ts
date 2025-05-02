import { getDoctorSelectOptions } from "@/api/doctor.api";
import { useQuery } from "@tanstack/react-query";

export const useDoctorSelectOptions = () => {
  return useQuery({ queryKey: ['doctor-select-options'], queryFn: getDoctorSelectOptions });
};
