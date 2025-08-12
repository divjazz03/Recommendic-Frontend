import ConsultantSchedule from '@/components/consultant/ConsultantSchedule';
import { PatientSchedule } from '@/components/patient/PatientSchedule';
import { useUserContext } from '@/context/AuthContext'
import React from 'react'
import { Outlet } from 'react-router-dom';

const Schedule = () => {
  return (
    <Outlet/>
  )
}

export default Schedule