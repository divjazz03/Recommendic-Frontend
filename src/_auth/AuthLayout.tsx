import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'

const AuthLayout = () => {

  const isAuthenticated = false;



  return (
    <>
      {
        isAuthenticated ? (<Navigate to="/" />) :

          (
            <>
              <div className='flex flex-row h-full'>
                <div className='flex flex-col gap-4 w-full h-full'>
                  <header className='py-4 w-full flex flex-row pl-3 gap-3'>
                    <div className='flex justify-start gap-2'>
                      <img src='/assets/svg/logo-no-background.svg' className='max-w-10' />
                      <p className='font-berkshire text-main font-bold text-4xl'>Recommendic</p>
                    </div>
                  </header>
                  <div className='w-full flex flex-col h-full justify-center items-center'>
                    <section className='flex flex-1 justify-center items-center flex-col '>
                      <Outlet />
                    </section>
                  </div>
                </div>
                <img src='/assets/images/loginSmall.jpg'
                  alt='logo'
                  className='hidden xl:block h-full w-1/2 rounded-tl-[30rem] rounded-bl-[30rem] bg-right-top bg-no-repeat opacity-95' />
              </div>
            </>
          )
      }
    </>
  )
}

export default AuthLayout