import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { confirmAppointment, ConsultantProfileUpdateRequest, createNewSchedule, deleteSchedule, getMyProfileDetails, getMySchedules, getScheduleById, sendConsultantOnboardingData, updateConsultantProfileDetails, updateSchedule } from "../api/consultant_api"
import { ModifyingSchedule } from "@/components/consultant/ConsultantModifySchedule"
import { NewSchedule } from "@/hooks/useConsultantSchedule"
import { ConsultantOnboardingData } from "@/components/consultant/ConsultantOnboarding"

export const useGetCurrentUserSchedules = () => {
    return useQuery({
        queryKey: ["My Schedules"],
        queryFn: getMySchedules,
        staleTime: 3600 * 1000,
        retry: 1
    })
}

export const useGetScheduleWithUserId = (scheduleId: string) => {
    return useQuery({
        queryKey: ["Schedule", scheduleId],
        queryFn: () =>  getScheduleById(scheduleId),
        enabled: !!scheduleId
    })
}

type ScheduleModificationProps = {
    id: string,
    schedule: ModifyingSchedule
}

export const useCreateNewSchedules = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (schedules: NewSchedule[]) => createNewSchedule(schedules),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['My Schedules']
            })
        }
    })
}

export const useUpdateSchedule = () => {
    return useMutation({
        mutationFn: (mutationFnProp: ScheduleModificationProps) => updateSchedule(mutationFnProp.id, mutationFnProp.schedule)
    })
}
export const useDeleteSchedule = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => deleteSchedule(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['My Schedules']
            })
        }
    })
}
export const useGetMyConsultantProfiles = () => {
    return useQuery({
        queryKey: ['My profile'],
        queryFn: getMyProfileDetails,
        staleTime: 1000 * 3600
    })
}
export const useUpdateConsultantProfile = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (consultantProfile: ConsultantProfileUpdateRequest) => updateConsultantProfileDetails(consultantProfile),
        onSuccess: () => queryClient.invalidateQueries({queryKey: ['My profile']})
    })
}

 type ConsultantOnboardingMutionProps = {
    data: ConsultantOnboardingData,
    userId: string
 }
export const useUpdateConsultantOnboardingInfo = () => {
   return useMutation({
      mutationFn: (props: ConsultantOnboardingMutionProps) => sendConsultantOnboardingData(props.data, props.userId),
   })
 }

interface ConfirmAppointmentProp {
    appointmentId: string,
    note?: string
}
export const useConfirmAppointment = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({appointmentId, note}:ConfirmAppointmentProp) => confirmAppointment(appointmentId,note ?? ''),
        onSuccess: () => queryClient.invalidateQueries({queryKey: ['Appointments']})
    })
}