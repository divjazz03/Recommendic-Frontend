import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  confirmAppointment,
  ConsultantProfileUpdateRequest,
  createNewSchedule,
  createPrescription,
  deleteSchedule,
  getMyDashboard,
  getMyProfile,
  getMyProfileDetails,
  getMySchedules,
  getPatientMedicalData,
  getScheduleById,
  PrescriptionRequest,
  sendConsultantOnboardingData,
  updateConsultantProfileDetails,
  updateSchedule,
} from "../api/consultant_api";
import { ModifyingSchedule } from "@/components/consultant/ConsultantModifySchedule";
import { NewSchedule } from "@/hooks/useConsultantSchedule";
import { ConsultantOnboardingData } from "@/components/consultant/onboarding/ConsultantOnboarding";

export const useGetDashboard = (accessToken: string | null) => {
  return useQuery({
    queryKey: ["My Dashboard"],
    queryFn: () => getMyDashboard(accessToken),
    staleTime: 3600 * 1000,
    retry: 1,
  });
};

export const useGetPatientMedicalData = (
  id: string,
  accessToken: string | null,
) => {
  return useQuery({
    queryKey: ["Patient Medical Data"],
    queryFn: () => getPatientMedicalData(id, accessToken),
    staleTime: 3600 * 1000,
    enabled: !!id,
  });
};

export const useGetCurrentUserSchedules = (accessToken: string | null) => {
  return useQuery({
    queryKey: ["My Schedules"],
    queryFn: () => getMySchedules(accessToken),
    staleTime: 3600 * 1000,
    retry: 1,
  });
};

export const useGetScheduleWithUserId = (
  scheduleId: string,
  accessToken: string | null,
) => {
  return useQuery({
    queryKey: ["Schedule", scheduleId],
    queryFn: () => getScheduleById(scheduleId, accessToken),
    enabled: !!scheduleId,
  });
};

type ScheduleModificationProps = {
  id: string;
  schedule: ModifyingSchedule;
};

export const useCreateNewSchedules = (accessToken: string | null) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (schedules: NewSchedule[]) =>
      createNewSchedule(schedules, accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["My Schedules"],
      });
    },
  });
};

export const useUpdateSchedule = (accessToken: string | null) => {
  return useMutation({
    mutationFn: (mutationFnProp: ScheduleModificationProps) =>
      updateSchedule(mutationFnProp.id, mutationFnProp.schedule, accessToken),
  });
};
export const useDeleteSchedule = (accessToken: string | null) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteSchedule(id, accessToken),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["My Schedules"],
      });
    },
  });
};
export const useGetMyConsultantProfiles = (
  accessToken: string | null,
  enabled: boolean,
) => {
  return useQuery({
    queryKey: ["My Profile Details"],
    queryFn: () => getMyProfileDetails(accessToken),
    staleTime: 1000 * 3600,
    enabled: enabled,
  });
};

export const useGetConsultantProfile = (
  accessToken: string | null,
  enabled: boolean = true,
) => {
  return useQuery({
    queryKey: ["My Profile"],
    queryFn: () => getMyProfile(accessToken),
    staleTime: 1000 * 3600,
    enabled: enabled,
  });
};
export const useUpdateConsultantProfile = (accessToken: string | null) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (consultantProfile: ConsultantProfileUpdateRequest) =>
      updateConsultantProfileDetails(consultantProfile, accessToken),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["My Profile", "My Profile Details"],
      }),
  });
};

type ConsultantOnboardingMutionProps = {
  data: ConsultantOnboardingData;
  stage: string;
};
export const useUpdateConsultantOnboardingInfo = (
  accessToken: string | null,
) => {
  return useMutation({
    mutationFn: (props: ConsultantOnboardingMutionProps) =>
      sendConsultantOnboardingData(props.data, props.stage, accessToken),
  });
};

interface ConfirmAppointmentProp {
  appointmentId: string;
  note?: string;
}
export const useConfirmAppointment = (accessToken: string | null) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ appointmentId, note }: ConfirmAppointmentProp) =>
      confirmAppointment(appointmentId, note ?? "", accessToken),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["Appointments"] }),
  });
};

export const useCreatePrescription = (accessToken: string | null) => {
  return useMutation({
    mutationFn: (request: PrescriptionRequest) =>
      createPrescription(request, accessToken),
  });
};
