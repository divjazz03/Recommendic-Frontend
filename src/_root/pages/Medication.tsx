import ConsultantMedication from '@/components/consultant/ConsultantMedication';
import PatientMedication from '@/components/patient/PatientMedication';
import { useUserContext } from '@/context/AuthContext';

const Medication = () => {
    const { userContext } = useUserContext();

    if (!userContext.role) {
        return null
    }
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