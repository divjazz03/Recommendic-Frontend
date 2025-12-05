import {
    AuthenticatedUserResponse,
    ConsultationResponse,
    MedicalCategoriesResponse,
    PagedResponse,
    SignInResponse,
    SigninUserData,
} from "@/types";
import { SearchResult } from "@/hooks/useSearchResults";
import { ModifyingNotificationSetting, NotificationSetting} from "@/hooks/useNotificationSettings";
import { apiClient } from "../axios";
import { TimeSlot } from "@/hooks/usePatientSchedules";
import { ConsultantAppointmentType, PatientAppointmentType } from "@/hooks/useAppointment";
import axios from "axios";

const userLoginPath = import.meta.env.VITE_APP_USER_LOGIN;
const userLogoutPath = import.meta.env.VITE_APP_USER_LOGOUT;
const userGetPath = import.meta.env.VITE_CURRENT_AUTH_USER;
const medicalCategoriesPath = import.meta.env.VITE_GET_MEDICAL_CATEGORIES;
const emailConfirmationPath = import.meta.env.VITE_EMAIL_CONFIRMATION;
const retryEmail = import.meta.env.VITE_RETRY_EMAIL;
const consultationPath = import.meta.env.VITE_CONSULTATION_BASE;
const notificationPath = import.meta.env.VITE_NOTIFICATION_BASE;
const appointmentsPath = import.meta.env.VITE_APPOINTMENT_BASE;





export async function signinUser(userData: SigninUserData): Promise<SignInResponse> {
    let result: Promise<SignInResponse> = apiClient.post(`${userLoginPath}`, userData)
        .then((response) => response.data
        )
    return result;
}

export async function logoutUser() {
    return apiClient.post(`${userLogoutPath}`)
    .then((response) => response.data)
}

export async function getCurrentUser(): Promise<AuthenticatedUserResponse> {
    return apiClient.get(`${userGetPath}`, {
            withCredentials: true
        })
            .then(response => { 
                console.log(response.data.user)
                return response.data
            })
    
}


export async function getAllSupportedMedicalCategories(): Promise<MedicalCategoriesResponse> {
    let result: Promise<MedicalCategoriesResponse> = apiClient.get(`${medicalCategoriesPath}`)
        .then(response => {
            console.log(response.data)
            return response.data
        })
    return result;
}
export async function resendConfirmationEmail(userEmail: string): Promise<string> {
    let result = apiClient.post(`${retryEmail}`, { email: userEmail })
        .then(response => response.data)
    return result;
}

export async function verifyEmail(token: string): Promise<string> {
    let result = apiClient.post(`${emailConfirmationPath}?token=${token}`)
        .then(response => response.data)
    return result;
}

export async function doGlobalSearch(query: string): Promise<SearchResult[]> {
    return apiClient.get(`/search?query=${query}`)
        .then(response => response.data)

}

export async function startNewConsultation(appointmentId: string): Promise<ConsultationResponse> {
    return apiClient.post(`${consultationPath}/${appointmentId}/start`)
        .then(response => response.data)
}
export async function endConsultation(consultationId: string): Promise<ConsultationResponse> {
    return apiClient.post(`${consultationPath}/${consultationId}/complete`)
        .then(response => response.data)
}

interface NotificationResponse extends Response {
        data: NotificationSetting
}

export async function getMyNotificationSettings(): Promise<NotificationResponse> {
    return apiClient.get(`${notificationPath}/settings`)
    .then(response => response.data)
}

export async function updateMyNotificationSettings(modifiedNotification: ModifyingNotificationSetting): Promise<NotificationResponse> {
    return apiClient.patch(`${notificationPath}/settings`, modifiedNotification)
    .then(response => response.data)
}

interface ScheduleSlotResponse extends Response {
    data: TimeSlot[]
}


export async function getConsultantTimeSlots(consultantId: string, date: string | undefined): Promise<ScheduleSlotResponse> {
    if (!date) {
        return Promise.reject("No date specified")
    }
    return apiClient.get(`${appointmentsPath}/timeslots/${consultantId}`, {params: {date: date}}
    )
    .then(response => response.data)
}

export async function getAppointments(): Promise<PagedResponse<ConsultantAppointmentType | PatientAppointmentType>> {
    return apiClient.get(`${appointmentsPath}`)
    .then(response => response.data)
}

interface ImageUploadSignature {
    timeStamp: number,
    signature: string,
    apiKey: string,
    publicId: string,
    cloudName: string,
    folder: string
}
export async function getUploadSignature(count?: number) :Promise<ImageUploadSignature[]> {
    return apiClient.get(`/cloudinary/signature`,{params:{count: count || 1}})
    .then(response => response.data)
}



