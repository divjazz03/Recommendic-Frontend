import { Routes, Route, matchRoutes } from 'react-router-dom';
import './index.css';
import SigninForm from './_auth/forms/SigninForm';
import { Overview } from './_root/pages';
import SignupForm from './_auth/forms/SignupForm';
import AuthLayout from './_auth/AuthLayout';
import RootLayout from './_root/RootLayout';
import Welcome from './_public/Welcome';
import { Toaster } from './components/ui/toaster';
import Landing from './_public/Landing';
import ConfirmEmail from './_auth/forms/ConfirmEmail';
import EmailConfirmation from './_auth/forms/EmailConfirmation';
import Onboarding from './_root/pages/Onboarding';
import Appointment from './_root/pages/Appointment';
import Patient from './_root/pages/Patient';
import Consultant from './_root/pages/Consultant';
import { Schedule } from './_root/pages/Schedule';
import Chat from './_root/pages/Chat';
import Medication from './_root/pages/Medication';
import Notification from './_root/pages/Notification';
import Settings from './_root/pages/Settings';


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
        <Route element={<RootLayout />}>
          <Route path='/onboarding' element={<Onboarding />} />

          <Route path='/overview' element={<Overview />} />
          <Route path='/appointment' element={<Appointment />}/>
          <Route path='/patient' element={<Patient/>}/>
          <Route path='/consultant' element={<Consultant />} />
          <Route path='/schedule' element={<Schedule />} />
          <Route path='/chat' element={<Chat />} />
          <Route path='/medication' element={<Medication/>} />
          <Route path='/notification' element={<Notification />} />
          <Route path='/settings' element={<Settings />} />
        </Route>
      </Routes>

      <Toaster />
    </main>
  )
}

export default App