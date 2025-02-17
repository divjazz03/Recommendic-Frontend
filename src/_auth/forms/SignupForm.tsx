import { Button } from '@/components/ui/button'
import React, { FormEvent, useEffect, useState } from 'react'
import { Gender } from './Enums'
import { useMultistepForm } from '@/hooks/useMultistepForm'
import {  SignUpFormData } from '@/types'
import { UserForm } from './UserForm'
import { AddressForm } from './AddressForm'
import { AccountForm } from './AccountForm'
import SignupSuccessModal from '@/components/SignupSuccessModal'
import { useToast } from '@/hooks/use-toast'
import { useCreateUserMutation } from '@/lib/react-query/queriiesAndMutation'
import { Link } from 'react-router-dom'
import { getAllSupportedMedicalCategories } from '@/lib/backend_api'
import { FormWrapper } from './FormWrapper'
import Loader from '@/components/shared/Loader'
import { SubmitHandler, useForm } from 'react-hook-form'
import { signUpValidation } from '../validations/SignupValidation'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form } from '@/components/ui/form'



const SignupForm: React.FC = () => {

  // Retrieves the supported medicalCategories
  const [medicalCategories, setMedicalCategories] = useState<string[]>([])
  const { toast } = useToast();
  const { mutateAsync: createNewUser, isPending: isCreatingUser } = useCreateUserMutation();
  const [formData, setFormData] = useState<SignUpFormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: "",
    typeOfUser: "Patient",
    gender: Gender.MALE,
    city: "",
    state: "",
    country: "",
  });
  const form = useForm<z.infer<typeof signUpValidation>> ({
    resolver: zodResolver(signUpValidation),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      phoneNumber: "",
      typeOfUser: "Patient", 
      gender: Gender.MALE,
      city: "",
      state: "",
      country: ""
    }, 
    mode: "onChange"
  })
  const [isSuccessfulSignUp, setSuccessfulSignup] = useState<boolean>(false);




  useEffect(() => {
    const fetchCategoryData = async () => {
      const result = await getAllSupportedMedicalCategories();
      setMedicalCategories(result.data.categories);
    }
    
    fetchCategoryData();
  }, []);
  
  
  
  
  const handleFormDataChange = (key: keyof typeof formData, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value, }));
  };
  const handleTypeOfUserSelectChange = (value: string) => handleFormDataChange("typeOfUser", value);
  const { steps, currentStepIndex, step, isFirstStep, isLastStep, next, back } = useMultistepForm([
    <UserForm formData={formData} form={form} handleFormDataChange={handleFormDataChange}/>,
    <AddressForm formData={formData} form={form} handleFormDataChange={handleFormDataChange}/>,
    <AccountForm
      formData={formData}
      form={form}
      medicalCategories={medicalCategories}
      handleFormDataChange={handleFormDataChange}
      handleTypeOfUserSelectChange={handleTypeOfUserSelectChange} />
  ]);
  

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
    if (result) {
      setSuccessfulSignup(true)
      return toast({})
    }
    return toast({ title: 'Sign up failed. Please try again later', variant: 'destructive' })
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
    if (result) {
      setSuccessfulSignup(true);
      return null;
    }
    return toast({ title: ' Sign up failed. PLease try again', variant: "destructive" })

  }


  async function handleFormSubmit(form: z.infer<typeof signUpValidation>) {
    switch (formData.typeOfUser) {
      case 'Patient':
        await onSubmitForPatient(formData)
        break;
      case 'Consultant':
        await onSubmitForConsultant(formData)
        break;
      default:
        break;
    }
  }
  function handleNextStep(event: FormEvent) {
    console.log(formData)
    event.preventDefault()
    if (!isLastStep) {
      next()
    }
  }
  function handleBackStep(event: FormEvent) {
    event.preventDefault()
    if (!isFirstStep) {
      back()
    }
  }
  return (
    <>
      <div className='flex-col flex-center '>
        <header className='mb-5'>
          <p className='h3-bold text-center'>Create your account</p>
          <p className='pt-2 text-dark-5'>Lets get you started with recommendic</p>
        </header>
        <FormWrapper > 
          <Form {...form}>
          <form className='flex gap-7 flex-col' onSubmit={isLastStep ? form.handleSubmit(handleFormSubmit) : handleNextStep}>
            <div className='flex flex-row justify-between'>
              <div className={(currentStepIndex + 1) >= 1 ? 'bg-dark-5' + ' rounded-md min-w-16 min-h-1 max-h-1' : 'bg-slate-500' + ' rounded-md min-w-16 min-h-1 max-h-1'} ></div>
              <div className={(currentStepIndex + 1) >= 2 ? 'bg-dark-5' + ' rounded-md min-w-16 min-h-1 max-h-1' : 'bg-slate-500' + ' rounded-md min-w-16 min-h-1 max-h-1'}></div>
              <div className={(currentStepIndex + 1) >= 3 ? 'bg-dark-5' + ' rounded-md min-w-16 min-h-1 max-h-1' : 'bg-slate-500' + ' rounded-md min-w-16 min-h-1 max-h-1'}></div>
            </div>
            <div className=' flex-center flex-col'>
              {step}
            </div>
            <div className='flex justify-center flex-col mt-4 gap-2 mb-2'>
              {!isFirstStep && <Button type='button' className='bg-secondary-600 hover:bg-secondary-500 text-dark-4' onClick={handleBackStep}>Back</Button>}
              <Button type='submit'>
                {!isLastStep ? "Next" : isCreatingUser? (<Loader/>) : "Finish"}
                </Button>
            </div>
          </form>
          </Form>
          <p className='subtle-semibold text-center mt-4'>Already have an account? <span className='mx-1'><Link to={'/sign-in'} className='subtle-semibold hover:text-light-3 text-light-1'>Sign In</Link></span></p>
        </FormWrapper>
      </div>
      <SignupSuccessModal
        isOpen={isSuccessfulSignUp}
        redirectDelay={3000} />
    </>
  )
}

export default SignupForm