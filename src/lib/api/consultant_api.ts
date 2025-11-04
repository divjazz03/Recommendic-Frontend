import { Address, ConsultantEducation, NewUser, RecurrenceRule, Response, Schedule, SignUpResponse, UserName } from "@/types";
import { NewSchedule } from "@/components/consultant/ConsultantNewSchedule";
import { ModifyingSchedule } from "@/components/consultant/ConsultantModifySchedule";
import { apiClient } from "../axios";


const consultantBasePath = import.meta.env.VITE_CONSULTANT_BASE;
const scheduleBasePath = import.meta.env.VITE_SCHEDULE_BASE;

interface ScheduleCreationResponse extends Response {
    data: {
        id: number;
        name: string;
        startTime: string;
        endTime: string;
        isRecurring: boolean;
        channels: string[];
        recurrenceRule: RecurrenceRule;
        isActive: boolean;
        createdAt: string;
    }
}

export interface SchedulesResponse extends Response {
    data: Schedule[]
}
interface ScheduleResponse extends Response {
    data: Schedule;
}

export async function sendConsultantOnboardingData(medicalSpecialization: string, userId: string) {
    let result = await apiClient.post(`${consultantBasePath}/${userId}/onboard`, { medicalSpecialization: medicalSpecialization })
        .then(response => response.data)
    return result;

}

export async function deleteConsultant(consultantId: string): Promise<Response> {
    let result = await apiClient.delete(`${consultantBasePath}/${consultantId}`)
        .then(response => response.data)
    return result;
}

export async function getAllConsultants(params: { page?: number, size?: number, sort?: boolean }): Promise<any> {
    let result = await apiClient.get(`${consultantBasePath}`, { params: params })
        .then(response => response.data)

    return result;
}

export async function createNewConsultant(
    userData: NewUser) {
    let result = Promise.resolve<SignUpResponse | null>(null);

    const consultantData = {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: userData.password,
        dateOfBirth: userData.dateOfBirth,
        gender: userData.gender,
        city: userData.city,
        state: userData.state,
        country: userData.country,
    }
    result = apiClient.post(`${consultantBasePath}`, consultantData, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then((response) => response.data)
    return result;
}

export async function createNewSchedule(schedules: NewSchedule[]): Promise<ScheduleCreationResponse> {
    return apiClient.post(`${scheduleBasePath}`, schedules, {
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => response.data)

}

export async function getMySchedules(): Promise<SchedulesResponse> {
    return apiClient.get(`${scheduleBasePath}/me`)
        .then(response => response.data)
}

export async function getScheduleById(id: number): Promise<ScheduleResponse> {
    return apiClient.get(`${scheduleBasePath}/${id}`)
        .then(response => response.data)
}

export async function updateSchedule(id: number, schedule: ModifyingSchedule): Promise<ScheduleResponse> {
    return apiClient.patch(`${scheduleBasePath}/${id}`,
        schedule,
        {
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then((response) => response.data)
}
export async function deleteSchedule(id: number): Promise<Response> {
    return apiClient.delete(`${scheduleBasePath}/${id}`)
        .then(response => response.data.data)
}

export interface ProfileDetails {
    profile: {
        userName: UserName
        email: string
        phoneNumber: string,
        dateOfBirth: string,
        gender: string,
        location: string,
        address: Address,
        specialty: string,
        experience: string,
        languages: string[]
        bio: string
    }
    education: ConsultantEducation
}

export interface ProfileDetailsResponse extends Response {
    data: ProfileDetails
}

export async function getMyProfileDetails(): Promise<ProfileDetailsResponse> {
    return apiClient.get(`${consultantBasePath}/profiles/details`)
        .then(response => response.data)


}
export interface ConsultantProfile {
    userName?: UserName
    email?: string
    phoneNumber?: string,
    dateOfBirth?: string,
    gender?: string,
    location?: string,
    address?: Address,
    specialty?: string,
    experience?: string,
    bio?: string,
    languages?: string[]
}
export interface ConsultantProfileUpdateRequest {
    education?: ConsultantEducation
    profile?: ConsultantProfile
}

export async function updateConsultantProfileDetails(consultantProfile: ConsultantProfileUpdateRequest): Promise<ProfileDetailsResponse> {
    return apiClient.patch(`${consultantBasePath}/profiles`,consultantProfile )
    .then(response => response.data);
}