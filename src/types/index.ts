
import { signUpValidation } from "@/_auth/validations/SignupValidation"
import React, { ReactNode } from "react"
import { UseFormReturn } from "react-hook-form"
import { z } from "zod"



export type OutletContextTypeOfUser = {
    typeOfUser: string
}


export type SignUpFormData = {
    firstName?: string
    lastName?: string,
    email?: string,
    password?: string,
    phoneNumber?: string,
    typeOfUser?: TypeOfUser,
    gender?: 'Male' | 'Female',
    city?: string,
    state?: string,
    country?: string,
}


export type UserFormProps = {
    formData: any,
    handleFormDataChange: (key: keyof SignUpFormData, value: any) => void,
    form: UseFormReturn<z.infer<typeof signUpValidation>>
}


export type AddressFormProps = {
    formData: any,
    handleFormDataChange: (key: keyof SignUpFormData, value: any) => void,
    form: UseFormReturn<z.infer<typeof signUpValidation>>
}


export type AccountFormProps = {
    formData: any,
    handleFormDataChange: (key: keyof SignUpFormData, value: any) => void,
    handleTypeOfUserSelectChange: (value: string) => void,
    form: UseFormReturn<z.infer<typeof signUpValidation>>
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


export type TypeOfUser = "Patient" | "Consultant";


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


export interface UserContext {
    user_id: string;
    first_name: string;
    last_name: string;
    role: string;
    address: Address;
    userStage: 'ONBOARDING' | 'ACTIVE_USER',
    userType: 'PATIENT' | 'CONSULTANT' | 'ADMIN'
}

export interface AuthContextState {
    userContext: UserContext;
    isAuthenticated: boolean;
    setUserInContext: React.Dispatch<React.SetStateAction<UserContext>>;
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
    first_name: string;
    last_name: string;
    role: string;
    address: Address;
    user_type: 'PATIENT' | 'ADMIN' | 'CONSULTANT';
    user_stage: 'ONBOARDING' | 'ACTIVE_USER';
}
interface Response {
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
export interface ConsultantType {
    name: string;
    title: string;
    rating: number;
    verified: boolean;
    experience: number;
    totalReviews: 347;
    bio: string;
    location: string;
    image: string;
    specialization: string;
    languages: string;
    consultationFee: number;
    nextAvailaible: Date;
    education: ConsultantEducation[],
    stats: ConsultantStats
}
interface Review {
    name: string;
    rating: number;
    comment: string;
    date: string;
}

export interface SVGProps {
    className: string
}