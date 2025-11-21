import ConsultantAppointment from '@/components/consultant/ConsultantAppointment';
import PatientAppointment from '@/components/patient/PatientAppointment';
import { useUserContext } from '@/context/AuthContext'
import React from 'react'

const Appointment = () => {
    const {userContext} = useUserContext();

    if (!userContext.role) {
      return null
    }
  return (
    <>
    {userContext.role === 'ROLE_PATIENT'
    ? <PatientAppointment />
    : <ConsultantAppointment />}
    </>
  )
}

export default Appointment