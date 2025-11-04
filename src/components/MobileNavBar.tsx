import React from 'react'
import { NavLinksObject } from './SideBar'
import { Link } from 'react-router-dom'
import clsx from 'clsx'


interface MobileNavBarProps{
  navLinkObject: Record<string, NavLinksObject>
}

const MobileNavBar:React.FC<MobileNavBarProps> = ({
  navLinkObject
}) => {
  return (
    <div className=''>
      <ul className='flex justify-around'>
        {Object.entries(navLinkObject).filter(([,nav],_) => nav.description !== 'Notification').map(([, nav], index) => (
          <li key={index}>
            <Link to={nav.to}>
              <div
                className={`
                  flex flex-col py-1 px-2 gap-2 justify-center items-center ${location.pathname.startsWith(nav.to)? 'text-dark-3': 'text-gray-700'} `
                }
              >
                <nav.icon className={clsx('w-6 h-6')}/>
                <p className='text-sm font-semibold'>{nav.description}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default MobileNavBar