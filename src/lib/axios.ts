import axios from "axios";

export const apiClient = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_BASE_URL,
    withCredentials: true,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});

apiClient.interceptors.response.use(
    response => response,
    error => {
        if (error.response) {
            const {status, data} = error.response;

            throw new ApiError(
                data?.message || 'An error occurred',
                status,
                data?.code,
                data?.errors
            )
        } else if (error.request) {
            // Request made but no response
            throw new ApiError('No response from server. Check your internet connection', 0, 'NETWORK_ERROR');
            
        } else {
            throw new ApiError(error.message || 'Request failed', 0, 'Something happened')
        }
    }
)

export class ApiError extends Error {
    constructor(
        message: string,
        public status?: number,
        public code?: string,
        public errors?: Record<string, string[]>
        
    ) {
        super(message);
        this.name = 'Api Error'
    }
}