import { Gender } from "@/_auth/forms/Enums"
import React, { ReactNode } from "react"
import { UseFormReturn } from "react-hook-form"
import { data } from "react-router-dom"



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
    gender?: Gender,
    zipCode?: string,
    city?: string,
    state?: string,
    country?: string,
    medicalSpecialization?: string,
    categoryOfInterest?: string[]
}


export type UserFormProps = {
    formData: any,
    handleFormDataChange: (key: keyof SignUpFormData, value: any) => void
}


export type AddressFormProps = {
    formData: any,
    handleFormDataChange: (key: keyof SignUpFormData, value: any) => void
}


export type AccountFormProps = {
    formData: any,
    handleFormDataChange: (key: keyof SignUpFormData, value: any) => void,
    handleTypeOfUserSelectChange: (value: string) => void,
    medicalCategories: string[],
    handleSpecializationChangeEvent: (value: string) => void
    handleCategoryOfInterestChange: (value: string[]) => void
}


export type FormWrapperProps = {
    title: string,
    children: ReactNode
}


export type NewUser = {
    firstName: string
    lastName: string,
    email: string,
    password: string,
    phoneNumber: string,
    gender: Gender,
    zipCode: string,
    city: string,
    state: string,
    country: string,
    categoryOfInterest: string[],
    medicalSpecialization: string;

}


export type TypeOfUser = "Patient" | "Consultant";


export type SigninUserData = {
    email: string,
    password: string
}


export type Address = {
    zip_code: string;
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


export interface SignUpResponse extends Response {
    data: {
        data: SignUpResponseData;
    };
}


export interface UserContext {
    user_id: string;
    first_name: string;
    last_name: string;
    role: string;
    address: Address;
}

export interface AuthContextState {
    userContext: UserContext;
    isLoading: boolean;
    isAuthenticated: boolean;
    setUserInContext: React.Dispatch<React.SetStateAction<UserContext>>;
    setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
    checkUserIsAuthenticated: () => Promise<boolean>
}


export interface SignInResponse extends Response {
    data: {
        user: UserContext
    }
}

export interface medicalCategoriesResponse extends Response{
    data: {
        categories: string[];
    }
}

export interface AdminCredentialResponse extends Response {
    data: {
        email: string;
        password: string;
    }
}
export interface AuthenticatedUserResponse extends Response{
    data: {
        user_id: string;
        first_name: string;
        last_name: string;
        role: string;
        address: Address;
    }
}
interface Response {
    time: string;
    code: number;
    path: string;
    status: string;
    message?: string;
    exception?: string;
}