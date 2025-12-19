import { toast } from "sonner";
import { ApiError } from "./axios"
import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";


const handleError = async (error: unknown) => {

    if (error instanceof ApiError) {
        const apiError = error as ApiError
        console.log(apiError.status)
        switch (apiError.status) {
            case 401:
                if (window.location.pathname !== '/sign-in') {
                    toast.error('Session expired. Please log in again')
                } else {
                    toast.error(apiError.message);
                }
                break
            case 403:
                toast.error("You don't have permission to perform this action")
                break
            case 500:
                toast.error('Server error. please try again later.');
                break
            case 400:
                break
            default:
                toast.error(error.message)
                break;
        }
    } else {
        toast.error(`somthing happened: ${error}`)
    }
}

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: (failureCount, error) => {
                // Don't retry on 4xx errors
                if (error instanceof ApiError && error.status && error.status >= 400 && error.status < 500) {
                    return false
                }
                return failureCount < 2;
            },
            staleTime: 5 * 60 * 1000,
            refetchOnWindowFocus: false,
        },
        mutations: {
            retry: false
        },
    },
    queryCache: new QueryCache({ onError: (error) => handleError(error) }),
    mutationCache: new MutationCache({ onError: (error) => handleError(error) })
})