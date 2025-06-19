import {z} from "zod"

export const userFormValidation = z.object({
  firstName: z.string().min(2, 'Too short').max(30, 'Too long'),
  lastName: z.string().min(2, 'Too short').max(30, 'Too long'),
  phoneNumber: z.string().min(10, 'invalid phone number'),
  gender: z.enum(['Male','Female'])
})
export const addressFormValidation = z.object({
  city: z.string(),
  state: z.string(),
  country: z.string()
})

export const accountFormValidation = z.object({
  email: z.string().email("Invalid email, Please try another"),
  password: z.string().min(8, 'Password must not be less than 8'),
  typeOfUser: z.enum(['Patient', 'Consultant']),
})