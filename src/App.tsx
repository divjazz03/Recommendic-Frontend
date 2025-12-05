import { Routes, Route } from 'react-router-dom';
import './index.css';
import SigninForm from './_auth/forms/SigninForm';
import SignupForm from './_auth/forms/SignupForm';
import AuthLayout from './_auth/AuthLayout';
import Welcome from './_public/Welcome';
import { Toaster } from './components/ui/sonner';
import Landing from './_public/Landing';
import ConfirmEmail from './_auth/forms/ConfirmEmail';
import EmailConfirmation from './_auth/forms/EmailConfirmation';
import Notification from './_root/pages/Notification';
import RootLayout from './_root/pages/RootLayout';
import Consultant from './components/patient/Consultant';
import ConsultantList from './components/patient/ConsultantList';
import Schedule from '@/_root/pages/Schedule';
import { useUserContext } from '@/context/AuthContext';
import { PatientSchedule } from './components/patient/PatientSchedule';
import ConsultantSchedule from './components/consultant/ConsultantSchedule';
import ConsultantNewSchedule from './components/consultant/ConsultantNewSchedule';
import ConsultantModifySchedule from './components/consultant/ConsultantModifySchedule';
import ConsultantScheduleDisplay from './components/consultant/ConsultantScheduleDisplay';
import Home from '@/_root/pages/Home';
import Onboarding from '@/_root/pages/Onboarding';
import Medication from '@/_root/pages/Medication';
import Settings from '@/_root/pages/Settings';
import Appointment from './_root/pages/Appointment';
import Consultation from './_root/pages/Consultation';
import Profile from './_root/pages/Profile';
import { ErrorBoundary } from './components/shared/ErrorBoundary';
import ConsultantScreen from './components/patient/ConsultantScreen';
import Chat from './_root/pages/Chat';


const App = () => {
  const { userContext } = useUserContext();
  
  return (
    <main className='h-screen w-screen'>
      <ErrorBoundary>
        <Routes>
        {/* Public Routes*/}
        <Route path='/landing' element={<Landing />} />
        <Route path='/welcome' element={<Welcome />} />
        <Route element={<AuthLayout />}>
          <Route path='/sign-in' element={<SigninForm />} />
          <Route path='/sign-up' element={<SignupForm />} />
          <Route path='/confirm-email' element={<ConfirmEmail />} />
          <Route path='/email-confirmation/:token' element={<EmailConfirmation />} />
        </Route>

        {/* Private Routes*/}
        <Route path='/onboarding' element={<Onboarding />} />
        <Route element={<RootLayout/>}>
          <Route index element={<Home />} />
          <Route path='/profile' element={<Profile/>}/>
          <Route path='/chat' element={<Chat/>}/>
          <Route path='/consultants' element={<Consultant/>}>
            <Route index element={<ConsultantList />} />
            <Route path='profile' element={<ConsultantScreen />} />
          </Route>
          <Route path='/schedule' element={<Schedule />} >
            {userContext && userContext.userType === 'PATIENT'
              ? <Route index element={<PatientSchedule />} />
              : <Route element={<ConsultantSchedule />}>
                <Route index element={<ConsultantScheduleDisplay />} />
                <Route path='new' element={<ConsultantNewSchedule />} />
                <Route path='modify' element={<ConsultantModifySchedule />} />
              </Route>}
          </Route>
          <Route path='/medication' element={<Medication />} />
          <Route path='/notification' element={<Notification />} />
          <Route path='/settings' element={<Settings />} />
          <Route path='/appointment' element={<Appointment/>} />
          <Route path='/consultation' element={<Consultation />} />
        </Route>
      </Routes>
      </ErrorBoundary>
      <Toaster />
    </main>
  )
}

export default App