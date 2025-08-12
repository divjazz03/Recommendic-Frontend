import ConsultantSettings from '@/components/consultant/ConsultantSettings';
import PatientSettings from '@/components/patient/PatientSettings';
import { useUserContext } from '@/context/AuthContext';
import React from 'react'

const Settings = () => {
    const {userContext} = useUserContext();
  return (
    <>
    {userContext.role === 'ROLE_PATIENT'
    ? <PatientSettings />
    : <ConsultantSettings />}
    </>
  )
}

export default Settings