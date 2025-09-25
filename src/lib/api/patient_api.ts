import { NewUser, SignUpResponse } from "@/types";
import { apiClient } from "../utils/utils";

const patientPath = import.meta.env.VITE_PATIENT_BASE;

export async function createNewPatient(
    userData: NewUser) {
    let result = Promise.resolve<SignUpResponse | null>(null);
    const patientData = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: userData.password,
        dateOfBirth: userData.dateOfBirth,
        gender: userData.gender,
        city: userData.city,
        state: userData.state,
        country: userData.country
    }
    result = apiClient.post(`${patientPath}`, patientData, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then((response) => response.data)
        .catch(error => {
            if (apiClient.isAxiosError(error)) {
                throw error;
            } else {
                throw new Error(error)
            }
        })
    return result;
}

export async function getAllPatients(params: { page?: number, size?: number, sort?: boolean }): Promise<any> {
    let result = await apiClient.get(`${patientPath}`, { params: params })
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


export async function deletePatient(patientId: string): Promise<Response> {
    let result = await apiClient.delete(`${patientPath}/${patientId}`)
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


export async function sendPatientOnboardingData(medicalCategories: string[], userId: string): Promise<Response> {
    let result = await apiClient.post(
        `${patientPath}/${userId}/onboard`,
        { medicalCategories: medicalCategories },)
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