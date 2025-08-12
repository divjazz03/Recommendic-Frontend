import ConsultantMedication from '@/components/consultant/ConsultantMedication';
import PatientMedication from '@/components/patient/PatientMedication';
import { useUserContext } from '@/context/AuthContext';
import React from 'react'

const Medication = () => {
    const { userContext } = useUserContext();
    return (
        <>
            {
                userContext.role === 'ROLE_PATIENT' 
                ? <PatientMedication />
                : <ConsultantMedication />
            }
        </>
    )
}

export default Medication