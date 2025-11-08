import { PatientData } from "@/components/consultant/consultation/ConsultantConsultation"
import { ConsultantScheduleData, Fee } from "@/hooks/usePatientSchedules"
import React, { ReactNode } from "react"

export type UserType = 'PATIENT' | 'CONSULTANT' | 'ADMIN'
export type UserStage = 'ONBOARDING' | 'ACTIVE_USER'
export type Gender = 'male' | 'female'
export type OutletContextTypeOfUser = {
    typeOfUser: string
}


export type FormWrapperProps = {
    children: ReactNode
}


export type NewUser = {
    firstName: string
    lastName: string,
    email: string,
    password: string,
    dateOfBirth: string,
    gender: Gender,
    city: string,
    state: string,
    country: string
}


export type SigninUserData = {
    email: string,
    password: string
}


export type Address = {
    city?: string
    state?: string
    country?: string
    zipCode?: string
}


export interface SignUpResponseData {
    id: string
    last_name: string
    first_name: string
    age: string
    address: Address
}
export interface ConsultationResponseData {
    summary?: string
    startTime: string
    patientName: string
    consultantName: string
    consultationId: string
    status: string
    channel: string
    patientData?: PatientData
}

export interface UserName {
    full_name?: string
    first_name?: string
    last_name?: string
}


export interface SignUpResponse extends Response {
    data: SignUpResponseData
}
export interface ConsultationResponse extends Response {
    data: ConsultationResponseData
}


export interface AuthUserContext {
    user_id?: string
    role?: string
    userStage?: UserStage,
    userType?: UserType
}
export interface UserContext {
    user_id: string
    role: string
    firstName: string
    lastName: string
    address: Address
    userStage: UserStage,
    userType: UserType
}


export interface SignInResponse extends Response {
    data: UserContext
}

export type BaseProfile = {
    userName: {
        first_name: string
        last_name: string
        full_name: string
    }
    profilePicture: {
        name: string,
        picture_url: string
    }
    address: Address
    age: string
}

export type PatientProfile = BaseProfile & {}
export type ConsultantProfile = BaseProfile & {
    title: string,
    specialization: string
}
export interface MedicalCategory {
    name: string,
    description: string
}

export interface MedicalCategoriesResponse extends Response {
    data: MedicalCategory[]
}


export interface AdminCredentialResponse extends Response {
    data: {
        email: string
        password: string
    }
}
export interface AuthenticatedUserResponse {
    user: {
        userId: string
        role: string
        userType: UserType
        userStage: UserStage
    }
    profile: PatientProfile | ConsultantProfile
}
export interface CurrentUserInfo {
    userId: string
    first_name: string
    last_name: string
    role: string
    address: Address
    user_type: UserType
    user_stage: UserStage
}
export interface Response {
    time: string
    code: number
    status: string
    message?: string
    exception?: string
}
export interface ConsultantEducation {
    degree?: string
    institution?: string
    year?: string
}
export interface ConsultantStats {
    patientsHelped: number
    successRate: number
    responseTime: string
    followUpRate: number
}
export interface ConsultantTypeMinimal {
    id: string,
    name: string,
    specialty: string,
    rating: number,
    reviews: number,
    experience: number,
    location: string,
    availability: string,
    fee: Fee,
    image: string,
    qualifications: string[],
    languages: string[],
    nextSlot: string
}
export interface ConsultantType {
    id: string
    name: string
    title: string
    rating: number
    verified: boolean
    experience: number
    totalReviews: number
    bio: string
    location: string
    image: string
    specialization?: string[]
    languages?: string[]
    consultationFee: number
    education?: ConsultantEducation[],
    stats?: ConsultantStats,
    reviews?: Review[],
    availableSlots?: Schedule[],
    nextAvailable: string
}
export interface Review {
    name: string
    rating: number
    comment: string
    date: string
}
export type RecurrenceRuleFrequency = 'one-off' | 'daily' | 'weekly' | 'monthly'
export type WeekDay = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday'
export interface RecurrenceRule {
    frequency: RecurrenceRuleFrequency,
    weekDays: WeekDay[],
    interval: number,
    endDate?: string,
}
export interface Schedule {
    id: string
    name: string
    startTime: string
    endTime: string
    offset: string
    channels: string[]
    recurrenceRule?: RecurrenceRule
    isActive: boolean
    createdAt: string
    upcomingSessions: number
}

export interface ScheduleWithAppointmentDetail {
    schedule: Schedule,
    appointmentDateAndTimes: string[]
}
export interface ConsultantSchedulesResponse extends Response {
    data: {
        schedules: ScheduleWithAppointmentDetail[]
        profile: ConsultantScheduleData
    }
}

export interface SVGProps {
    className: string
}

type Sort = {
    empty: boolean,
    sorted: boolean
}

export interface PagedResponse<T> extends Response{
    data: {
        content: T[],
        totalPages: number,
        totalElements: number,
        last: boolean,
        size: number,
        pageNumber: number,
        sort: Sort,
        numberOfElements: number,
        empty: boolean

    }
}