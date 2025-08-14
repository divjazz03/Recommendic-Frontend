import ConsultantConsultation from '@/components/consultant/ConsultantConsultation';
import { useUserContext } from '@/context/AuthContext'
import React from 'react'

const Consultation = () => {
    const {userContext} = useUserContext();
  return (
    <>
        <ConsultantConsultation />
    </>
  )
}

export default Consultation