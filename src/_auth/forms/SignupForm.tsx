import { Button } from '@/components/ui/button'
import React, { FormEvent,useEffect,useState } from 'react'
import { TypeOfUser } from '@/types'
import SignupSuccessModal from '@/components/SignupSuccessModal'
import { useToast } from '@/hooks/use-toast'
import { useCreateUserMutation } from '@/lib/react-query/queriiesAndMutation'
import { Link, useNavigate } from 'react-router-dom'
import { FormWrapper } from './FormWrapper'
import Loader from '@/components/shared/Loader'
import { useForm } from 'react-hook-form'
import { accountFormValidation, addressFormValidation, userFormValidation } from '../validations/SignupValidation'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'

import { Input } from '@/components/ui/input'
import { PhoneInput } from 'react-international-phone'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

import axios, { AxiosError } from 'axios'
import { Progress } from '@/components/ui/progress'

type SignUpFormData = {
    firstName?: string
    lastName?: string,
    email?: string,
    password?: string,
    phoneNumber?: string,
    typeOfUser?: TypeOfUser,
    gender?: 'Male' | 'Female',
    city?: string,
    state?: string,
    country?: string,
}

const SignupForm: React.FC = () => {

  const navigate = useNavigate();
  const { toast } = useToast();
  const { mutateAsync: createNewUser, isPending: isCreatingUser } = useCreateUserMutation();
  const [formData, setFormData] = useState<SignUpFormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: "",
    typeOfUser: "Patient",
    gender: 'Male',
    city: "",
    state: "",
    country: "",
  });
  const [step, setStep] = useState(1);
  const [isSuccessfulSignUp, setSuccessfulSignup] = useState<boolean>(false);  

  async function onSubmitForConsultant(values: SignUpFormData) {

      const result = await createNewUser({
      typeOfUser: values.typeOfUser,
      userData: {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
        phoneNumber: values.phoneNumber,
        gender: values.gender,
        city: values.city,
        state: values.state,
        country: values.country
      }
    });
  }

  async function onSubmitForPatient(values: SignUpFormData) {
    const result = await createNewUser({
      typeOfUser: values.typeOfUser,
      userData: {
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
        phoneNumber: values.phoneNumber,
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
  function handleBackStep(event: FormEvent) {
    if (step !== 1) {
      setStep(step => step - 1);
    }
  }

  function AddressForm() {


      const addressForm = useForm<z.infer<typeof addressFormValidation>>({
        resolver: zodResolver(addressFormValidation),
        defaultValues: {city: '',country: '', state: ''},
        mode: 'onChange'
      })

      const handleAddressFormSubmit = (form: z.infer<typeof addressFormValidation>) => {
        event.preventDefault()
        
        setFormData(prev => ({...prev,
          city: form.city,
          state: form.state,
          country: form.country
        }))
        handleNextStep()
        console.log(formData)
      }
  
      return (
        <Form {...addressForm}>

          <form onSubmit={addressForm.handleSubmit(handleAddressFormSubmit)}>
              <div className="flex gap-3 flex-col">
                  <div>
                      <header className="text-xl font-semibold text-center"> Address Information</header>
                  </div>
  
                  <FormField
                      control={addressForm.control}
                      name="city"
                      render={() => (
                          <FormItem>
                              <FormLabel>City</FormLabel>
                              <FormControl>
                                  <Input {...addressForm.register("city")} placeholder='Ibadan'/>
                              </FormControl>
                              <FormMessage />
                          </FormItem>
                      )}>
  
                  </FormField>

                  <FormField
                      control={addressForm.control}
                      name="state"
                      render={() => (
                          <FormItem>
                              <FormLabel>State</FormLabel>
                              <FormControl>
                                  <Input {...addressForm.register("state")} placeholder='Oyo' />
                              </FormControl>
                              <FormMessage />
                          </FormItem>
                      )}>
  
                  </FormField>
  
  
                  <FormField
                      control={addressForm.control}
                      name="country"
                      render={() => (
                          <FormItem>
                              <FormLabel>Country</FormLabel>
                              <FormControl>
                              <Input {...addressForm.register("country")} placeholder='Nigeria'/>
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
  function AccountForm() {

    const accountForm = useForm<z.infer<typeof accountFormValidation>>({
        resolver: zodResolver(accountFormValidation),
        defaultValues: {email: '', password: '', typeOfUser: 'Patient'},
        mode: 'onChange'
      })

    const handleAccountFormSubmit = async (form: z.infer<typeof accountFormValidation>) => {
      event.preventDefault()
      
      setFormData((prev) => ({...prev,
        email: form.email,
        typeOfUser: form.typeOfUser,
        password: form.password
      }));

      try {
        switch(form.typeOfUser) {
        case 'Patient': await onSubmitForPatient(form);
        break;
        case 'Consultant':await onSubmitForConsultant(form);
        break;  
      }
      console.log(formData)
      toast({title: `Sign up success`})
      setSuccessfulSignup(true);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          const err = error as AxiosError;
          return toast({title: `Sign up failed: ${err.message}`, variant:'destructive'})
        }
      }

      

    }

    return (
      <Form {...accountForm}>

        <form onSubmit={accountForm.handleSubmit(handleAccountFormSubmit)}>
            <div className="flex flex-col gap-3 justify-center">
                <div>
                    <header className="text-xl font-semibold text-center">Account Information</header>
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
                                <Select {...accountForm.register("typeOfUser")} defaultValue='Patient' >
                                    <SelectTrigger>
                                        <SelectValue placeholder='Sign up as' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Patient" >Patient</SelectItem>
                                        <SelectItem value="Consultant" >Consultant</SelectItem>
                                    </SelectContent>
                                </Select>
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
        gender: 'Male'
      }
    })
    interface UserFormDataType {
      firstName: string,
      lastName: string,
      phoneNumber: string,
      gender: 'Male'|'Female'
    }
    const handleUserFormSubmit = (form: z.infer<typeof userFormValidation>) => {
      setFormData(prev => ({...prev ,firstName: form.firstName, 
        lastName: form.lastName,
        phoneNumber: form.phoneNumber,
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
                    <header className="text-xl font-semibold text-center">Personal Information</header>
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
                    name="phoneNumber"
                    render={() => (
                        <FormItem>
                            <FormLabel>Phone Number</FormLabel>
                            <FormControl>
                                <PhoneInput
                                    {...userForm.register("phoneNumber")}
                                    onChange={() => {}}
                                    defaultCountry={'ng'}
                                    className="flex flex-row h-10 border border-slate-200 rounded-md p-0"
                                    inputClassName="border w-full "
                                    countrySelectorStyleProps={{
                                        className: "bg-white",
                                        dropdownStyleProps: {
                                            className: "rounded-md"
                                        }

                                    }}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}>

                </FormField>

                <FormField
                    control={userForm.control}
                    name="gender"
                    render={() => (
                        <FormItem>
                            <FormLabel>Gender</FormLabel>
                            <FormControl>
                            <Select {...userForm.register('gender')} defaultValue="Male" >
                        <SelectTrigger>
                            <SelectValue placeholder='Select Your gender' />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Male" >Male</SelectItem>
                            <SelectItem value="Female" >Female</SelectItem>
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
      <div className='flex-col flex-center'>
        <header className='mb-5'>
          <p className='text-2xl font-bold text-dark-1 text-center'>Create your account</p>
          <p className='pt-2 text-gray-800 text-center'>Lets get you started with recommendic</p>
        </header>
        <FormWrapper >
              <div className='flex flex-row justify-between w-full mb-3'>
                <Progress className='h-2' value={step/3 * 100}/>
              </div>
              <div className=' flex-center flex-col'>
                {step === 1 && (
                  <UserForm />
                )}
                {step === 2 && (
                  <AddressForm />
                )}
                {step === 3 && (
                  <AccountForm/>
                )}
              </div>
              
          <p className='text-sm font-semibold text-center mt-4'>Already have an account? <span className='mx-1 text-gray-500 hover:text-dark-1'><Link to='/sign-in' className='subtle-semibold hover:no-underline underline'>Sign In</Link></span></p>
        </FormWrapper>
      </div>
      <SignupSuccessModal
        isOpen={isSuccessfulSignUp}
        redirectDelay={3000}
        onRedirect={() => navigate("/confirm-email", { state: { formData } })} />
    </>
  )
}

export default SignupForm