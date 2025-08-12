import { NewUser, RecurrenceRule, Response, Schedule, SignUpResponse } from "@/types";
import { apiClient } from "../utils/utils";
import { NewSchedule } from "@/components/consultant/ConsultantNewSchedule";
import { ModifyingSchedule } from "@/components/consultant/ConsultantModifySchedule";

const apiUrl = import.meta.env.VITE_BACKEND_BASE_URL;
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

interface SchedulesResponse extends Response {
    data: Schedule[]
}
interface ScheduleResponse extends Response {
    data: Schedule;
}

export async function sendConsultantOnboardingData(medicalSpecialization: string, userId: string) {
    let result = await apiClient.post(`${apiUrl}${consultantBasePath}/${userId}/onboard`, { medicalSpecialization: medicalSpecialization })
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

export async function deleteConsultant(consultantId: string): Promise<Response> {
    let result = await apiClient.delete(`${apiUrl}${consultantBasePath}/${consultantId}`)
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

export async function getAllConsultants(params: { page?: number, size?: number, sort?: boolean }): Promise<any> {
    let result = await apiClient.get(`${apiUrl}${consultantBasePath}`, { params: params })
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

export async function createNewConsultant(
    userData: NewUser) {
    let result = Promise.resolve<SignUpResponse | null>(null);

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
    result = apiClient.post(`${apiUrl}${consultantBasePath}`, consultantData, {
        headers: {
            'Content-Type': 'application/json'
        }
    })
        .then((response) => response.data)
        .catch((error) => {
            if (apiClient.isAxiosError(error)) {
                console.error(error)
                throw error;
            }
            else {
                throw new Error(error);
            }
        })
    return result;
}

export async function createNewSchedule(schedule: NewSchedule): Promise<ScheduleCreationResponse> {
    return apiClient.post(`${apiUrl}${scheduleBasePath}`, schedule, {
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => response.data)
        .catch(error => {
            if (apiClient.isAxiosError(error)) {
                console.error(error)
                throw error;
            }
            else {
                throw new Error(error);
            }
        });

}

export async function getMySchedules(): Promise<SchedulesResponse> {
    return apiClient.get(`${apiUrl}${scheduleBasePath}/me`)
    .then(response => response.data)
    .catch(error => {
        if (apiClient.isAxiosError(error)) {
            console.error(error)
            throw error;
        } else {
            throw new Error(error)
        }
    })
}

export async function getScheduleById(id: number): Promise<ScheduleResponse> {
    return apiClient.get(`${apiUrl}${scheduleBasePath}/${id}`)
    .then(response => response.data)
    .catch(error => {
        if (apiClient.isAxiosError(error)) {
            console.error(error)
            throw error;
        } else {
            throw new Error(error)
        }
    })
}

export async function updateSchedule(id: number, schedule: ModifyingSchedule): Promise<ScheduleResponse> {
    return apiClient.patch(`${apiUrl}${scheduleBasePath}/${id}`, 
        schedule, 
        {
            headers: {
                'Content-Type': 'application/json' 
            }
        })
        .then((response) => response.data)
        .catch((error) => {
            if (apiClient.isAxiosError(error)) {
                console.error(error)
                throw error;
            }
            else {
                throw new Error(error);
            }
        })
}
export async function deleteSchedule(id: number): Promise<Response> {
    return apiClient.delete(`${apiUrl}${scheduleBasePath}/${id}`)
    .then(response => response.data.data)
    .catch((error) => {
            if (apiClient.isAxiosError(error)) {
                console.error(error)
                throw error;
            }
            else {
                throw new Error(error);
            }
        })
}