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
              <div className='flex flex-row'>
                <div className='flex flex-col gap-4 w-full h-screen'>
                  <header className='py-4 w-full flex flex-row pl-3 gap-3 shadow-sm shadow-gray-300'>
                    <div className='flex justify-start gap-2'>
                      <img src='/assets/svg/logo-no-background.svg' className='max-w-10' />
                      <p className='font-berkshire text-dark-1 h1-bold'>Recommendic</p>
                    </div>
                  </header>
                  <div className='w-full flex flex-col h-full justify-center items-center'>
                    <section className='flex bg-light-5 flex-1 justify-center items-center flex-col '>
                      <Outlet />
                    </section>
                  </div>
                </div>
                <img src='/assets/images/loginSmall.jpg'
                  alt='logo'
                  className='hidden xl:block h-screen w-4/10 object-cover object-top bg-no-repeat' />
              </div>
            </>
          )
      }
    </>
  )
}

export default AuthLayout