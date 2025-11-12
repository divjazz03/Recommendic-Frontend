import { toast } from "sonner";
import { ApiError } from "./axios"
import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";


const handleError = async (error: unknown) => {
    if (error instanceof ApiError) {
        switch (error.status) {
            case 401:
                 if (window.location.pathname !== '/sign-in') {
                     window.location.pathname = '/sign-in'
                     return toast.error('Session expired. Please log in again')
                 }
                 return toast.error(error.message);
            case 403:
                return toast.error("You don't have permission to perform this action")
            case 500:
                return toast.error('Server error. please try again later.');
            default:
                break;
        }
    } else {
        return toast.error('An unexpected error occurred.')
    }
};

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
    queryCache: new QueryCache({onError: (error) => handleError(error)}),
    mutationCache: new MutationCache({onError: (error) => handleError(error)})
})