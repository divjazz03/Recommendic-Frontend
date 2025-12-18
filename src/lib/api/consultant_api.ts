import {
  Address,
  ConsultantEducation,
  NewUser,
  NotificationContext,
  PagedResponse,
  RecurrenceRule,
  Response,
  Schedule,
  SignUpResponse,
  UserName,
} from "@/types";
import { ModifyingSchedule } from "@/components/consultant/ConsultantModifySchedule";
import { apiClient } from "../axios";
import { NewSchedule } from "@/hooks/useConsultantSchedule";
import { ConsultantOnboardingData } from "@/components/consultant/ConsultantOnboarding";
import { ConsultationChannel } from "@/hooks/usePatientSchedules";

const consultantBasePath = import.meta.env.VITE_CONSULTANT_BASE;
const scheduleBasePath = import.meta.env.VITE_SCHEDULE_BASE;
const appointmentBasePath = import.meta.env.VITE_APPOINTMENT_BASE;
const dashboardBasePath = import.meta.env.VITE_DASHBOARD_BASE;

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
  };
}

export interface NewScheduleRequest {
  name: string;
  startTime: string;
  endTime: string;
  recurrenceRule?: RecurrenceRule;
  channels: string[];
  isActive: boolean;
  zoneOffset: string;
}

interface ScheduleResponse extends Response {
  data: Schedule;
}

export async function sendConsultantOnboardingData(
  data: ConsultantOnboardingData,
  userId: string
) {
  let result = await apiClient
    .post(`${consultantBasePath}/${userId}/onboard`, data)
    .then((response) => response.data);
  return result;
}

export async function deleteConsultant(
  consultantId: string
): Promise<Response> {
  let result = await apiClient
    .delete(`${consultantBasePath}/${consultantId}`)
    .then((response) => response.data);
  return result;
}

export async function getAllConsultants(params: {
  page?: number;
  size?: number;
  sort?: boolean;
}): Promise<any> {
  let result = await apiClient
    .get(`${consultantBasePath}`, { params: params })
    .then((response) => response.data);

  return result;
}

export async function createNewConsultant(userData: NewUser) {
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
  };
  result = apiClient
    .post(`${consultantBasePath}`, consultantData, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((response) => response.data);
  return result;
}

export async function createNewSchedule(
  schedules: NewSchedule[]
): Promise<ScheduleCreationResponse> {
  const scheduleRequests: NewScheduleRequest[] = schedules.map((schedule) => {
    const formattedEndTime = formatToUTCTime(schedule.endTime);
    const formattedStartTime = formatToUTCTime(schedule.startTime);
    const offset = getCurrentTimeOffset();
    return {
      channels: schedule.channels,
      endTime: formattedEndTime,
      startTime: formattedStartTime,
      zoneOffset: offset,
      isActive: schedule.isActive,
      name: schedule.name,
      recurrenceRule: schedule.recurrenceRule,
    };
  });
  return apiClient
    .post(`${scheduleBasePath}`, scheduleRequests, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((response) => response.data);
}
function getCurrentTimeOffset() {
  const date = new Date();
  // getTimezoneOffset() returns the difference in minutes from UTC,
  // where positive values are West of GMT, so we invert the sign.
  const offsetMinutes = -date.getTimezoneOffset();

  const sign = offsetMinutes >= 0 ? "+" : "-";
  const absOffsetMinutes = Math.abs(offsetMinutes);
  const hours = Math.floor(absOffsetMinutes / 60);
  const minutes = absOffsetMinutes % 60;

  // Pad hours and minutes with leading zeros if necessary
  const formattedHours = String(hours).padStart(2, "0");
  const formattedMinutes = String(minutes).padStart(2, "0");

  return `${sign}${formattedHours}:${formattedMinutes}`;
}
const formatToUTCTime = (time: string) => {
  const mockDate = "2019-12-02";
  const date = new Date(`${mockDate}T${time}`);
  const hour = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  const seconds = date.getUTCSeconds();
  const formattedTime = `${String(hour).padStart(2, "0")}:${String(
    minutes
  ).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  return formattedTime;
};

export async function getMySchedules(): Promise<PagedResponse<Schedule>> {
  return apiClient
    .get(`${scheduleBasePath}/me`)
    .then((response) => response.data);
}

export async function getScheduleById(id: string): Promise<ScheduleResponse> {
  return apiClient
    .get(`${scheduleBasePath}/${id}`)
    .then((response) => response.data);
}

export async function updateSchedule(
  id: string,
  schedule: ModifyingSchedule
): Promise<ScheduleResponse> {
  return apiClient
    .patch(`${scheduleBasePath}/${id}`, schedule, {
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then((response) => response.data);
}
export async function deleteSchedule(id: string): Promise<Response> {
  return apiClient
    .delete(`${scheduleBasePath}/${id}`)
    .then((response) => response.data.data);
}

export interface ProfileDetails {
  profile: {
    userName: UserName;
    email: string;
    phoneNumber: string;
    dateOfBirth: string;
    gender: string;
    location: string;
    address: Address;
    specialty: string;
    experience: string;
    languages: string[];
    bio: string;
    subSpecialties: string[];
    medicalLicenseNumber: string;
    profileImgUrl?: string;
    boardCertification?: string
  };
  education: ConsultantEducation;
}

export interface ProfileDetailsResponse extends Response {
  data: ProfileDetails;
}

export async function getMyProfileDetails(): Promise<ProfileDetailsResponse> {
  return apiClient
    .get(`${consultantBasePath}/profiles/details`)
    .then((response) => response.data);
}
export interface ConsultantProfile {
  userName: UserName;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  gender: string;
  location: string;
  address: Address;
  specialty: string;
  subSpecialty: string;
  experience: string;
  bio: string;
  languages: string[];
  profileImgUrl: string;
}
export interface ConsultantProfileUpdateRequest {
  education?: Partial<ConsultantEducation>;
  profile?: Partial<ConsultantProfile>;
}

export async function updateConsultantProfileDetails(
  consultantProfile: ConsultantProfileUpdateRequest
): Promise<ProfileDetailsResponse> {
  return apiClient
    .patch(`${consultantBasePath}/profiles`, consultantProfile)
    .then((response) => response.data);
}

export async function confirmAppointment(appointmentId: string, note: string) {
  return apiClient.post(`${appointmentBasePath}/confirm`, {
    appointmentId: appointmentId,
    note: note,
  });
}

export interface ConsultantDashboardResponse extends Response {
  data: {
    yesterdayTodayAppointmentCountDifference: number,
    completedConsultationsTodayCount: number,
    numberOfActivePatients: number,
    numberOfNewPatientThisWeek: number,
    pendingTasks: number,
    highPriorityTasks: number,
    todayAppointments: [
      {
        appointmentId: string,
        consultantFullName: string,
        specialty: string,
        dateTime: string,
        channel: Uppercase<ConsultationChannel>
      }
    ],
    recentUpdates: [
      {
        timestamp: string,
        message: string,
        context: NotificationContext
      }
    ]
  };
}

export async function getMyDashboard(): Promise<ConsultantDashboardResponse> {
  return apiClient.get(`${dashboardBasePath}`);
}
