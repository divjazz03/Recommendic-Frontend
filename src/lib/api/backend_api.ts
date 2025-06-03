import {
    AuthenticatedUserResponse,
    ConsultantInfo,
    MedicalCategoriesResponse,
    NewUser, PatientInfo,
    SignInResponse,
    SigninUserData,
    SignUpResponse,
    TypeOfUser
} from "@/types";
import axios from "axios";
import { getJwtFromAuthorization } from "../utils/utils";

const apiUrl = import.meta.env.VITE_BACKEND_BASE_URL;
const userLoginPath = import.meta.env.VITE_APP_USER_LOGIN;
const userGetPath = import.meta.env.VITE_APP_USER_GET;
const medicalCategoriesPath = import.meta.env.VITE_GET_MEDICAL_CATEGORIES;
const emailConfirmationPath = import.meta.env.VITE_EMAIL_CONFIRMATION;
const retryEmail = import.meta.env.VITE_RETRY_EMAIL;

const createPatientPath = import.meta.env.VITE_PATIENT_SIGN_UP;
const getAllPatientsPath = import.meta.env.VITE_PATIENT_GET_ALL;
const deletePatientPath = import.meta.env.VITE_PATIENT_DELETE;
const patientOnboardingPath = import.meta.env.VITE_PATIENT_ONBOARDING;

const createConsultantPath = import.meta.env.VITE_CONSULTANT_SIGN_UP;
const getAllConsultantsPath = import.meta.env.VITE_CONSULTANT_GET_ALL;
const deleteConsultantPath = import.meta.env.VITE_CONSULTANT_DELETE;
const consultantOnboardingPath = import.meta.env.VITE_CONSULTANT_ONBOARDING;

