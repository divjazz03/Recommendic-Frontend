import { NewUser, TypeOfUser, SigninUserData } from "@/types";
import { 
    useQuery,
    useMutation,
    useQueryClient,
    useInfiniteQuery
 } from "@tanstack/react-query";
import { createNewUser, signinUser } from "../backend_api";

 type MutationFnProps = {
    typeOfUser: TypeOfUser,
    userData: NewUser
 }
 export const useCreateUserMutation = () => {
    
    return useMutation({
        mutationFn: (mutationFnProp: MutationFnProps) => createNewUser(mutationFnProp.typeOfUser, mutationFnProp.userData)
    });
 }

 export const useSignInUserMutation = () => {

    return useMutation({
        mutationFn: (userData: SigninUserData) => signinUser(userData)
    });
 }