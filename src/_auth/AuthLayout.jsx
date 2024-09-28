import React from 'react'
import { Outlet, Navigate } from 'react-router-dom'

import LoginSmall from '../../assets/images/loginSmall.jpg'

const AuthLayout = () => {
  const isAuthenticated = false;

  return (
    <>
      {
      isAuthenticated ? (
        <Navigate to='/'/>
      ): (
        <>
          <section className='flex flex-1 justify-center items-center flex-col py-10'>
            <Outlet />
          </section>
          <img src={LoginSmall} alt='logo' className='hidden md:block h-screen w-1/2 object-cover bg-no-repeat'/>
        </>
      )}
    </>
  )
}

export default AuthLayout