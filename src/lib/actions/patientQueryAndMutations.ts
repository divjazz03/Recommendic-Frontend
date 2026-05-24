import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  AppointmentCreationRequest,
  createAnAppointment,
  getConsultantFullProfileDetails,
  getConsultantSchedules,
  getMyDashboard,
  getMyProfileDetails,
  getRecommendedConsultants,
  updateProfileData,
} from "../api/patient_api";
import { ModifyingProfileData } from "@/hooks/useProfile";

export const useGetConsultantSchedules = (
  consultantId: string,
  date: string,
  accessToken: string | null,
) => {
  return useQuery({
    queryKey: ["getConsultantSchedules", consultantId, date],
    queryFn: () => getConsultantSchedules(consultantId, date, accessToken),
  });
};

export const useGetMyDashboard = (accessToken: string | null) => {
  return useQuery({
    queryKey: ["My Dashboard"],
    queryFn: () => getMyDashboard(accessToken),
    staleTime: 3600 * 1000,
  });
};

export const useGetMyProfiles = (
  accessToken: string | null,
  enabled: boolean = true,
) => {
  return useQuery({
    queryKey: ["getMyProfile"],
    queryFn: () => getMyProfileDetails(accessToken),
    staleTime: 1000 * 3600,
    enabled,
  });
};

export const useGetRecommendedConsultants = (
  pageNumber: number,
  accessToken: string | null,
) => {
  return useQuery({
    queryKey: ["recommendedConsultants", pageNumber],
    queryFn: () => getRecommendedConsultants(pageNumber, accessToken),
    placeholderData: keepPreviousData,
  });
};

export const useUpdatePatientData = (accessToken: string | null) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (modifyingPatientProfile: ModifyingProfileData) =>
      updateProfileData(modifyingPatientProfile, accessToken),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getMyProfile"] });
    },
  });
};

export const useGetConsultantFullProfileDetails = (
  consultantId: string,
  accessToken: string | null,
) => {
  return useQuery({
    queryKey: ["getConsultantProfileDetails"],
    queryFn: () => getConsultantFullProfileDetails(consultantId, accessToken),
    staleTime: 1000 * 60,
  });
};

export const useCreateAppointment = (accessToken: string | null) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (request: AppointmentCreationRequest) =>
      createAnAppointment(request, accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["Appointments"] });
    },
  });
};
