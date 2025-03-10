import { NewUser, TypeOfUser, SigninUserData } from "@/types";
import { 
    useQuery,
    useMutation,
    useQueryClient,
    useInfiniteQuery
 } from "@tanstack/react-query";
import { createNewUser, signinUser, getCurrentUser, resendConfirmationEmail, verifyEmail, getAllSupportedMedicalCategories } from "../backend_api";

 type MutationFnProps = {
    typeOfUser: TypeOfUser,
    userData: NewUser
 }
 export const useCreateUserMutation = () => {
    
    return useMutation({
        mutationFn: (mutationFnProp: MutationFnProps) => createNewUser(mutationFnProp.typeOfUser, mutationFnProp.userData)
    });
 }

 export const useGetCurrentUserMutation = () => {
   return useMutation({
      mutationFn: () => getCurrentUser()
   })
 }

 export const useGetSupportedMedicalCategories = () => {
   return useMutation({
      mutationFn: () => getAllSupportedMedicalCategories(),
   })
 }

 export const useSignInUserMutation = () => {

    return useMutation({
        mutationFn: (userData: SigninUserData) => signinUser(userData)
    });
 }

 export const useResendEmailMutation = () => {
   return useMutation({
      mutationFn: (email: string) => resendConfirmationEmail(email)
   })
 }
 export const useverifyEmailMutation = () => {
   return useMutation({
      mutationFn: (token: string) => verifyEmail(token)
   })
 }