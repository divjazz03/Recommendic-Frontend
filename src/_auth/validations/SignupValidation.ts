import {z} from "zod"

export const userFormValidation = z.object({
  firstName: z.string().min(2, 'Too short').max(30, 'Too long'),
  lastName: z.string().min(2, 'Too short').max(30, 'Too long'),
  dateOfBirth: z.string().date(),
  gender: z.enum(['male','female'])
})
export const addressFormValidation = z.object({
  city: z.string(),
  state: z.string(),
  country: z.string()
})

export const accountFormValidation = z.object({
  email: z.string().email("Invalid email, Please try another"),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  confirmPassword: z.string(),
  typeOfUser: z.enum(['Patient', 'Consultant']),
}).refine(data => data.password === data.confirmPassword, { 
  message: "Passwords must match", 
  path: ['confirmPassword']
})