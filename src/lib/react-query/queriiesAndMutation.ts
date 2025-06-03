import { NewUser, TypeOfUser, SigninUserData } from "@/types";
import { 
    useQuery,
    useMutation
 } from "@tanstack/react-query";
import { createNewUser, signinUser, getCurrentUser, resendConfirmationEmail, verifyEmail, getAllSupportedMedicalCategories, sendPatientOnboardingData, sendConsultantOnboardingData } from "../api/backend_api";

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
        mutationFn: (mutationFnProp: UserCreateMutionProps) => createNewUser(mutationFnProp.typeOfUser, mutationFnProp.userData)
    });
 }

 export const useGetCurrentUser = (enabled: boolean) => {
   return useQuery({
      queryKey: ['getCurrentUser'],
      queryFn: getCurrentUser,
      enabled: enabled,
      staleTime: 1000 * 3600 //1 hour
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