
import ConsultantHome from '@/components/consultant/ConsultantHome';
import PatientHome from '@/components/patient/PatientHome';
import { useUserContext } from '@/context/AuthContext';

const Home = () => {
  const { userContext } = useUserContext();
  if (!userContext.role) {
    return null
  }
    return (
        <>
            {
                userContext.role === 'ROLE_PATIENT' 
                ? <PatientHome />
                : <ConsultantHome />
            }
        </>
    )
}

export default Home