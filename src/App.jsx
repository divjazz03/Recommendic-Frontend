import React from 'react'
import SigninForm from './_auth/forms/SigninForm'
import SignupForm from './_auth/forms/SignupForm'
import AuthLayout from './_auth/AuthLayout'
import RootLayout from './_root/RootLayout'
import { Route, Routes } from 'react-router-dom'
import { Home, FindDoctor, About, Apps} from './_root/pages' 
import './index.css' 

const App = () => {
  return (
    <main className='flex h-screen'>
        <Routes>
          {/* Public Routes */}
          <Route element={<AuthLayout/>}>
            <Route path='/signup' index element={<SignupForm/>} />
            <Route path='/signin' element={<SigninForm/>} />
          </Route>

          {/* Private Routes */}
          <Route element={<RootLayout/>}>
            <Route path='/' index element = {<Home/>} />
            <Route path='/finddoctor' element = {<FindDoctor/>} />
            <Route path='/apps' element = {<Apps/>} />
            <Route path='/about' element = {<About/>} />
          </Route>
        </Routes>
    </main>
  )
}

export default App

