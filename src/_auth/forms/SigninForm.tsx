import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { signInValidation } from '../validations/SignInValidation'
import { Input } from '@/components/ui/input'
import { FormWrapper } from './FormWrapper'
import { Button } from '@/components/ui/button'
import { Link, useNavigate } from 'react-router-dom'
import { useSignInUserMutation } from '@/lib/react-query/generalQueriesAndMutation'
import { useToast } from '@/hooks/use-toast'
import { z } from 'zod'
import { Loader } from 'lucide-react'
import axios, { AxiosError } from 'axios'
import { ApiError } from '@/lib/axios'


const SigninForm = () => {

  const { toast } = useToast();
  const navigate = useNavigate();
  const { isPending: isSigningIn, mutateAsync: signInUser } = useSignInUserMutation();

  const form = useForm<z.infer<typeof signInValidation>>({
    resolver: zodResolver(signInValidation),
    defaultValues: {
      email: "",
      password: ""
    }
  })

  const onSubmit = async (formData: z.infer<typeof signInValidation>) => {
    console.log("entered")
    try {
      const data = await signInUser({ email: formData.email, password: formData.password });
      if (data && data.data) {
        console.log(data.data)
        if (data.data.userStage === 'ONBOARDING') {
          navigate('/onboarding');
        }
        else {
          navigate('/');
        }
      } else {
        navigate('/')
      }
    } catch (error) {
      if (error instanceof ApiError) {
        const err = error as ApiError;
        form.reset()
        if (err.status === 404) {
          return toast({ title: `Sign in failed: You don't have an account please sign up`, variant: 'destructive' });
        }
        console.log(err)
        return toast({ title: `Sign in failed: ${err.message}`, variant: 'destructive'});
      }
    }

  };



  return (
    <div className='flex flex-col gap-2'>
      <FormWrapper >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col items-center gap-4 w-full'>
            <div className='flex flex-col justify-center gap-5'>
              <header className='mb-5'>
                <p className='font-bold text-2xl text-dark-2 text-center'>Welcome to Recommendic</p>
                <p className='text-sm text-center text-dark-1 pt-2'>Lets get you logged in</p>
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
                {isSigningIn ? <Loader /> : 'Sign In'}
              </Button>
            </div>
            <p className='text-sm font-semibold mt-4'>New to Recommendic? <span className='font-normal'><Link to={'/sign-up'} className='subtle-semibold text-dark-1 underline hover:no-underline transition-all'>Create new account</Link></span></p>
          </form>

        </Form>
      </FormWrapper>
    </div>

  )
}

export default SigninForm