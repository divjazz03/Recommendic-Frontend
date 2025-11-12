import { Address, ConsultantEducation, ConsultantSchedulesResponse, ConsultantStats, ConsultantTypeMinimal, NewUser, PagedResponse, Response, Review, Schedule, SignUpResponse, UserName } from "@/types";
import { apiClient } from "../axios";
import { ModifyingProfileData } from "@/hooks/useProfile";
import { SlotResponse } from "./general_api";

const patientPath = import.meta.env.VITE_PATIENT_BASE;
const schedulesPath = import.meta.env.VITE_SCHEDULE_BASE;
const appointmentsPath = import.meta.env.VITE_APPOINTMENT_BASE;

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
    result = apiClient.post(`${patientPath}`, patientData)
        .then((response) => response.data)
    return result;
}

export async function getAllPatients(params: { page?: number, size?: number, sort?: boolean }): Promise<any> {
    let result = await apiClient.get(`${patientPath}`, { params: params })
        .then(response => response.data)

    return result;
}


export async function deletePatient(patientId: string): Promise<Response> {
    let result = await apiClient.delete(`${patientPath}/${patientId}`)
        .then(response => response.data)
    return result;
}


export async function sendPatientOnboardingData(medicalCategories: string[], userId: string): Promise<Response> {
    let result = await apiClient.post(
        `${patientPath}/${userId}/onboard`,
        { medicalCategories: medicalCategories },)
        .then(response => response.data)
    return result;

}


export async function getRecommendedConsultants(): Promise<PagedResponse<ConsultantTypeMinimal>> {
    let result = await apiClient.get(`${patientPath}/recommendations/consultants`)
        .then(response => response.data)

    return result
}


export async function getConsultantSchedules(consultantId: string, date: string): Promise<ConsultantSchedulesResponse> {
    let result = await apiClient.get(`${schedulesPath}/consultant/${consultantId}?date=${date}`)
        .then(response => response.data)
    return result;
}

interface PatientProfile {
        userName: UserName
        email: string
        phoneNumber: string,
        dateOfBirth: string,
        gender: string,
        location: string,
        address: Address,
        interests: string[],
}

export interface PatientProfileDetailsResponse extends Response {
    data: PatientProfile
}

export async function getMyProfileDetails(): Promise<PatientProfileDetailsResponse> {
    return apiClient.get(`${patientPath}/profiles/details`)
        .then(response => response.data)
        
}


export async function updateProfileData(patientProfileData: ModifyingProfileData): Promise<PatientProfileDetailsResponse> {
    return apiClient.patch(`${patientPath}/profiles`, patientProfileData)
        .then(response => response.data)
}

export interface ConsultantFullProfileDetails {
    id: string,
    name: string,
    title?: string,
    rating?: number,
    totalReviews?: number,
    bio?: string,
    experience?: number,
    location?: string,
    image?: string,
    specializations?: string[],
    languages?: string[],
    fee?: number,
    educations?: ConsultantEducation[],
    stats?: ConsultantStats,
    availableSlots?: SlotResponse[],
    reviews?: Review[]
}
interface ConsultantFullProfileDetailsResponse extends Response{
    data: ConsultantFullProfileDetails
    
}

export async function getConsultantFullProfileDetails(consultantId: string): Promise<ConsultantFullProfileDetailsResponse> {
    return apiClient.get(`${patientPath}/profiles/consultants/details/${consultantId}`)
    .then(response => response.data)
}


export interface AppointmentCreationRequest {
    consultantId: string,
    scheduleId: string,
    channel: string,
    date: string,
    reason: string
}

export async function createAnAppointment(appointmentCreationRequest: AppointmentCreationRequest) {
    console.log("started creating appointment");
    return apiClient.post(`${appointmentsPath}`, appointmentCreationRequest)
    .then(response => response.data)
}