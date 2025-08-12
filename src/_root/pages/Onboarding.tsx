import ConsultantOnboarding from '@/components/consultant/ConsultantOnboarding';
import PatientOnboarding from '@/components/patient/PatientOnboarding';
import { useUserContext } from '@/context/AuthContext'
import React from 'react'

const Onboarding = () => {
    const {userContext} = useUserContext();

  return (
    <>
    {userContext.role === 'ROLE_PATIENT'? 
    <PatientOnboarding />
    : <ConsultantOnboarding /> }
    </>
  )
}

export default Onboarding