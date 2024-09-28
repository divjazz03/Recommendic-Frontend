import React from 'react'

const ServicesCard = ({icon, name, description}) => {
  return (
    <div className='flex justify-evenly hover:backdrop-blur-sm flex-col gap-3 w-64  h-64 p-5 shadow-sm hover:shadow-lg rounded-lg'>
        {icon}
        <h1 className='font-semibold text-lg'>{name}</h1>
        <p className='font-light text-slate-700 text-wrap text-sm'>{description}</p>
    </div>
  )
}

export default ServicesCard