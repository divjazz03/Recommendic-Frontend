import { Button } from '@/components/ui/button'
import React, { FormEvent, useState } from 'react'
import { signUpValidation } from '../validations/SignupValidation'
import { Gender, MedicalSpecialization } from './Enums'
import { useMultistepForm } from '@/hooks/useMultistepForm'
import { SignUpFormData } from '@/types'
import { UserForm } from './UserForm'
import { AddressForm } from './AddressForm'
import { AccountForm } from './AccountForm'
import SignupSuccessModal from '@/components/SignupSuccessModal'
import { useToast } from '@/hooks/use-toast'
import { useCreateUserMutation } from '@/lib/react-query/queriiesAndMutation'
import { Link } from 'react-router-dom'



const SignupForm: React.FC = () => {
  const { toast } = useToast();
  
  const { mutateAsync: createNewUser, isLoading: isCreatingUser } = useCreateUserMutation();
  const [formData, setFormData] = useState<SignUpFormData>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phoneNumber: "",
    typeOfUser: "Patient",
    gender: Gender.MALE,
    zipCode: "",
    city: "",
    state: "",
    country: "",
    medicalSpecialization: MedicalSpecialization.DENTIST,
    categoryOfInterest: [MedicalSpecialization.DENTIST]
  });
  const [isSuccessfulSignUp, setSuccessfulSignup] = useState<boolean>(false);

  const medicalCategories = Object.keys(MedicalSpecialization).filter(item => isNaN(Number(item)));

  const handleFormDataChange = (key: keyof typeof formData, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value, }));
  };
  const handleTypeOfUserSelectChange = (value: string) => handleFormDataChange("typeOfUser", value);

  const handleSpecializationChangeEvent = (value: string) => {
    handleFormDataChange("medicalSpecialization", value)
  }

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
        zipCode: values.zipCode,
        city: values.city,
        state: values.state,
        country: values.country,
        medicalSpecialization: values.medicalSpecialization,
        categoryOfInterest: null
      }
    });
    if (result) {
      setSuccessfulSignup(true)
      return toast({})
    }
    return toast({title: 'Sign up failed. Please try again later', variant: 'destructive'})
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
        zipCode: values.zipCode,
        city: values.city,
        state: values.state,
        country: values.country,
        medicalSpecialization: null,
        categoryOfInterest: values.categoryOfInterest
      }

    });
    if (result) {
      setSuccessfulSignup(true);
      return null;
    }
    return toast({ title: ' Sign up failed. PLease try again', variant:"destructive" })

  }

  const { steps, currentStepIndex, step, isFirstStep, isLastStep, next, back } = useMultistepForm([
    <UserForm formData={formData} handleFormDataChange={handleFormDataChange} />,
    <AddressForm formData={formData} handleFormDataChange={handleFormDataChange} />,
    <AccountForm 
      formData={formData}
      medicalCategories={medicalCategories}
      handleFormDataChange={handleFormDataChange}
      handleSpecializationChangeEvent={handleSpecializationChangeEvent}
      handleTypeOfUserSelectChange={handleTypeOfUserSelectChange} />
  ]);

  async function handleFormSubmit(event: FormEvent) {
    event.preventDefault();
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
        <div className='sm-w-[420px] flex-col flex-center'>
          <form onSubmit={isLastStep ? handleFormSubmit : handleNextStep} >
            <div className='absolute top-2 right-2'>
              {currentStepIndex + 1}/ {steps.length}
            </div>
            <div className=' flex-center flex-col'>
              {step}
            </div>
            <div className='flex justify-center flex-col mt-4 gap-2 mb-2'>
              {!isFirstStep && <Button type='button' className='bg-secondary-600 hover:bg-secondary-500 text-dark-4' onClick={handleBackStep}>Back</Button>}
              <Button type='submit'>{isLastStep ? "Finish" : "Next"}</Button>
            </div>
          </form>
          <p className='tiny-medium text-center'>Already have an account? <span><Link to={'/sign-in'} className='subtle-semibold'>Sign Up</Link></span></p>
        </div>
      <SignupSuccessModal
        isOpen={isSuccessfulSignUp}
        redirectDelay={3000} />
    </>
  )
}

export default SignupForm