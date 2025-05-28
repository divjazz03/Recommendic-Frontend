import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useEffect, useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { signInValidation } from '../validations/SignInValidation'
import { Input } from '@/components/ui/input'
import { FormWrapper } from './FormWrapper'
import { Button } from '@/components/ui/button'
import { Link, useNavigate } from 'react-router-dom'
import { useSignInUserMutation } from '@/lib/react-query/queriiesAndMutation'
import { useUserContext } from '@/context/AuthContext'
import { useToast } from '@/hooks/use-toast'
import { z } from 'zod'


const SigninForm = () => {

  const { toast } = useToast();
  const navigate = useNavigate();
  const { checkUserIsAuthenticated, setUserInContext, isLoading: isUserLoading, userContext } = useUserContext();
  const { isPending: isSigningIn, mutateAsync:signInUser } = useSignInUserMutation();

  useEffect(() => {
    if (false/*checkUserIsAuthenticated()*/) {
      userContext.userStage === 'ONBOARDING' ? navigate("/onboarding") : navigate("/")
    }
  }, [])

  const form = useForm<z.infer<typeof signInValidation>>({
    resolver: zodResolver(signInValidation),
    defaultValues: {
      email: "",
      password: ""
    }
  })

  const onSubmit = async (formData: z.infer<typeof signInValidation>) => {
    console.log("entered")
    const data = await signInUser({email: formData.email, password: formData.password});
    if (data) {
      setUserInContext({
        user_id: data.data.user_id,
        first_name: data.data.first_name,
        last_name: data.data.last_name,
        role: data.data.role,
        address: data.data.address,
        userStage: data.data.userStage,
        userType: data.data.userType
      });
      data.data.userStage === 'ONBOARDING' ? navigate('/onboarding') : navigate('/');
    } else {
      form.reset()
      return toast({ title: 'Sign in failed try again', variant: 'destructive' })
    }
  };



  return (
    <div className='flex flex-col gap-2'>
      <FormWrapper >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col items-center gap-4 w-full'>
            <div className='flex flex-col justify-center gap-5'>
              <header className='mb-5'>
                <p className='h3-bold text-dark-3 text-center'>Welcome to Recommendic</p>
                <p className='text-center text-dark-1 pt-2'>Lets get you logged in</p>
              </header>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input {...form.register("email")} type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}>

              </FormField>
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input {...form.register("password")} type='password' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}>
              </FormField>
              <Button type='submit' className='shad-button_primary'>
                Sign In
              </Button>
            </div>
            <p className='subtle-semibold mt-4'>New to Recommendic? <span><Link to={'/sign-up'} className='subtle-semibold text-dark-1 underline hover:no-underline transition-all'>Create new account</Link></span></p>
          </form>

        </Form>
      </FormWrapper>
    </div>

  )
}

export default SigninForm