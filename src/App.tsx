import { Routes, Route, matchRoutes } from 'react-router-dom';
import './index.css';
import SigninForm from './_auth/forms/SigninForm';
import { Home } from './_root/pages';
import SignupForm from './_auth/forms/SignupForm';
import AuthLayout from './_auth/AuthLayout';
import RootLayout from './_root/RootLayout';
import Welcome from './_public/Welcome';
import { Toaster } from './components/ui/toaster';
import Landing from './_public/Landing';


const App = () => {
  return (
    <main className='flex h-screen'>
      <Routes>
        {/* Public Routes*/}
        <Route path='/landing' element={<Landing />}/>
        <Route path='/welcome' element={<Welcome />} />

        <Route element={<AuthLayout />}>
          <Route path='/sign-in' element={<SigninForm />} />
          <Route path='/sign-up' element={<SignupForm />} />
        </Route>

        {/* Private Routes*/}

        <Route element={<RootLayout />}>
          <Route index element={<Home />} />
        </Route>
      </Routes>

      <Toaster />
    </main>
  )
}

export default App