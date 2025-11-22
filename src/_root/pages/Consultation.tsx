import ConsultantConsultation from '@/components/consultant/consultation/ConsultantConsultation';
import PatientConsultation from '@/components/patient/PatientConsultation';
import { useUserContext } from '@/context/AuthContext';

const Consultation = () => {

  const {userContext} = useUserContext()
  if(!userContext.userType) {
    return null
  }
  return (
    <>
      {userContext.userType === 'CONSULTANT'? 
      <ConsultantConsultation /> : <PatientConsultation />}
    </>
  )
}

export default Consultation