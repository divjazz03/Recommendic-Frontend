import { AuthenticatedUserResponse, NewUser, SignInResponse, SigninUserData, SignUpResponse, TypeOfUser } from "@/types";
import axios from "axios";
import { error } from "console";
import { boolean } from "zod";
const apiUrl = import.meta.env.VITE_BACKEND_BASE_URL;
const createConsultantPath = import.meta.env.VITE_CONSULTANT_SIGN_UP_PATH;
const createPatientPath = import.meta.env.VITE_PATIENT_SIGN_UP_PATH;
const userLoginPath = import.meta.env.VITE_APP_USER_LOGIN_PATH;
const userGetPath = import.meta.env.VITE_GET_USER_PATH;

export async function createNewUser(typeOfUser: TypeOfUser,
    userData: NewUser) {
    let result = Promise.resolve<SignUpResponse>(null);
    switch (typeOfUser) {
        case 'Patient':
            const patientData = {
                firstName: userData.firstName,
                lastName: userData.lastName,
                email: userData.email,
                password: userData.password,
                phoneNumber: userData.phoneNumber,
                gender: userData.gender,
                zipCode: userData.zipCode,
                city: userData.city,
                state: userData.state,
                country: userData.country,
                categoriesOfInterest: userData.categoryOfInterest
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
                zipCode: userData.zipCode,
                city: userData.city,
                state: userData.state,
                country: userData.country,
                medicalSpecialization: userData.medicalSpecialization
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

export async function signinUser(userData: SigninUserData) {
    let result: Promise<SignInResponse | null> = axios.post(`${apiUrl}${userLoginPath}`, userData)
        .then((response) => response.data)
        .catch((error) => console.log(error))
    return result;
}
export async function getCurrentUser(): Promise<AuthenticatedUserResponse | null> {

    let result: Promise<AuthenticatedUserResponse> = axios.get(`${apiUrl}${userGetPath}`)
        .then(response => response.data)
        .catch(error => null)
    return result;
}