import ConsultantNotification from '@/components/consultant/ConsultantNotification';
import PatientNotification from '@/components/patient/PatientNotification'
import { useUserContext } from '@/context/AuthContext'
import React, { useState } from 'react'

const Notification = () => {
  const {userContext} = useUserContext();
  if(!userContext.userType) return;

  if(userContext.userType === 'PATIENT') {
    return <PatientNotification />
  } else {
    return <ConsultantNotification />
  }

}

export default Notification