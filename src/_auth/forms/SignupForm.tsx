import { Button } from '@/components/ui/button'
import React, { useState } from 'react'
import SignupSuccessModal from '@/components/shared/SignupSuccessModal'
import { useCreateUserMutation } from '@/lib/actions/generalQueriesAndMutation'
import { Link, useNavigate } from 'react-router-dom'
import { Controller, useForm } from 'react-hook-form'
import { accountFormValidation, userFormValidation } from '../validations/SignupValidation'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'

import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

import { Progress } from '@/components/ui/progress'
import { Gender } from '@/types'
import { toast } from 'sonner'
import { ApiError } from '@/lib/axios'
import Loader from '@/components/shared/Loader'
export type TypeOfUser = "Patient" | "Consultant";

type SignUpFormData = {
  firstName: string
  lastName: string,
  email: string,
  password: string,
  dateOfBirth: string,
  typeOfUser: TypeOfUser,
  gender: Gender,
  city: string,
  state: string,
  country: string,
}

const SignupForm: React.FC = () => {

  const navigate = useNavigate();
  const { mutateAsync: createNewUser, isPending: isCreatingUser } = useCreateUserMutation();
  const [formData, setFormData] = useState<SignUpFormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    dateOfBirth: "",
    typeOfUser: "Patient",
    gender: 'male',
    city: "",
    state: "",
    country: "",
  });
  const [step, setStep] = useState(1);
  const [isSuccessfulSignUp, setSuccessfulSignup] = useState<boolean>(false);

  async function onSubmitForConsultant(values: SignUpFormData) {

    await createNewUser({
      typeOfUser: values.typeOfUser,
      userData: {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
        dateOfBirth: values.dateOfBirth,
        gender: values.gender,
        city: values.city,
        state: values.state,
        country: values.country
      }
    });
  }

  async function onSubmitForPatient(values: SignUpFormData) {
    await createNewUser({
      typeOfUser: values.typeOfUser,
      userData: {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
        dateOfBirth: values.dateOfBirth,
        gender: values.gender,
        city: values.city,
        state: values.state,
        country: values.country
      }

    });

  }
  function handleNextStep() {
    if (step !== 3) {
      setStep(step => step + 1)
    }
  }
  function handleBackStep() {
    if (step !== 1) {
      setStep(step => step - 1);
    }
  }

  function AccountForm() {

    const accountForm = useForm<z.infer<typeof accountFormValidation>>({
      resolver: zodResolver(accountFormValidation),
      defaultValues: { typeOfUser: 'Patient' },
      mode: 'onChange'
    })

    const handleAccountFormSubmit = async (form: z.infer<typeof accountFormValidation>) => {

      const fullFormData: SignUpFormData = {
        ...formData,
        email: form.email,
        typeOfUser: form.typeOfUser,
        password: form.password
      }

      try {
        switch (fullFormData.typeOfUser) {
          case 'Patient': await onSubmitForPatient(fullFormData);
            break;
          case 'Consultant': await onSubmitForConsultant(fullFormData);
            break;
        }
        console.log(fullFormData)
        toast.success(`Sign up success`)
        setSuccessfulSignup(true);
      } catch (error) {
        if (error instanceof ApiError) {
          const err = error as ApiError;
          console.log(error)
          toast.error(`Sign up failed: ${err.message}`)
        }
      }



    }

    return (
      <Form {...accountForm}>
        <form onSubmit={accountForm.handleSubmit(handleAccountFormSubmit)}>
          <div className="flex flex-col gap-3 justify-center">
            <div>
              <header className="text-xl font-semibold text-center">Account Data</header>
            </div>

            <FormField
              control={accountForm.control}
              name="email"
              render={() => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...accountForm.register("email")} placeholder='johndoe@gmail.com' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}>

            </FormField>

            <FormField
              control={accountForm.control}
              name="typeOfUser"
              render={() => (
                <FormItem>
                  <FormLabel>Signup As</FormLabel>
                  <FormControl>
                    <Controller
                      control={accountForm.control}
                      name='typeOfUser'
                      render={({ field }) => (
                        <Select
                          onValueChange={field.onChange}
                          value={field.value} >
                          <SelectTrigger>
                            <SelectValue placeholder='Sign up as' />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Patient" >Patient</SelectItem>
                            <SelectItem value="Consultant" >Consultant</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />

                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}>

            </FormField>
            <FormField
              control={accountForm.control}
              name="password"
              render={() => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input {...accountForm.register("password")} type='password' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}>

            </FormField>
            <FormField
              control={accountForm.control}
              name="confirmPassword"
              render={() => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input {...accountForm.register("confirmPassword")} type='password' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}>

            </FormField>
          </div>
          <div className='flex justify-center flex-col mt-4 gap-2 mb-2 w-full'>
            {step != 1 && <Button type='button' variant='secondary' className='shad-button_secondary text-dark-4' onClick={handleBackStep}>Back</Button>}
            <Button type='submit'>
              {isCreatingUser ? (<Loader />) : "Finish"}
            </Button>
          </div>
        </form>
      </Form>
    )
  }
  function UserForm() {

    const userForm = useForm<z.infer<typeof userFormValidation>>({
      resolver: zodResolver(userFormValidation),
      defaultValues: {
        firstName: '',
        lastName: '',
        gender: 'male'
      }
    })
    const handleUserFormSubmit = (form: z.infer<typeof userFormValidation>) => {
      setFormData(prev => ({
        ...prev, firstName: form.firstName,
        lastName: form.lastName,
        dateOfBirth: form.dateOfBirth,
        gender: form.gender
      }))
      handleNextStep();
      console.log(formData)
    }
    return (
      <Form {...userForm}>

        <form onSubmit={userForm.handleSubmit(handleUserFormSubmit)}>
          <div className="flex flex-col gap-3 justify-center">
            <div>
              <header className="text-xl font-semibold text-center">Personal Data</header>
            </div>

            <FormField
              control={userForm.control}
              name="firstName"
              render={() => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input {...userForm.register("firstName")} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}>

            </FormField>
            <FormField
              control={userForm.control}
              name="lastName"
              render={() => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input {...userForm.register("lastName")} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}>

            </FormField>

            <FormField
              control={userForm.control}
              name="dateOfBirth"
              render={() => (
                <FormItem>
                  <FormLabel>Date of Birth</FormLabel>
                  <FormControl>
                    <Input {...userForm.register("dateOfBirth")} type='date' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}

            ></FormField>

            <FormField
              control={userForm.control}
              name="gender"
              render={() => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <FormControl>
                    <Select {...userForm.register('gender')} defaultValue="male" >
                      <SelectTrigger>
                        <SelectValue placeholder='Select Your gender' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male" >Male</SelectItem>
                        <SelectItem value="female" >Female</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}>

            </FormField>
          </div>
          <div className='flex justify-center flex-col mt-4 gap-2 mb-2 w-full'>
            {step != 1 && <Button type='button' variant='secondary' className='shad-button_secondary text-dark-4' onClick={handleBackStep}>Back</Button>}
            <Button type='submit'>
              Next
            </Button>
          </div>
        </form>
      </Form>
    )
  }
  return (
    <>
      <div className='flex flex-col p-8 items-center justify-center w-full'>
        <header className='mb-5'>
          <p className='text-3xl font-bold text-gray-900 text-center'>Create your account</p>
          <p className=' text-sm text-gray-600 text-center'>Lets get you started with recommendic</p>
        </header>
          <div className='flex flex-row justify-between w-60 mb-3'>
            <Progress className='h-2' value={step / 2 * 100} />
          </div>
          <div className=' flex-center flex-col'>
            {step === 1 && (
              <UserForm />
            )}
            {step === 2 && (
              <AccountForm />
            )}
          </div>

          <p className='text-sm font-semibold text-center mt-4'>Already have an account? <span className='mx-1 text-gray-500 hover:text-dark-1'><Link to='/sign-in' className='subtle-semibold hover:no-underline underline'>Sign In</Link></span></p>
          <SignupSuccessModal
            isOpen={isSuccessfulSignUp}
            redirectDelay={3000}
            onRedirect={() => navigate("/confirm-email", { state: { formData } })} />

      </div>
    </>
  )
}

export default SignupForm