import ConsultantList from '@/_root/pages/patient/ConsultantList'
import ConsultantScreen from '@/_root/pages/patient/ConsultantScreen'
import LocalSearch from '@/components/LocalSearch'
import { ConsultantType, ConsultantTypeMinimal } from '@/types';
import React, { useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom';
import { number } from 'zod';








const Consultant = () => {
  return (
    <div className='flex flex-col space-y-2 bg-blue-50 w-full h-full p-2 rounded-md'>
      <section className='h-full'>
        <Outlet />
      </section>
    </div>
  )
}

export default Consultant