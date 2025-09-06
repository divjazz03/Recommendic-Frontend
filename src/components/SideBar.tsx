import clsx from 'clsx'
import { HamIcon, LucideProps, Menu, User2, X } from 'lucide-react'
import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import InitialsOrAvartar from './shared/InitialsOrAvartar'
import Logo from './svg/Logo'
import { AuthUserContext } from '@/types'


export interface NavLinksObject {
  to: string,
  icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>
  description: string
}
interface SideBarProps {
  navLinks: Record<string, NavLinksObject>
  name: string
  title?: string
  specialization?: string
  onClose?: () => void
  setAsideHidden?: (value: React.SetStateAction<boolean>) => void
  isHidden?: boolean
  userContext?: AuthUserContext
}
const SideBar: React.FC<SideBarProps> = ({
  navLinks,
  name,
  title,
  specialization,
  onClose,
  isHidden,
  setAsideHidden,
  userContext
}) => {
  const location = useLocation();
  return (
    <nav
      className={clsx('border bg-white overflow-auto flex flex-col pr-3',
        'justify-between h-full')}
    >
      <div className='flex flex-col gap-6'>
        <header className='py-4 items-center pl-4 gap-3'>
          <div className='flex justify-between gap-3'>
            {/* <img src='/assets/svg/logo-no-background.svg' className='max-w-[32px]' /> */}
            <Logo className='w-8 h-8' />
            <X className='w-8 h-8' onClick={() => setAsideHidden(true)}/>
          </div>

        </header>
        <div className='flex flex-col py-4 justify-between'>
          <ul>
            {Object.entries(navLinks).map(([, nav], index) => (
              <li key={index} >
                <Link aria-hidden={isHidden} tabIndex={isHidden ? -1 : 0} to={nav.to} >
                  <div
                    className={clsx(
                      'flex flex-row gap-2 side-bar-icons side-bar-li',
                      location.pathname.startsWith(nav.to) && 'bg-main text-light-4'
                    )}
                  >
                    <nav.icon className='w-6 h-6' />
                    <p>{nav.description}</p>
                  </div>
                </Link>
              </li>

            ))}
            {userContext && userContext.userType === 'PATIENT' && <li>
              <Link aria-hidden={isHidden} tabIndex={isHidden ? -1 : 0} to={'/consultant'}>
                <div
                  className={clsx(
                    'flex flex-row gap-2 side-bar-icons side-bar-li',
                    location.pathname.startsWith('/consultant') && 'bg-main text-light-4'
                  )}
                >
                  <User2 className='w-6 h-6' />
                  <p>Consultant</p>
                </div>
              </Link>
            </li>}
          </ul>
        </div>
      </div>
      <div>
        <hr className='pb-2' />
        <div className='flex flex-row gap-2 min-h-10 pl-5'>
          <InitialsOrAvartar name={name} />
          <div className='flex flex-col gap-1'>
            <p className='base-bold'>{title}</p>
            <p className='tiny-thin'>{specialization}</p>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default SideBar