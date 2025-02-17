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
              <div>
                <header className='absolute top-5 -left-48'>
                  <img src='/assets/svg/logo.svg' className='max-w-[720px]'/>
                </header>
              </div>
              <section className='flex flex-1 justify-center items-center flex-col '>
                <Outlet />
              </section>
              <img src='/assets/images/loginSmall.jpg'
                alt='logo'
                className='hidden xl:block brightness-75 h-screen w-4/10 object-cover object-top bg-no-repeat' />
            </>
          )
      }
    </>
  )
}

export default AuthLayout