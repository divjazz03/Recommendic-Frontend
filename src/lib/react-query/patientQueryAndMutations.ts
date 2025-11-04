import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { AppointmentCreationRequest, createAnAppointment, getConsultantFullProfileDetails, getConsultantSchedules, getMyProfileDetails, getRecommendedConsultants, updateProfileData } from "../api/patient_api"
import { getMyNotificationSettings } from "../api/general_api"
import { ModifyingProfileData } from "@/hooks/useProfile"


export const useGetConsultantSchedules = (consultantId: string, date: string) => {
    return useQuery({
        queryKey: ['getConsultantSchedules', consultantId, date],
        queryFn: () => getConsultantSchedules(consultantId, date),
    })
}

export const useGetMyProfiles = () => {
    return useQuery({
        queryKey: ['getMyProfile'],
        queryFn: getMyProfileDetails,
        staleTime: 1000 * 3600
    })
}

export const useGetRecommendedConsultants = () => {
    return useQuery({
        queryKey: ['recommendedConsultants'],
        queryFn: getRecommendedConsultants,
        staleTime: 3600*1000
    })
}


export const useUpdatePatientData = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (modifyingPatientProfile: ModifyingProfileData) => updateProfileData(modifyingPatientProfile),

        onSuccess: () => {
            queryClient.invalidateQueries({queryKey: ['getMyProfile']})
        }
    })
}

export const useGetConsultantFullProfileDetails = (consultantId: string) => {
    return useQuery({
        queryKey: ['getConsultantProfileDetails'],
        queryFn: () => getConsultantFullProfileDetails(consultantId),
        staleTime: 1000 * 60
    })
}

export const useCreateAppointment = () => {
    return useMutation({
        mutationFn: (request: AppointmentCreationRequest) => createAnAppointment(request)
    })
}