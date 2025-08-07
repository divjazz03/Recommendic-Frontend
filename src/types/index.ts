import React, { ReactNode } from "react"


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
    phoneNumber: string,
    gender: 'Male' | 'Female',
    city: string,
    state: string,
    country: string
}





export type SigninUserData = {
    email: string,
    password: string
}


export type Address = {
    city: string;
    state: string;
    country: string
}


export interface SignUpResponseData {
    id: string;
    last_name: string;
    first_name: string;
    phonenumber: string;
    address: Address;
}
export interface UserName {
    fullname: string,
    firstname: string,
    lastname: string
}


export interface SignUpResponse extends Response {
    data: SignUpResponseData;
}


export interface AuthUserContext {
    user_id: string;
    role: string;
    userStage: 'ONBOARDING' | 'ACTIVE_USER',
    userType: 'PATIENT' | 'CONSULTANT' | 'ADMIN'
}
export interface UserContext {
    user_id: string;
    role: string;
    firstName: string;
    lastName: string;
    address: Address;
    userStage: 'ONBOARDING' | 'ACTIVE_USER',
    userType: 'PATIENT' | 'CONSULTANT' | 'ADMIN'
}

export interface AuthContextState {
    userContext: AuthUserContext;
    isAuthenticated: boolean;
    setUserInContext: React.Dispatch<React.SetStateAction<AuthUserContext>>;
}


export interface SignInResponse extends Response {
    data: UserContext
}
export interface MedicalCategory {
    name: string,
    description: string
}

export interface MedicalCategoriesResponse extends Response {
    data: MedicalCategory[];
}


export interface AdminCredentialResponse extends Response {
    data: {
        email: string;
        password: string;
    }
}
export interface AuthenticatedUserResponse {
    userId: string;
    role: string;
    user_type: 'PATIENT' | 'ADMIN' | 'CONSULTANT';
    user_stage: 'ONBOARDING' | 'ACTIVE_USER';
}
export interface CurrentUserInfo {
    userId: string;
    first_name: string;
    last_name: string;
    role: string;
    address: Address;
    user_type: 'PATIENT' | 'ADMIN' | 'CONSULTANT';
    user_stage: 'ONBOARDING' | 'ACTIVE_USER';
}
export interface Response {
    time: string;
    code: number;
    status: string;
    message?: string;
    exception?: string;
}
interface ConsultantEducation {
    degree: string;
    institution: string;
    year: number;
}
interface ConsultantStats {
    patientsHelped: number;
    successRate: number;
    responseTime: string;
    followUpRate: number;
}
export interface ConsultantTypeMinimal {
    id: number,
    name: string,
    specialty: string,
    rating: number,
    reviews: number,
    experience: number,
    location: string,
    availability: string,
    consultationFee: string,
    image: string,
    qualifications: string[],
    languages: string[],
    nextSlot: string
}
export interface ConsultantType {
    id: number
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
    education?: ConsultantEducation[],
    stats?: ConsultantStats,
    reviews?: Review[],
    availableSlots?: Schedule[],
    nextAvailable: string
}
interface Review {
    name: string;
    rating: number;
    comment: string;
    date: string;
}
export interface RecurrenceRule {
    frequency: 'one-off'|'daily'|'weekly'|'monthly',
    weekDays: ('monday'| 'tuesday'| 'wednesday'| 'thursday'| 'friday'|'saturday'|'sunday')[],
    interval: number,
    endDate?: string,
}
export interface Schedule{
    id: number;
    name: string;
    startTime: string;
    endTime: string;
    isRecurring: boolean;
    offset: string;
    channels: string[];
    recurrenceRule?: RecurrenceRule | undefined;
    isActive: boolean;
    createdAt: string;
    upcomingSessions: number
}

export interface SVGProps {
    className: string
}