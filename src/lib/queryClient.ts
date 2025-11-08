import { toast } from "@/hooks/use-toast";
import { ApiError } from "./axios"
import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";


const handleError = async (error: unknown) => {
    if (error instanceof ApiError) {
        switch (error.status) {
            case 401:
                 if (window.location.pathname !== '/sign-in') {
                     window.location.pathname = '/sign-in'
                     return toast({title: 'Session expired. Please log in again',variant:'destructive'})
                 }
                 return toast({title: error.message, variant: 'destructive'});
            case 403:
                return toast({title: "You don't have permission to perform this action", variant: 'destructive'})
            case 500:
                return toast({title: 'Server error. please try again later.', variant: 'destructive'});
            default:
                return toast({variant: 'destructive',title: error.message})
        }
    } else {
        return toast({title: 'An unexpected error occurred.', variant: 'destructive'})
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