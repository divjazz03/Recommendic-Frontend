import {
  ConsultantScheduleData,
  Fee,
  TimeSlot,
} from "@/hooks/usePatientSchedules";
import { ReactNode } from "react";

export type UserType = "PATIENT" | "CONSULTANT" | "ADMIN";
export type UserStage = "ONBOARDING" | "ACTIVE_USER";
export type NotificationContext =
  | "ARTICLE"
  | "APPOINTMENT"
  | "USER"
  | "CHAT"
  | "CONSULTATION"
  | "MEDICINE"
  | "LAB";
export type Gender = "male" | "female";
export type OutletContextTypeOfUser = {
  typeOfUser: string;
};

export type FormWrapperProps = {
  children: ReactNode;
};

export type NewUser = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  dateOfBirth: string;
  gender: Gender;
  city: string;
  state: string;
  country: string;
};

export type SigninUserData = {
  email: string;
  password: string;
};

export type Address = {
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
};
export type DocumentType = "photo" | "certificate" | "resume";
export type Credential = {
  name: string;
  fileUrl: string | File;
  type: DocumentType;
};

export interface SignUpResponseData {
  id: string;
  last_name: string;
  first_name: string;
  age: string;
  address: Address;
}

export interface PatientData {
  name: string;
  age: string;
  gender: string;
  profileUrl: string;
  allergies: string[];
  conditions: string[];
  lastVisit: string;
  insurance: string;
  id: string;
}
export interface ConsultantData {
  name: string;
  gender: string;
  title: string;
  specialty: string;
  experience: number;
  rating: number;
  location: string;
  image: string;
  id: string;
}
export interface ConsultationResponseData {
  summary?: string;
  startTime: string;
  patientName: string;
  patientId: string;
  consultantId: string;
  consultantName: string;
  consultationId: string;
  status: Lowercase<string>;
  reason: string;
  channel: Lowercase<string>;
  patientData?: PatientData;
  consultantData?: ConsultantData;
}

export interface ConsultationResponseDataMinimal {
  summary?: string;
  startTime: string;
  date: string;
  consultationId: string;
  status: Lowercase<string>;
  reason: string;
  channel: Lowercase<string>;
  patientData?: Pick<
    PatientData,
    "name" | "age" | "gender" | "profileUrl" | "id"
  >;
  consultantData?: ConsultantData;
}
export interface ConsultationStartData {
  callId: string;
  apiKey: string;
  token: string;
  user: {
    id: string;
    name: string;
  };
}
export interface ConsultationJoinData {
  callId: string;
  apiKey: string;
  token: string;
  user: {
    id: string;
    name: string;
  };
}

export interface UserName {
  full_name?: string;
  first_name?: string;
  last_name?: string;
}

export interface SignUpResponse extends Response {
  data: SignUpResponseData;
}
export interface ConsultationResponse<T> extends Response {
  data: T;
}
export interface Role {
  id: number;
  name: string;
}
export interface AuthUserContext {
  user_id?: string;
  gender?: string;
  lastLogin?: string;
  userPrincipal?: {
    email: string;
    role: Role;
    authorities: string[];
  };
  userStage?: UserStage;
  userType?: UserType;
}
export interface UserContext {
  user_id: string;
  role: string;
  firstName: string;
  lastName: string;
  address: Address;
  userStage: UserStage;
  userType: UserType;
  refreshToken?: string;
  accessToken?: string;
}

export interface SignInResponse extends Response {
  data: UserContext;
}

export type BaseProfile = {
  userName: {
    first_name: string;
    last_name: string;
    full_name: string;
  };
  profilePicture: {
    name: string;
    picture_url: string;
  };
  address: Address;
  age: string;
};

export type PatientProfile = BaseProfile & {};
export type ConsultantProfile = BaseProfile & {
  title: string;
  specialization: string;
};
export interface MedicalCategory {
  name: string;
  id: string;
  icon: string;
  description: string;
}

export interface MedicalCategoriesResponse extends Response {
  data: MedicalCategory[];
}

