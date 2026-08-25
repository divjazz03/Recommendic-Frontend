import {
  Address,
  ConsultantEducation,
  NewUser,
  NotificationContext,
  PagedResponse,
  RecurrenceRule,
  Response,
  Schedule,
  SecurityPreferences,
  SignUpResponse,
  UserName,
} from "@/types";
import { ModifyingSchedule } from "@/components/consultant/ConsultantModifySchedule";
import { apiClient } from "../axios";
import { NewSchedule } from "@/hooks/useConsultantSchedule";
import { ConsultationChannel } from "@/hooks/usePatientSchedules";
import { ConsultantOnboardingData } from "@/components/consultant/onboarding/ConsultantOnboarding";
import { ConsultantNotificationSetting } from "@/hooks/useNotificationSettings";

const consultantBasePath = import.meta.env.VITE_CONSULTANT_BASE;
const scheduleBasePath = import.meta.env.VITE_SCHEDULE_BASE;
const appointmentBasePath = import.meta.env.VITE_APPOINTMENT_BASE;
const dashboardBasePath = import.meta.env.VITE_DASHBOARD_BASE;
const medicationBasePath = import.meta.env.VITE_MEDICATION_BASE;

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
  recurrenceRule?: Partial<RecurrenceRule>;
  channels: string[];
  isActive: boolean;
  zoneOffset: string;
}

interface ScheduleResponse extends Response {
  data: Schedule;
}

export async function sendConsultantOnboardingData(
  data: ConsultantOnboardingData,
  stage: string,
  accessToken: string | null,
) {
  const result = await apiClient
    .post(`${consultantBasePath}/onboard`, data, {
      params: {
        onboarding_stage: stage,
      },
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((response) => response.data);
  return result;
}

export async function deleteConsultant(
  consultantId: string,
  accessToken: string | null,
): Promise<Response> {
  const result = await apiClient
    .delete(`${consultantBasePath}/${consultantId}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((response) => response.data);
  return result;
}

export async function getAllConsultants(
  params: {
    page?: number;
    size?: number;
    sort?: boolean;
  },
  accessToken: string | null,
): Promise<unknown> {
  const result = await apiClient
    .get(`${consultantBasePath}`, {
      params: params,
      headers: { Authorization: `Bearer ${accessToken}` },
    })
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
  schedules: NewSchedule[],
  accessToken: string | null,
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
        Authorization: `Bearer ${accessToken}`,
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
    minutes,
  ).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  return formattedTime;
};

export async function getMySchedules(
  accessToken: string | null,
): Promise<PagedResponse<Schedule>> {
  return apiClient
    .get(`${scheduleBasePath}/me`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((response) => response.data);
}

export async function getScheduleById(
  id: string,
  accessToken: string | null,
): Promise<ScheduleResponse> {
  return apiClient
    .get(`${scheduleBasePath}/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((response) => response.data);
}

export async function updateSchedule(
  id: string,
  schedule: ModifyingSchedule,
  accessToken: string | null,
): Promise<ScheduleResponse> {
  return apiClient
    .patch(`${scheduleBasePath}/${id}`, schedule, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((response) => response.data);
}
export async function deleteSchedule(
  id: string,
  accessToken: string | null,
): Promise<Response> {
  return apiClient
    .delete(`${scheduleBasePath}/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
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
    boardCertification?: string;
  };
  education: ConsultantEducation;
  notificationPreferences: ConsultantNotificationSetting;
  securityPreferences: SecurityPreferences;
}

export interface Profile {
  userName: UserName;
  profilePicture: {
    name: string;
    pictureUrl: string;
  };
  onboardingStage: string;
  specialty?: string;
}

export interface ProfileDetailsResponse extends Response {
  data: ProfileDetails;
}
interface ProfileResponse extends Response {
  data: Profile;
}

export async function getMyProfileDetails(
  accessToken: string | null,
): Promise<ProfileDetailsResponse> {
  return apiClient
    .get(`${consultantBasePath}/profiles/details`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((response) => response.data);
}
export async function getMyProfile(
  accessToken: string | null,
): Promise<ProfileResponse> {
  return apiClient
    .get(`${consultantBasePath}/profiles`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
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
  notificationPreferences?: Partial<ConsultantNotificationSetting>;
  securityPreferences?: Partial<SecurityPreferences>;
}

export async function updateConsultantProfileDetails(
  consultantProfile: ConsultantProfileUpdateRequest,
  accessToken: string | null,
): Promise<ProfileDetailsResponse> {
  return apiClient
    .patch(`${consultantBasePath}/profiles`, consultantProfile, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((response) => response.data);
}

export async function confirmAppointment(
  appointmentId: string,
  note: string,
  accessToken: string | null,
) {
  return apiClient
    .post(
      `${appointmentBasePath}/confirm`,
      {
        appointmentId: appointmentId,
        note: note,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    )
    .then((response) => response.data);
}

export interface ConsultantDashboardResponse extends Response {
  data: {
    yesterdayTodayAppointmentCountDifference: number;
    completedConsultationsTodayCount: number;
    numberOfActivePatients: number;
    numberOfNewPatientThisWeek: number;
    pendingTasks: number;
    highPriorityTasks: number;
    todayAppointments: [
      {
        appointmentId: string;
        fullName: string;
        specialty: string;
        dateTime: string;
        age: string;
        channel: Uppercase<ConsultationChannel>;
        isFollowUp: boolean;
        status: string;
        isStarted: boolean;
        isEnded: boolean;
      },
    ];
    recentUpdates: [
      {
        timestamp: string;
        message: string;
        context: NotificationContext;
      },
    ];
  };
}

export async function getMyDashboard(
  accessToken: string | null,
): Promise<ConsultantDashboardResponse> {
  return apiClient
    .get(`${dashboardBasePath}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((response) => response.data);
}

export interface PatientMedicalDataResponse extends Response {
  data: {
    age: string;
    id: string;
    consultationId: string;
    name: string;
    gender: string;
    mrn: string;
  };
}
export async function getPatientMedicalData(
  id: string,
  accessToken: string | null,
): Promise<PatientMedicalDataResponse> {
  return apiClient
    .get(`${medicationBasePath}/patient/${id}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((response) => response.data);
}

interface MedicationRequest {
  name: string;
  dosage: string;
  medicationFrequency: string;
  durationValue: number | undefined;
  durationType: string;
  instructions: string;
}
export interface PrescriptionRequest {
  consultationId: string;
  prescribedTo: string;
  diagnosis: string;
  medications: MedicationRequest[];
  notes?: string;
}
interface MedicationResponse {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  startDate: string;
  endDate: string;
  intructions: string;
}
interface ConsultantPrescriptionResponse extends Response {
  data: {
    id: string;
    patientName: string;
    patientAge: string;
    gender: string;
    prescriberId: string;
    prescriberName: string;
    date: string;
    status: string;
    diagnosis: string;
    medications: MedicationResponse[];
    notes: string;
  };
}

export async function createPrescription(
  request: PrescriptionRequest,
  accessToken: string | null,
): Promise<ConsultantPrescriptionResponse> {
  return apiClient
    .post(`${medicationBasePath}`, request, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((response) => response.data);
}
