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


const SigninForm = () => {

  const { toast } = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState<SigninUserData>({
    email: "",
    password: ""
  })
  const { checkUserIsAuthenticated, isLoading: isUserLoading } = useUserContext();

  const { mutateAsync: signinUser, isLoading: isSigningIn } = useSignInUserMutation();

  const handleFormDataChange = (key: keyof typeof formData, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value, }))
  };

  const onSubmit = async (value: FormEvent) => {
    event.preventDefault();
    const result = await signinUser({
      email: formData.email,
      password: formData.password
    });
    if (result && checkUserIsAuthenticated) {
      navigate('/')
    } else {
      return toast({ title: 'Sign in failed try again' })
    }
  };

  return (

    <div className='flex flex-col gap-2'>

        <FormWrapper title='Sign In'>
      <form onSubmit={onSubmit} className='flex flex-col items-center gap-4'>
          <div className='flex flex-col justify-center gap-4'>

            <div>
              <Label>Email</Label>
              <Input placeholder="johndoe@gmail.com" value={formData.email} type='email' onChange={event => handleFormDataChange("email", event.target.value)} />
            </div>
            <div>
              <Label>Password</Label>
              <Input type='password' value={formData.password} onChange={event => handleFormDataChange('password', event.target.value)} />
            </div>
          </div>
        <Button type='submit' className='shad-button_primary max-w-14'>Sign In</Button>
        <p className='tiny-medium'>New to Recommendic? <span><Link to={'/sign-up'} className='tiny-medium'>Create new account</Link></span></p>
      </form>
      </FormWrapper>
    </div>

  )
}

export default SigninForm