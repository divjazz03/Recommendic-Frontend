
import ConsultantProfile from '@/components/consultant/ConsultantProfile'
import PatientProfile from '@/components/patient/PatientProfile'
import { useUserContext } from '@/context/AuthContext'
import React from 'react'

const Profile = () => {
    const {userContext} = useUserContext()
  return (
    <>{userContext.userType === 'CONSULTANT'? <ConsultantProfile />: <PatientProfile/>}
    
    </>
  )
}

export default Profile