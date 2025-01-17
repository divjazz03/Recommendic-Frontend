import { Button } from '@/components/ui/button'
import React, { FormEvent, useEffect, useState } from 'react'
import { Gender } from './Enums'
import { useMultistepForm } from '@/hooks/useMultistepForm'
import { SignUpFormData } from '@/types'
import { UserForm } from './UserForm'
import { AddressForm } from './AddressForm'
import { AccountForm } from './AccountForm'
import SignupSuccessModal from '@/components/SignupSuccessModal'
import { useToast } from '@/hooks/use-toast'
import { useCreateUserMutation } from '@/lib/react-query/queriiesAndMutation'
import { Link } from 'react-router-dom'
import { getAllSupportedMedicalCategories } from '@/lib/backend_api'
import { Value } from '@radix-ui/react-select'
import { FormWrapper } from './FormWrapper'



const SignupForm: React.FC = () => {

  // Retrieves the supported medicalCategories
  const [medicalCategories, setMedicalCategories] = useState<string[]>([])

  useEffect(() => {
    const fetchCategoryData = async () => {
      const result = await getAllSupportedMedicalCategories();
      setMedicalCategories(result.data.categories);
    }

    fetchCategoryData();
  }, []);

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
    medicalSpecialization: "",
    categoryOfInterest: []
  });
  const [isSuccessfulSignUp, setSuccessfulSignup] = useState<boolean>(false);

  const handleFormDataChange = (key: keyof typeof formData, value: any) => {
    setFormData(prev => ({ ...prev, [key]: value, }));
  };
  const handleTypeOfUserSelectChange = (value: string) => handleFormDataChange("typeOfUser", value);

  const handleSpecializationChangeEvent = (value: string) => {
    handleFormDataChange("medicalSpecialization", value)
  }
  const handleCategoryOfInterestChange = (value: string[]) => {
    handleFormDataChange("categoryOfInterest", value)
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
    return toast({ title: ' Sign up failed. PLease try again', variant: "destructive" })

  }

  const { steps, currentStepIndex, step, isFirstStep, isLastStep, next, back } = useMultistepForm([
    <UserForm formData={formData} handleFormDataChange={handleFormDataChange} />,
    <AddressForm formData={formData} handleFormDataChange={handleFormDataChange} />,
    <AccountForm
      formData={formData}
      medicalCategories={medicalCategories}
      handleFormDataChange={handleFormDataChange}
      handleSpecializationChangeEvent={handleSpecializationChangeEvent}
      handleTypeOfUserSelectChange={handleTypeOfUserSelectChange}
      handleCategoryOfInterestChange={handleCategoryOfInterestChange} />
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
        <FormWrapper title='Sign up'>
        <form onSubmit={isLastStep ? handleFormSubmit : handleNextStep} >
          <div className='absolute top-6 right-2'>
            {currentStepIndex + 1} / {steps.length}
          </div>
          <div className=' flex-center flex-col'>
            {step}
          </div>
          <div className='flex justify-center flex-col mt-4 gap-2 mb-2'>
            {!isFirstStep && <Button type='button' className='bg-secondary-600 hover:bg-secondary-500 text-dark-4' onClick={handleBackStep}>Back</Button>}
            <Button type='submit'>{isLastStep ? "Finish" : "Next"}</Button>
          </div>
        </form>
        <p className='subtle-medium text-center'>Already have an account? <span className='mx-1'><Link to={'/sign-in'} className='tiny-medium'>Sign In</Link></span></p>

        </FormWrapper>
      </div>ubtle-semibold
      <SignupSuccessModal
        isOpen={isSuccessfulSignUp}
        redirectDelay={3000} />
    </>
  )
}

export default SignupForm