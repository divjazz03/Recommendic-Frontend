import React from 'react'
import { Outlet,Navigate } from 'react-router-dom'

import { Header } from './pages/pageFragments'

const RootLayout = () => {
  
  return (
    <>
      <div className=' mx-10 my-8 lg:mx-24 xl:mx-32 2xl:mx-40 transition-all ease-linear duration-100'>
        <Header/>
        <section>
          <Outlet />
        </section>
      </div>
    
    </>
  )
}

export default RootLayout