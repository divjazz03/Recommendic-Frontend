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

console.log(patientPath)

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

export async function getAllPatients(params: {
  page?: number;
  size?: number;
  sort?: boolean;
}): Promise<unknown> {
  const result = await apiClient
    .get(`${patientPath}`, { params: params })
    .then((response) => response.data);

  return result;
}

export async function deletePatient(patientId: string): Promise<Response> {
  const result = await apiClient
    .delete(`${patientPath}/${patientId}`)
    .then((response) => response.data);
  return result;
}

export async function sendPatientOnboardingData(
  data: PatientOnboardingData,
  userId: string
): Promise<Response> {
  const result = await apiClient
    .post(`${patientPath}/${userId}/onboard`, data)
    .then((response) => response.data);
  return result;
}

export async function getRecommendedConsultants(
  pageNumber: number
): Promise<PagedResponse<ConsultantTypeMinimal>> {
  const result = await apiClient
    .get(`${patientPath}/recommendations/consultants`, {
      params: {page: pageNumber},
    })
    .then((response) => response.data);

  return result;
}

export async function getConsultantSchedules(
  consultantId: string,
  date: string
): Promise<ConsultantSchedulesResponse> {
  const result = await apiClient
    .get(`${schedulesPath}/consultant/${consultantId}?date=${date}`)
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

export async function getMyProfileDetails(): Promise<PatientProfileDetailsResponse> {
  return apiClient
    .get(`${patientPath}/profiles/details`)
    .then((response) => response.data);
}

export async function updateProfileData(
  patientProfileData: ModifyingProfileData
): Promise<PatientProfileDetailsResponse> {
  return apiClient
    .patch(`${patientPath}/profiles`, patientProfileData)
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
  consultantId: string
): Promise<ConsultantFullProfileDetailsResponse> {
  return apiClient
    .get(`${patientPath}/profiles/consultants/details/${consultantId}`)
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
  appointmentCreationRequest: AppointmentCreationRequest
) {
  console.log("started creating appointment");
  return apiClient
    .post(`${appointmentsPath}`, appointmentCreationRequest)
    .then((response) => response.data);
}

export interface PatientDashboardResponse extends Response {
  appointmentsToday: [
    {
      appointmentId: string;
      consultantFullName: string;
      specialty: string;
      dateTime: string;
      channel: Uppercase<ConsultationChannel>;
    }
  ];
  recentActivities: [
    {
      activityId: string;
      title: string;
      dateTime: string;
      context: NotificationContext;
    }
  ];
  medications: [
    {
      medicationId: string;
      name: string;
      dosageQuantity: string;
      dosageFrequency: string;
      nextDoseDateTime: string;
    }
  ];
}
export async function getMyDashboard(): Promise<PatientDashboardResponse> {
  return apiClient.get(`${dashBoardPath}`).then((response) => response.data);
}
