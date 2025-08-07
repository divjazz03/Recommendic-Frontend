import {
    AuthenticatedUserResponse,
    MedicalCategoriesResponse,
    SignInResponse,
    SigninUserData,
} from "@/types";
import { apiClient } from "../utils";


const userLoginPath = import.meta.env.VITE_APP_USER_LOGIN;
const userGetPath = import.meta.env.VITE_CURRENT_AUTH_USER;
const medicalCategoriesPath = import.meta.env.VITE_GET_MEDICAL_CATEGORIES;
const emailConfirmationPath = import.meta.env.VITE_EMAIL_CONFIRMATION;
const retryEmail = import.meta.env.VITE_RETRY_EMAIL;
const apiUrl = import.meta.env.VITE_BACKEND_BASE_URL;





export async function signinUser(userData: SigninUserData): Promise<SignInResponse> {
    let result: Promise<SignInResponse> = apiClient.post(`${apiUrl}${userLoginPath}`, userData)
        .then((response) => response.data
        )
        .catch((error) => {
            if (apiClient.isAxiosError(error)) {
                throw error;
            }
            else {
                throw new Error(error);
            }
        })
    return result;
}

export async function getCurrentUser(): Promise<AuthenticatedUserResponse> {
    let result: Promise<AuthenticatedUserResponse> =
        apiClient.get(`${apiUrl}${userGetPath}`, {
            withCredentials: true
        })
            .then(response => response.data)
            .catch((error) => {
                if (apiClient.isAxiosError(error)) {
                    throw error;
                }
                else {
                    throw new Error(error);
                }
            })
    return result;
}

export async function getAllSupportedMedicalCategories(): Promise<MedicalCategoriesResponse> {
    let result: Promise<MedicalCategoriesResponse> = apiClient.get(`${apiUrl}${medicalCategoriesPath}`)
        .then(response => {
            console.log(response.data)
            return response.data
        })
        .catch((error) => {
            if (apiClient.isAxiosError(error)) {
                throw error;
            }
            else {
                throw new Error(error);
            }
        })
    return result;
}
export async function resendConfirmationEmail(userEmail: string): Promise<string> {
    let result = apiClient.post(`${apiUrl}${retryEmail}`, { email: userEmail })
        .then(response => response.data)
        .catch((error) => {
            if (apiClient.isAxiosError(error)) {
                throw error;
            }
            else {
                throw new Error(error);
            }
        })
    return result;
}

export async function verifyEmail(token: string): Promise<string> {
    let result = apiClient.post(`${apiUrl}${emailConfirmationPath}?token=${token}`)
        .then(response => response.data)
        .catch((error) => {
            if (apiClient.isAxiosError(error)) {
                throw error;
            }
            else {
                throw new Error(error);
            }
        })
    return result;
}

export async function doGlobalSearch(query: string) {
    let result = apiClient.get(`${apiUrl}/search/${query}`)
        .then(response => response.data)
        .catch((error) => {
            if (apiClient.isAxiosError(error)) {
                throw error;
            }
            else {
                throw new Error(error);
            }
        })

}





