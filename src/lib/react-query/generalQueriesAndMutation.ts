import { NewUser, SigninUserData } from "@/types";
import { 
    useQuery,
    useMutation,
    useQueryClient
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
   logoutUser} from "../api/general_api";
import { TypeOfUser } from "@/_auth/forms/SignupForm";
import { createNewPatient, sendPatientOnboardingData } from "../api/patient_api";
import { createNewConsultant, createNewSchedule, sendConsultantOnboardingData } from "../api/consultant_api";
import { NewSchedule } from "@/components/consultant/ConsultantNewSchedule";
import { ModifyingNotificationSetting } from "@/hooks/useNotificationSettings";

 type UserCreateMutionProps = {
    typeOfUser: TypeOfUser,
    userData: NewUser
 }
 type PatientOnboardingMutionProps = {
    interests: string[],
    userId: string
 }
 type ConsultantOnboardingMutionProps = {
    specialty: string,
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
      mutationFn: (props: PatientOnboardingMutionProps) => sendPatientOnboardingData(props.interests, props.userId),
   })
 }
 export const useUpdateConsultantOnboardingInfo = () => {
   return useMutation({
      mutationFn: (props: ConsultantOnboardingMutionProps) => sendConsultantOnboardingData(props.specialty, props.userId),
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