import { NewUser, SigninUserData } from "@/types";
import { 
    useQuery,
    useMutation,
    useQueryClient,
    UseQueryResult
 } from "@tanstack/react-query";
import {
   signinUser,
   getCurrentUser, 
   resendConfirmationEmail, 
   verifyEmail, 
   getAllSupportedMedicalCategories,
   startNewConsultation,
   endConsultation,
   getMyNotificationSettings,
   updateMyNotificationSettings,
   logoutUser,
   getConsultantTimeSlots,
   getAppointments} from "../api/general_api";
import { TypeOfUser } from "@/_auth/forms/SignupForm";
import { createNewPatient, sendPatientOnboardingData } from "../api/patient_api";
import { createNewConsultant, createNewSchedule, sendConsultantOnboardingData } from "../api/consultant_api";
import { ModifyingNotificationSetting } from "@/hooks/useNotificationSettings";
import { NewSchedule } from "@/hooks/useConsultantSchedule";
import { PatientOnboardingData } from "@/components/patient/PatientOnboarding";
import { ConsultantOnboardingData } from "@/components/consultant/ConsultantOnboarding";

 type UserCreateMutionProps = {
    typeOfUser: TypeOfUser,
    userData: NewUser
 }
 type PatientOnboardingMutionProps = {
    data: PatientOnboardingData,
    userId: string
 }

 export const useCreateUserMutation = () => {
    
    return useMutation({
        mutationFn: (mutationFnProp: UserCreateMutionProps) => {
         switch(mutationFnProp.typeOfUser) {
            case "Patient": return createNewPatient(mutationFnProp.userData);
            case "Consultant": return createNewConsultant(mutationFnProp.userData);
         }
         
      }
    });
 }

 export const useGetCurrentUser = (enabled: boolean) => {
   return useQuery({
      queryKey: ['getCurrentUser'],
      queryFn: getCurrentUser,
      enabled: enabled,
      retry: 1,
   })
 }

 export const useGetSupportedMedicalCategories = () => {
   return useQuery({
      queryKey: ['getSupportedMedicalCategories'],
      queryFn: getAllSupportedMedicalCategories,
      staleTime: Infinity
   });
 }

 export const useSignInUserMutation = () => {

    return useMutation({
      mutationFn: (data: SigninUserData) => signinUser(data),
      throwOnError: false
    })
 }

 export const useLogout = () => {
   return useMutation({
      mutationFn: () => logoutUser()
   })
 }

 export const useResendEmailMutation= () => {
   return useMutation({
      mutationFn: (email: string) => resendConfirmationEmail(email),
   })
 }
 export const useUpdatePatientOnboardingInfo = () => {
   return useMutation({
      mutationFn: (props: PatientOnboardingMutionProps) => sendPatientOnboardingData(props.data, props.userId),
   })
 }
 
 export const useVerifyTokenMutation = () => {
   return useMutation({
      mutationFn: (token: string) => verifyEmail(token)
   })
 }

 export const useCreateSchedule = () => {
   return useMutation({
      mutationFn: (schedule: NewSchedule[]) => createNewSchedule(schedule)
   })
 }

 export const useStartConsultation = () => {
   return useMutation({
      mutationFn: (appointmentId: string) => startNewConsultation(appointmentId)
   })
 }
 export const useEndConsultation = () => {
   return useMutation({
      mutationFn: (consultationId: string) => endConsultation(consultationId)
   })
 }

 export const useGetNotificationSettings = () => {
    return useQuery ({
        queryKey: ['getNotificationSettings'],
        queryFn: getMyNotificationSettings,
        staleTime: 1000 * 3600
    })
}

export const useUpdateNotificationSettings = () => {
   const client = useQueryClient();
   return useMutation({
      mutationFn: (modifyingNotification: ModifyingNotificationSetting) => updateMyNotificationSettings(modifyingNotification),
      onSuccess: () => {
         client.invalidateQueries({queryKey: ['getNotificationSettings']})
      }
   });
}

export const useGetConsultantTimeSlots = (consultantId: string, date: string, enabled: boolean = true) => {

   return useQuery({
      queryKey: ["Consultant timeSlots", consultantId, date],
      queryFn: () => getConsultantTimeSlots(consultantId, date),
      staleTime: 1000 * 3600,
      enabled: enabled,
      retry: 1
   })
}

export const useGetAppointments = () => {
   return useQuery({
      queryKey: ["Appointments"],
      queryFn: getAppointments,
      staleTime: 1000 * 3600,
   })
}