import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import React, { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { FormProvider, useForm } from 'react-hook-form'
import { signInValidation } from '../validations/SignInValidation'
import { Input } from '@/components/ui/input'
import { FormWrapper } from './FormWrapper'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Link, useNavigate } from 'react-router-dom'
import { SigninUserData } from '@/types'
import { useSignInUserMutation } from '@/lib/react-query/queriiesAndMutation'
import { useUserContext } from '@/context/AuthContext'
import { useToast } from '@/hooks/use-toast'


const SigninForm = () => {

  const { toast } = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<SigninUserData>({
    email: "",
    password: ""
  })
  const { checkUserIsAuthenticated, isLoading: isUserLoading } = useUserContext();

  const { mutateAsync: signinUser, isLoading: isSigningIn } = useSignInUserMutation();
  const form = useForm<z.infer<typeof signInValidation>>({
    resolver: zodResolver(signInValidation),
    defaultValues: {
      email: "",
      password: ""
    }
  })

  const handleFormDataChange = (key: keyof typeof formData, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value, }))
  };

  const onSubmit = async (value: z.infer<typeof signInValidation>) => {
    const result = await signinUser({
      email: value.email,
      password: value.password
    });
    if (result && checkUserIsAuthenticated) {
      form.reset();

      navigate('/')
    } else {
      return toast({ title: 'Sign in failed try again' })
    }
  };

  return (
    <FormProvider {...form}>
      <div className='flex flex-col gap-2'>

      <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col items-center gap-4'>
        <FormWrapper title='Sign In'>
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="johndoe@gmail.com" value={formData.email} type='email' onChange={event => handleFormDataChange("email", event.target.value)} />
                </FormControl>
                <FormDescription>
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type='password' value={formData.password} onChange={event => handleFormDataChange('password', event.target.value)} />
                </FormControl>
                <FormDescription>
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </FormWrapper>
        <Button type='submit' className='shad-button_primary max-w-14'>Sign In</Button>
        <p className='tiny-medium'>Don't have an account? <span><Link to={'/sign-up'} className='subtle-semibold'>Sign Up</Link></span></p>
      </form>
      </div>
    </FormProvider>
  )
}

export default SigninForm