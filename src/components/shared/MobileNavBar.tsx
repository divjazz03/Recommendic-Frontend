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

  function getLinkColor(navLinkObject: NavLinksObject) {
  if (navLinkObject.to === '/') {
    return location.pathname === navLinkObject.to
  } else {
    return location.pathname.startsWith(navLinkObject.to)
  }
}
  return (
    <div className=''>
      <ul className='flex justify-around px-2'>
        {Object.entries(navLinkObject).filter(([,nav],_) => nav.description !== 'Notification').map(([, nav], index) => (
          <li key={index}>
            <Link to={nav.to}>
              <div
                className={`
                  flex flex-col py-2 px-2 w-16 xs:w-20 sm:w-24 gap-1 justify-center items-center rounded-lg ${getLinkColor(nav)? 'text-light-3 bg-main-light': 'text-gray-700 '} `
                }
              >
                <nav.icon className={clsx('w-5 h-5 sm:w-6 sm:h-6')}/>
                <p className='text-xs sm:text-sm font-normal sm:font-semibold'>{nav.description}</p>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default MobileNavBar