import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { AppointmentCreationRequest, createAnAppointment, getConsultantFullProfileDetails, getConsultantSchedules, getMyDashboard, getMyProfileDetails, getRecommendedConsultants, updateProfileData } from "../api/patient_api"
import { ModifyingProfileData } from "@/hooks/useProfile"
import { queryClient } from "../queryClient"


export const useGetConsultantSchedules = (consultantId: string, date: string) => {
    return useQuery({
        queryKey: ['getConsultantSchedules', consultantId, date],
        queryFn: () => getConsultantSchedules(consultantId, date),
    })
}

export const useGetMyDashboard = () => {
    return useQuery({
        queryKey: ['My Dashboard'],
        queryFn: getMyDashboard,
        staleTime: 3600 * 1000
    })
}

export const useGetMyProfiles = () => {
    return useQuery({
        queryKey: ['getMyProfile'],
        queryFn: getMyProfileDetails,
        staleTime: 1000 * 3600
    })
}

export const useGetRecommendedConsultants = (pageNumber: number) => {
    return useQuery({
        queryKey: ['recommendedConsultants', pageNumber],
        queryFn: () => getRecommendedConsultants(pageNumber),
        placeholderData: keepPreviousData
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
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (request: AppointmentCreationRequest) => createAnAppointment(request),
        onSuccess: () => {
            queryClient.invalidateQueries({queryKey:["Appointments"]})
        }
    })
}