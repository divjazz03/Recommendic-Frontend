import { useUserContext } from '@/context/AuthContext';
import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import { FormWrapper } from './forms/FormWrapper';

const AuthLayout = () => {

  const { isAuthenticated } = useUserContext()




  return (
    <>
      {
        isAuthenticated ? (<Navigate to="/" />) :

          (
            <div className=' w-full h-full flex items-center justify-center p-4 bg-gray-50'>
              <div className=' w-full max-w-6xl md:h-[800px] h-[650px]'>
                <FormWrapper>
                  <div className='w-full flex flex-col md:flex-row'>
                    <Outlet />
                    {/*Illustration */}
                    <div className='hidden md:w-1/2 md:flex flex-col justify-center items-center'>
                      <img src='/assets/svg/login.svg' className='w-full' alt='A hanging stethoscope'/>
                      <p className=' bottom-32 font-semibold text-2xl text-center text-main'>Expert guidance for every medical need</p>
                      <p className='p-1 rounded-md font-thin text-xs tracking-tight text-gray-600'>From booking to recommendations, we support every part of your care journey</p>
                    </div>
                  </div>
                </FormWrapper>
              </div>
            </div>
          )
      }
    </>
  )
}

export default AuthLayout