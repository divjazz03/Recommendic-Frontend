import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import React, { FormEvent, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormProvider, useForm } from 'react-hook-form'
import { signInValidation } from '../validations/SignInValidation'
import { Input } from '@/components/ui/input'
import { FormWrapper } from './FormWrapper'
import { Button } from '@/components/ui/button'
import { Link, useNavigate } from 'react-router-dom'
import { SigninUserData } from '@/types'
import { useSignInUserMutation } from '@/lib/react-query/queriiesAndMutation'
import { useUserContext } from '@/context/AuthContext'
import { useToast } from '@/hooks/use-toast'
import { Label } from '@/components/ui/label'
import Loader from '@/components/shared/Loader'


const SigninForm = () => {

  const { toast } = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<SigninUserData>({
    email: "",
    password: ""
  })
  const { checkUserIsAuthenticated, isLoading: isUserLoading } = useUserContext();

  const { mutateAsync: signinUser, isPending: isSigningIn } = useSignInUserMutation();

  const handleFormDataChange = (key: keyof typeof formData, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value, }))
  };

  const onSubmit = async (value: FormEvent) => {
    value.preventDefault();
    const result = await signinUser({
      email: formData.email,
      password: formData.password
    });
    if (result && checkUserIsAuthenticated) {
      navigate('/')
    } else {
      return toast({ title: 'Sign in failed try again', variant: 'destructive' })
    }
  };

  return (

    <div className='flex flex-col gap-2'>

      <FormWrapper >
        <form onSubmit={onSubmit} className='flex flex-col items-center gap-4'>
          <div className='flex flex-col justify-center gap-5'>
            <header className='mb-5'>
              <p className='h3-bold text-dark-3'>Welcome to Recommendic</p>
              <p className='text-center text-dark-5 pt-2'>Lets get you logged in</p>
            </header>
            <div>
              <Label>Email</Label>
              <Input placeholder="johndoe@gmail.com" value={formData.email} type='email' onChange={event => handleFormDataChange("email", event.target.value)} />
            </div>
            <div>
              <Label>Password</Label>
              <Input type='password' value={formData.password} onChange={event => handleFormDataChange('password', event.target.value)} />
            </div>
            <Button type='submit' className='w-full'>
              {
                isSigningIn ? (<div className='flex justify-center gap-2'><Loader/></div>): "Sign In"
              }
              
              </Button>
          </div>
          <p className='subtle-semibold mt-4'>New to Recommendic? <span><Link to={'/sign-up'} className='subtle-semibold hover:text-light-3 text-light-1'>Create new account</Link></span></p>
        </form>
      </FormWrapper>
    </div>

  )
}

export default SigninForm