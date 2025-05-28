import { NewUser, TypeOfUser, SigninUserData } from "@/types";
import { 
    useQuery,
    useMutation
 } from "@tanstack/react-query";
import { createNewUser, signinUser, getCurrentUser, resendConfirmationEmail, verifyEmail, getAllSupportedMedicalCategories } from "../api/backend_api";

 type MutationFnProps = {
    typeOfUser: TypeOfUser,
    userData: NewUser
 }
 export const useCreateUserMutation = () => {
    
    return useMutation({
        mutationFn: (mutationFnProp: MutationFnProps) => createNewUser(mutationFnProp.typeOfUser, mutationFnProp.userData)
    });
 }

 export const useGetCurrentUser = () => {
   return useQuery({
      queryKey: ['getCurrentUser'],
      queryFn: getCurrentUser,
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
 export const useVerifyTokenMutation = () => {
   return useMutation({
      mutationFn: (token: string) => verifyEmail(token)
   })
 }