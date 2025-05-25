import {z} from "zod"
import { Gender } from '../forms/Enums'

export const signUpValidation = z.object({
    firstName: z.string().min(2, 'Too short').max(30, 'Too long'),
    lastName: z.string().min(2, 'Too short').max(30, 'Too long'),
    email: z.string().email("Invalid email, Please try another"),
    password: z.string().min(8, 'Password must not be less than 8'),
    phoneNumber: z.string().min(10, 'invalid phone number'),
    typeOfUser: z.enum(['Patient', 'Consultant']),
    gender: z.enum(['Male','Female']),
    city: z.string(),
    state: z.string(),
    country: z.string()
  })