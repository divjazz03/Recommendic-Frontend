import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { signInValidation } from '../validations/SignInValidation'
import { Input } from '@/components/ui/input'
import { FormWrapper } from './FormWrapper'
import { Button } from '@/components/ui/button'
import { Link, useNavigate } from 'react-router-dom'
import { useSignInUserMutation } from '@/lib/react-query/generalQueriesAndMutation'
import { z } from 'zod'
import { Loader, Lock, MailIcon } from 'lucide-react'
import axios, { AxiosError } from 'axios'
import { apiClient, ApiError } from '@/lib/axios'
import { toast } from 'sonner'
import { InputGroup, InputGroupAddon, InputGroupInput } from '@/components/ui/input-group'


const SigninForm = () => {
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
      const {data} = await signInUser({ email: formData.email, password: formData.password });
      if(data && data.userStage === 'ONBOARDING') {
        navigate('/onboarding');
      }else {
        navigate('/')
      }
    } catch(error) {
      const apiError = error as ApiError;
      if (apiError.status === 404) {
        toast.error('You do not have an account please sign up')
      }
    }
  
  }

return (
  <div className='flex md:w-1/2 items-center justify-center md:border-r border-slate-300/30 p-8'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col items-center gap-4 w-full'>
          <div className='flex flex-col justify-center gap-5'>
            <header className='mb-5'>
              <p className='font-bold text-2xl text-dark-2 text-center'>Welcome Back</p>
              <p className='text-sm text-center text-dark-1 pt-2'>Lets get you logged in</p>
            </header>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <InputGroup>
                    <InputGroupInput {...form.register("email")} type="email" {...field} />
                    <InputGroupAddon>
                      <MailIcon />
                    </InputGroupAddon>
                    </InputGroup>
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
                  <InputGroup>
                    <InputGroupInput {...form.register("password")} type="password" {...field} />
                    <InputGroupAddon>
                      <Lock />
                    </InputGroupAddon>
                    </InputGroup>
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
  </div>

)
}

export default SigninForm