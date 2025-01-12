import { Label } from '@radix-ui/react-label';
import { Section } from 'lucide-react';
import React, { useState } from 'react'
import { Outlet, Navigate } from 'react-router-dom'

const AuthLayout = () => {

  const isAuthenticated = false;
  const [typeOfUser, setTypeOfUser] = useState<string>("Patient")



  return (
    <>
      {
        isAuthenticated ? (<Navigate to="/" />) :

          (
            <>
              <section className='flex flex-1 justify-center items-center flex-col '>
                <Outlet />
              </section>
              <img src='/assets/images/loginSmall.jpg'
                alt='logo'
                className='hidden md:block h-screen w-1/2 object-cover bg-no-repeat' />
            </>
          )
      }
    </>
  )
}

export default AuthLayout