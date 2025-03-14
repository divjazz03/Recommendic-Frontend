import { AuthenticatedUserResponse, MedicalCategoriesResponse, NewUser, SignInResponse, SigninUserData, SignUpResponse, TypeOfUser } from "@/types";
import axios from "axios";

const apiUrl = import.meta.env.VITE_BACKEND_BASE_URL;
const createConsultantPath = import.meta.env.VITE_CONSULTANT_SIGN_UP_PATH;
const createPatientPath = import.meta.env.VITE_PATIENT_SIGN_UP_PATH;
const userLoginPath = import.meta.env.VITE_APP_USER_LOGIN_PATH;
const userGetPath = import.meta.env.VITE_GET_USER_PATH;
const medicalCategoriesPath = import.meta.env.VITE_GET_MEDICAL_CATEGORIES;
const retryEmail = import.meta.env.VITE_RETRY_EMAIL;

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
                .catch((error) => null);
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
                .catch((error) => null);
            return result;
        default:
            break;

    }

    return result;
}

export async function signinUser(userData: SigninUserData): Promise<SignInResponse | null> {
    let result: Promise<SignInResponse | null> = axios.post(`${apiUrl}${userLoginPath}`, userData)
        .then((response) => response.data)
        .catch((error) => null)
    return result;
}

export async function getCurrentUser(): Promise<AuthenticatedUserResponse | null> {

    let result: Promise<AuthenticatedUserResponse> = axios.get(`${apiUrl}${userGetPath}`)
        .then(response => response.data)
        .catch(error => null)
    return result;
}

export async function getAllSupportedMedicalCategories(): Promise<MedicalCategoriesResponse> {
    let result: Promise<MedicalCategoriesResponse> = axios.get(`${apiUrl}${medicalCategoriesPath}`)
        .then(response => {
            console.log(response.data)
            return response.data
        })
        .catch(error => {
            console.log(error)
        })
    return result;
}
export async function resendConfirmationEmail(userEmail: string) {
    let result = axios.post(`${apiUrl}${retryEmail}`, { email: userEmail })
        .then(response => response.data)
        .catch(error => console.log(error))
    return result;
}

export async function verifyEmail(token: string) {
    let result = axios.post(`${apiUrl}${retryEmail}`, { token: token })
        .then(response => response.data)
        .catch(error => console.log(error))
    return result;
}