export async function createNewUser(typeOfUser: TypeOfUser,
    userData: NewUser) {
    let result = Promise.resolve<SignUpResponse | null>(null);
    switch (typeOfUser) {
        case 'Patient':
            const patientData = {
                firstName: userData.firstName,
                lastName: userData.lastName,
                email: userData.email,
                password: userData.password,
                phoneNumber: userData.phoneNumber,
                gender: userData.gender,
                city: userData.city,
                state: userData.state,
                country: userData.country
            }
            result = axios.post(`${apiUrl}${createPatientPath}`, patientData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then((response) => response.data)
            return result;
        case "Consultant":
            const consultantData = {
                firstName: userData.firstName,
                lastName: userData.lastName,
                email: userData.email,
                password: userData.password,
                phoneNumber: userData.phoneNumber,
                gender: userData.gender,
                city: userData.city,
                state: userData.state,
                country: userData.country,
            }
            result = axios.post(`${apiUrl}${createConsultantPath}`, consultantData)
                .then((response) => response.data)
                .catch((error) => {
                    if (axios.isAxiosError(error)) {
                        throw error;
                    }
                    else {
                        throw new Error(error);
                    }
                })
            return result;
        default:
            break;

    }

    return result;
}

export async function signinUser(userData: SigninUserData): Promise<SignInResponse> {
    let result: Promise<SignInResponse> = axios.post(`${apiUrl}${userLoginPath}`, userData)
        .then((response) => {
            const authHeader = response.headers['authorization'];
            const token = getJwtFromAuthorization(authHeader);
            localStorage.setItem('token', token);
            return response.data
        })
        .catch((error) => {
            if (axios.isAxiosError(error)) {
                throw error;
            }
            else {
                throw new Error(error);
            }
        })
    return result;
}

export async function getCurrentUser(): Promise<AuthenticatedUserResponse> {
    let token = localStorage.getItem('token');
    let result: Promise<AuthenticatedUserResponse> =
        axios.get(`${apiUrl}${userGetPath}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            withCredentials: true
        })
            .then(response => response.data)
            .catch((error) => {
                if (axios.isAxiosError(error)) {
                    throw error;
                }
                else {
                    throw new Error(error);
                }
            })
    return result;
}

export async function getAllSupportedMedicalCategories(): Promise<MedicalCategoriesResponse> {
    let result: Promise<MedicalCategoriesResponse> = axios.get(`${apiUrl}${medicalCategoriesPath}`)
        .then(response => {
            console.log(response.data)
            return response.data
        })
        .catch((error) => {
            if (axios.isAxiosError(error)) {
                throw error;
            }
            else {
                throw new Error(error);
            }
        })
    return result;
}
export async function resendConfirmationEmail(userEmail: string): Promise<string> {
    let result = axios.post(`${apiUrl}${retryEmail}`, { email: userEmail })
        .then(response => response.data)
        .catch((error) => {
            if (axios.isAxiosError(error)) {
                throw error;
            }
            else {
                throw new Error(error);
            }
        })
    return result;
}

export async function verifyEmail(token: string): Promise<string> {
    let result = axios.post(`${apiUrl}${emailConfirmationPath}?token=${token}`)
        .then(response => response.data)
        .catch((error) => {
            if (axios.isAxiosError(error)) {
                throw error;
            }
            else {
                throw new Error(error);
            }
        })
    return result;
}

export async function doGlobalSearch(query: string) {
    let result = axios.get(`${apiUrl}/search/${query}`)
        .then(response => response.data)
        .catch((error) => {
            if (axios.isAxiosError(error)) {
                throw error;
            }
            else {
                throw new Error(error);
            }
        })

}

export async function getAllPatients(params: { page?: number, size?: number, sort?: boolean }): Promise<PatientInfo[]> {
    let result = await axios.get(`${apiUrl}${getAllPatientsPath}`, { params: params })
        .then(response => response.data)
        .catch((error) => {
            if (axios.isAxiosError(error)) {
                throw error;
            }
            else {
                throw new Error(error);
            }
        })

    return result;
}
export async function getAllConsultants(params: { page?: number, size?: number, sort?: boolean }): Promise<ConsultantInfo[]> {
    let result = await axios.get(`${apiUrl}${getAllConsultantsPath}`, { params: params })
        .then(response => response.data)
        .catch((error) => {
            if (axios.isAxiosError(error)) {
                throw error;
            }
            else {
                throw new Error(error);
            }
        })

    return result;
}

export async function deletePatient(patientId: string): Promise<Response> {
    let result = await axios.delete(`${apiUrl}${deletePatientPath}`, { params: { patient_Id: patientId } })
        .then(response => response.data)
        .catch((error) => {
            if (axios.isAxiosError(error)) {
                throw error;
            }
            else {
                throw new Error(error);
            }
        })
    return result;
}
export async function deleteConsultant(consultantId: string): Promise<Response> {
    let result = await axios.delete(`${apiUrl}${deleteConsultantPath}`, { params: { consultant_id: consultantId } })
        .then(response => response.data)
        .catch((error) => {
            if (axios.isAxiosError(error)) {
                throw error;
            }
            else {
                throw new Error(error);
            }
        })
    return result;
}

export async function sendPatientOnboardingData(medicalCategories: string[], userId: string): Promise<Response> {
    let token = localStorage.getItem('token');
    let result = await axios.put(
        `${apiUrl}${patientOnboardingPath}${userId}`,
        { medicalCategories: medicalCategories },
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        .then(response => response.data)
        .catch((error) => {
            if (axios.isAxiosError(error)) {
                throw error;
            }
            else {
                throw new Error(error);
            }
        })
    return result;

}
export async function sendConsultantOnboardingData(medicalSpecialization: string, userId: string) {
    let result = await axios.put(`${apiUrl}${consultantOnboardingPath}`, { medicalSpecialization: medicalSpecialization })
        .then(response => response.data)
        .catch((error) => {
            if (axios.isAxiosError(error)) {
                throw error;
            }
            else {
                throw new Error(error);
            }
        })
    return result;

}


