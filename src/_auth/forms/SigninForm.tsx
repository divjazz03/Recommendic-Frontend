import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useEffect } from 'react'
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

  useEffect(() => {
    if (false/*checkUserIsAuthenticated()*/) {
      userContext.userStage === 'ONBOARDING' ? navigate("/onboarding") : navigate("/")
    }
  }, [])
  const { mutateAsync: signinUser, isPending: isSigningIn } = useSignInUserMutation();

  const form = useForm<z.infer<typeof signInValidation>>({
    resolver: zodResolver(signInValidation),
    defaultValues: {
      email: "",
      password: ""
    }
  })

  const onSubmit = async (formData: z.infer<typeof signInValidation>) => {
    console.log("entered")
    const result = await signinUser({
      email: formData.email,
      password: formData.password
    });
    if (result) {
      setUserInContext({
        user_id: result.data.user.user_id,
        first_name: result.data.user.first_name,
        last_name: result.data.user.last_name,
        role: result.data.user.role,
        address: result.data.user.address,
        userStage: result.data.user.userStage,
        userType: result.data.user.userType
      });
      result.data.user.userStage === 'ONBOARDING' ? navigate('/onboarding') : navigate('/');
    } else {
      form.reset()
      return toast({ title: 'Sign in failed try again', variant: 'destructive' })
    }
  };



  return (
    <div className='flex flex-col gap-2'>
      <FormWrapper >
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col items-center gap-4'>
            <div className='flex flex-col justify-center gap-5'>
              <header className='mb-5'>
                <p className='h3-bold text-dark-3'>Welcome to Recommendic</p>
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
              <Button type='submit'>
                Sign In
              </Button>
            </div>
            <p className='subtle-semibold mt-4'>New to Recommendic? <span><Link to={'/sign-up'} className='subtle-semibold hover:text-light-1 text-dark-1 transition-all'>Create new account</Link></span></p>
          </form>

        </Form>
      </FormWrapper>
    </div>

  )
}

export default SigninForm