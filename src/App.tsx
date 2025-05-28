import { Routes, Route, matchRoutes } from 'react-router-dom';
import './index.css';
import SigninForm from './_auth/forms/SigninForm';
import SignupForm from './_auth/forms/SignupForm';
import AuthLayout from './_auth/AuthLayout';
import Welcome from './_public/Welcome';
import { Toaster } from './components/ui/toaster';
import Landing from './_public/Landing';
import ConfirmEmail from './_auth/forms/ConfirmEmail';
import EmailConfirmation from './_auth/forms/EmailConfirmation';
import Chat from './_root/pages/Chat';
import Medication from './_root/pages/Medication';
import Notification from './_root/pages/Notification';
import ConsultantRootLayout from './_root/pages/consultant/ConsultantRootLayout';
import ConsultantOnboarding from './_root/pages/consultant/ConsultantOnboarding';
import ConsultantOverview from './_root/pages/consultant/ConsultantOverview';
import Patient from './_root/pages/consultant/Patient';
import { ConsultantSchedule } from './_root/pages/consultant/ConsultantSchedule';
import ConsultantSettings from './_root/pages/consultant/ConsultantSettings';
import PatientRootLayout from './_root/pages/patient/PatientRootLayout';
import PatientOnboarding from './_root/pages/patient/PatientOnboarding';
import PatientOverview from './_root/pages/patient/PatientOverview';
import Consultant from './_root/pages/patient/Consultant';
import { PatientSchedule } from './_root/pages/patient/PatientSchedule';
import PatientSettings from './_root/pages/patient/PatientSettings';


const App = () => {
  return (
    <main className=' h-screen w-screen'>
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
        {/*Consultant routes*/}
        <Route  element={<ConsultantRootLayout />}>
          <Route path='/consultant/onboarding' element={<ConsultantOnboarding />} />
          <Route path='/consultant/overview' element={<ConsultantOverview />} />
          <Route path='/consultant/patient' element={<Patient/>}/>
          <Route path='/consultant/schedule' element={<ConsultantSchedule />} />
          <Route path='/consultant/chat' element={<Chat/>} />
          <Route path='/consultant/medication' element={<Medication/>} />
          <Route path='/consultant/notification' element={<Notification />} />
          <Route path='/consultant/settings' element={<ConsultantSettings />} />
        </Route>
        <Route element={<PatientRootLayout />}>
          <Route path='/patient/onboarding' element={<PatientOnboarding />} />
          <Route path='/patient/overview' element={<PatientOverview />} />
          <Route path='/patient/consultant' element={<Consultant/>}/>
          <Route path='/patient/schedule' element={<PatientSchedule />} />
          <Route path='/patient/chat' element={<Chat/>} />
          <Route path='/patient/medication' element={<Medication/>} />
          <Route path='/patient/notification' element={<Notification />} />
          <Route path='/patient/settings' element={<PatientSettings />} />
        </Route>
      </Routes>

      <Toaster />
    </main>
  )
}

export default App