export interface AdminCredentialResponse extends Response {
  data: {
    email: string;
    password: string;
  };
}
export interface AuthenticatedUserResponse extends Response {
  data: {
    id: number;
    userId: string;
    gender: string;
    userType: UserType;
    userStage: UserStage;
    lastLogin: string;
    userPrincipal: { email: string; role: Role; authorities: string[] };
  };
}
export interface CurrentUserInfo {
  userId: string;
  first_name: string;
  last_name: string;
  role: string;
  address: Address;
  user_type: UserType;
  user_stage: UserStage;
}
export interface Response {
  time: string;
  code: number;
  status: string;
  message?: string;
  exception?: string;
}
export interface ConsultantEducation {
  degree: string;
  institution: string;
  year: string;
}
export interface ConsultantStats {
  patientsHelped: number;
  successRate: number;
  responseTime: string;
  followUpRate: number;
}
export interface ConsultantTypeMinimal {
  id: string;
  name: string;
  specialty: string;
  rating: number;
  reviews: number;
  experience: number;
  location: string;
  availability: string;
  fee: Fee;
  image: string;
  qualifications: string[];
  languages: string[];
  nextSlot: string;
}
export interface ConsultantType {
  id: string;
  name: string;
  title: string;
  rating: number;
  verified: boolean;
  experience: number;
  totalReviews: number;
  bio: string;
  location: string;
  image: string;
  specialization?: string[];
  languages?: string[];
  consultationFee: number;
  education?: ConsultantEducation[];
  stats?: ConsultantStats;
  reviews?: Review[];
  availableSlots?: Schedule[];
  nextAvailable: string;
}
export interface Review {
  name: string;
  rating: number;
  comment: string;
  date: string;
}
export type RecurrenceRuleFrequency =
  | "one-off"
  | "daily"
  | "weekly"
  | "monthly";
export type WeekDay =
  | "monday"
  | "tuesday"
  | "wednesday"
  | "thursday"
  | "friday"
  | "saturday"
  | "sunday";
export interface RecurrenceRule {
  frequency: RecurrenceRuleFrequency;
  weekDays: WeekDay[];
  interval: number;
  endDate?: string;
}
export interface Schedule {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  offset: string;
  channels: string[];
  recurrenceRule?: RecurrenceRule;
  isActive: boolean;
  createdAt: string;
  upcomingSessions: number;
}

export interface ConsultantSchedulesResponse extends Response {
  data: {
    scheduleSlots: TimeSlot[];
    profile: ConsultantScheduleData;
  };
}

export interface SVGProps {
  className: string;
}

type Sort = {
  empty: boolean;
  sorted: boolean;
};

export interface PagedResponse<T> extends Response {
  data: {
    content: T[];
    totalPages: number;
    totalElements: number;
    last: boolean;
    size: number;
    pageNumber: number;
    sort: Sort;
    numberOfElements: number;
    empty: boolean;
  };
}
export interface CursorResponse<T> extends Response {
  data: T[];
  nextCursor: string | null;
}

export interface MedicalHistory {
  knownAllergies: string;
  chronicConditions: string;
  currentMedications: string;
  pastSurgries: string;
  familyMedicalHistory: string;
}
export interface LifeStyleInformation {
  smokingStatus: string;
  alcoholConsumption: string;
  exerciseFrequency: string;
  dietaryRestrictions: string;
}
export interface SecurityPreferences {
  multiFactorAuthEnabled: boolean;
  loginAlertsEnabled: boolean;
  sessionTimeoutMin: number;
}

// Consultation Types
export type ConsultationNoteCategory =
  | "observation"
  | "diagnosis"
  | "prescription"
  | "follow-up";

export interface ConsultationNote {
  id: string;
  timestamp: string;
  content: string;
  category: ConsultationNoteCategory;
}

export interface PrescriptionItem {
  id: string;
  medicineName: string;
  dosage: string;
  frequency: string;
  duration: string;
  notes: string;
}

export interface ConsultationSession {
  id: string;
  patientId: string;
  consultantId: string;
  patientName: string;
  consultantName: string;
  patientAge: number;
  patientGender: Gender;
  chiefComplaint: string;
  scheduledTime: string;
  startTime?: string;
  endTime?: string;
  duration: number;
  patientHistory: string[];
  notes: ConsultationNote[];
  prescriptions: PrescriptionItem[];
  status: "scheduled" | "ongoing" | "completed" | "cancelled";
  recordingUrl?: string;
  summary?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ConsultationSessionResponse extends Response {
  data: ConsultationSession;
}

export type ConsultationSessionsPagedResponse =
  PagedResponse<ConsultationSession>;
