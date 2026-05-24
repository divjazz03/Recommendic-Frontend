import {
  Address,
  ConsultantEducation,
  ConsultantSchedulesResponse,
  ConsultantStats,
  ConsultantTypeMinimal,
  NewUser,
  NotificationContext,
  PagedResponse,
  Response,
  Review,
  SignUpResponse,
  UserName,
} from "@/types";
import { apiClient } from "../axios";
import { ModifyingProfileData } from "@/hooks/useProfile";
import { PatientOnboardingData } from "@/components/patient/PatientOnboarding";
import { ConsultationChannel, TimeSlot } from "@/hooks/usePatientSchedules";

const patientPath = import.meta.env.VITE_PATIENT_BASE;
const schedulesPath = import.meta.env.VITE_SCHEDULE_BASE;
const appointmentsPath = import.meta.env.VITE_APPOINTMENT_BASE;
const dashBoardPath = import.meta.env.VITE_DASHBOARD_BASE;

console.log(patientPath);

export async function createNewPatient(userData: NewUser) {
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
    country: userData.country,
  };
  result = apiClient
    .post(`${patientPath}`, patientData)
    .then((response) => response.data);
  return result;
}

export async function getAllPatients(
  params: {
    page?: number;
    size?: number;
    sort?: boolean;
  },
  accessToken: string | null,
): Promise<unknown> {
  const result = await apiClient
    .get(`${patientPath}`, {
      params: params,
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    .then((response) => response.data);

  return result;
}

export async function deletePatient(
  patientId: string,
  accessToken: string | null,
): Promise<Response> {
  const result = await apiClient
    .delete(`${patientPath}/${patientId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    .then((response) => response.data);
  return result;
}

export async function sendPatientOnboardingData(
  data: PatientOnboardingData,
  userId: string,
  accessToken: string | null,
): Promise<Response> {
  const result = await apiClient
    .post(`${patientPath}/${userId}/onboard`, data, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((response) => response.data);
  return result;
}

export async function getRecommendedConsultants(
  pageNumber: number,
  accessToken: string | null,
): Promise<PagedResponse<ConsultantTypeMinimal>> {
  const result = await apiClient
    .get(`${patientPath}/recommendations/consultants`, {
      params: { page: pageNumber },
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    .then((response) => response.data);

  return result;
}

export async function getConsultantSchedules(
  consultantId: string,
  date: string,
  accessToken: string | null,
): Promise<ConsultantSchedulesResponse> {
  const result = await apiClient
    .get(`${schedulesPath}/consultant/${consultantId}?date=${date}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    .then((response) => response.data);
  return result;
}

interface PatientProfile {
  userName: UserName;
  email: string;
  phoneNumber: string;
  dateOfBirth: string;
  gender: string;
  location: string;
  address: Address;
  interests: string[];
  bloodType: string;
  profileImgUrl?: string;
}

export interface PatientProfileDetailsResponse extends Response {
  data: PatientProfile;
}

export async function getMyProfileDetails(
  accessToken: string | null,
): Promise<PatientProfileDetailsResponse> {
  return apiClient
    .get(`${patientPath}/profiles/details`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    .then((response) => response.data);
}

export async function updateProfileData(
  patientProfileData: ModifyingProfileData,
  accessToken: string | null,
): Promise<PatientProfileDetailsResponse> {
  return apiClient
    .patch(`${patientPath}/profiles`, patientProfileData, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    .then((response) => response.data);
}

export interface ConsultantFullProfileDetails {
  id: string;
  name: string;
  title?: string;
  rating?: number;
  totalReviews?: number;
  bio?: string;
  experience?: number;
  location?: string;
  image?: string;
  specializations?: string[];
  languages?: string[];
  fee?: number;
  educations?: ConsultantEducation[];
  stats?: ConsultantStats;
  availableSlots?: TimeSlot[];
  reviews?: Review[];
  profileImgUrl?: string;
}
interface ConsultantFullProfileDetailsResponse extends Response {
  data: ConsultantFullProfileDetails;
}

export async function getConsultantFullProfileDetails(
  consultantId: string,
  accessToken: string | null,
): Promise<ConsultantFullProfileDetailsResponse> {
  return apiClient
    .get(`${patientPath}/profiles/consultants/details/${consultantId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    .then((response) => response.data);
}

export interface AppointmentCreationRequest {
  consultantId: string;
  scheduleId: string;
  channel: string;
  date: string;
  reason: string;
}

export async function createAnAppointment(
  appointmentCreationRequest: AppointmentCreationRequest,
  accessToken: string | null,
) {
  console.log("started creating appointment");
  return apiClient
    .post(`${appointmentsPath}`, appointmentCreationRequest, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    .then((response) => response.data);
}

export interface PatientDashboardResponse extends Response {
  data: {
    appointmentsToday: [
      {
        appointmentId: string;
        consultantFullName: string;
        specialty: string;
        dateTime: string;
        channel: Uppercase<ConsultationChannel>;
        status: string;
      },
    ];
    recentActivities: [
      {
        activityId: string;
        title: string;
        dateTime: string;
        context: NotificationContext;
      },
    ];
    medications: [
      {
        medicationId: string;
        name: string;
        dosageQuantity: string;
        dosageFrequency: string;
        nextDoseDateTime: string;
      },
    ];
  };
}
export async function getMyDashboard(
  accessToken: string | null,
): Promise<PatientDashboardResponse> {
  return apiClient
    .get(`${dashBoardPath}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    })
    .then((response) => response.data);
}
