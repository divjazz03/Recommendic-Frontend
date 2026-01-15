
import ConsultantNewMedication from '@/components/consultant/ConsultantNewMedication';
import PatientNewMedication from '@/components/patient/PatientNewMedication';
import { useUserContext } from '@/context/AuthContext';
import React from 'react'
import { Navigate } from 'react-router-dom';

const NewMedication = () => {
  const { userContext } = useUserContext();

    if (!userContext.role) {
        return null
    }
    return (
        <>
            {
                userContext.role === 'ROLE_PATIENT' 
                ? <PatientNewMedication />
                : <ConsultantNewMedication />
            }
        </>
    )
}

export default NewMedication