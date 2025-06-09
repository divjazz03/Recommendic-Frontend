import { Button } from '@/components/ui/button'
import React, { FormEvent,useEffect,useState } from 'react'
import { useMultistepForm } from '@/hooks/useMultistepForm'
import { SignUpFormData } from '@/types'
import { UserForm } from './UserForm'
import { AddressForm } from './AddressForm'
import { AccountForm } from './AccountForm'
import SignupSuccessModal from '@/components/SignupSuccessModal'
import { useToast } from '@/hooks/use-toast'
import { useCreateUserMutation } from '@/lib/react-query/queriiesAndMutation'
import { Link, useNavigate } from 'react-router-dom'
import { FormWrapper } from './FormWrapper'
import Loader from '@/components/shared/Loader'
import { useForm } from 'react-hook-form'
import { signUpValidation } from '../validations/SignupValidation'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form } from '@/components/ui/form'
import { Progress } from '@/components/ui/progress'



const SignupForm: React.FC = () => {

  const handleFormDataChange = (key: keyof typeof formData, value: unknown) => {
    setFormData(prev => ({ ...prev, [key]: value, }));
  };
  const handleTypeOfUserSelectChange = (value: string) => handleFormDataChange("typeOfUser", value);

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
  const [progress, setProgress] = useState(100);
  const form = useForm<z.infer<typeof signUpValidation>>({
    resolver: zodResolver(signUpValidation),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      phoneNumber: "",
      typeOfUser: "Patient",
      gender: 'Male',
      city: "",
      state: "",
      country: ""
    },
    mode: "onChange"
  })
  const [isSuccessfulSignUp, setSuccessfulSignup] = useState<boolean>(false);
  const {currentStepIndex, step, isFirstStep, isLastStep, next, back } = useMultistepForm([
    <UserForm formData={formData} form={form} handleFormDataChange={handleFormDataChange} />,
    <AddressForm formData={formData} form={form} handleFormDataChange={handleFormDataChange} />,
    <AccountForm
      formData={formData}
      form={form}
      handleFormDataChange={handleFormDataChange}
      handleTypeOfUserSelectChange={handleTypeOfUserSelectChange} />
  ]);


  useEffect(() => {
      setProgress((currentStepIndex+1)/3 * 100)
  }, [currentStepIndex])

  



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
    switch (form.typeOfUser) {
      case 'Patient':
        await onSubmitForPatient(form)
        break;
      case 'Consultant':
        await onSubmitForConsultant(form)
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
      <div className='flex-col flex-center'>
        <header className='mb-5'>
          <p className='text-2xl font-bold text-dark-1 text-center'>Create your account</p>
          <p className='pt-2 text-gray-800 text-center'>Lets get you started with recommendic</p>
        </header>
        <FormWrapper >
          <Form {...form}>
            <form className='flex gap-7 flex-col w-full' onSubmit={isLastStep ? form.handleSubmit(handleFormSubmit) : handleNextStep}>
              <div className='flex flex-row justify-between w-full'>
                <Progress className='h-2' value={progress}/>
              </div>
              <div className=' flex-center flex-col'>
                {step}
              </div>
              <div className='flex justify-center flex-col mt-4 gap-2 mb-2 w-full'>
                {!isFirstStep && <Button type='button' variant='secondary' className='shad-button_secondary text-dark-4' onClick={handleBackStep}>Back</Button>}
                <Button type='submit'>
                  {!isLastStep ? "Next" : isCreatingUser ? (<Loader />) : "Finish"}
                </Button>
              </div>
            </form>
          </Form>
          <p className='text-sm text-center mt-4'>Already have an account? <span className='mx-1 text-gray-500 hover:text-dark-1'><Link to='/sign-in' className='subtle-semibold hover:no-underline underline'>Sign In</Link></span></p>
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