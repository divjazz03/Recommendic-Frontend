import clsx from 'clsx'
import { LucideProps, User2 } from 'lucide-react'
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
  isMobile?: boolean
  isHidden?: boolean
  sideBarRef?: React.RefObject<HTMLElement>
  userContext?: AuthUserContext
}
const SideBar: React.FC<SideBarProps> = ({
  navLinks,
  name,
  title,
  specialization,
  onClose,
  isMobile = false,
  isHidden = false,
  sideBarRef,
  userContext
}) => {
  const location = useLocation();
  return (
    <nav
      ref={sideBarRef}
      className={clsx('transition-all ease-linear duration-300 bg-white h-full min-w-[280px] flex flex-col pr-3 z-50',
        isMobile ? 'absolute top-0' : 'hidden lg:flex',
        isMobile && (isHidden ? '-left-[380px]' : 'left-0'),
        !isMobile && 'lg:min-w-[320px] lg:gap-24')}
    >
      <header className='py-4 flex flex-row items-center justify-between pl-3 gap-3'>
        <div className='flex justify-start gap-2'>
          {/* <img src='/assets/svg/logo-no-background.svg' className='max-w-[32px]' /> */}
          <Logo className='w-8 h-8' />
          <p className='font-berkshire text-main font-bold text-3xl'>Recommendic</p>
        </div>
        {isMobile && (
          <img
            src='/assets/svg/cross-svgrepo-com.svg'
            className='max-w-[24px] mr-2 hover:bg-light-4 cursor-pointer'
            onClick={onClose}
          />
        )}
      </header>
      <div className='flex flex-col h-full py-4 justify-between'>
        <ul>
          {Object.entries(navLinks).map(([, nav], index) => (
            <li  key={index} >
              <Link aria-hidden={isMobile && isHidden} tabIndex={isMobile && isHidden ? -1 : 0} to={nav.to} onClick={isMobile ? onClose : undefined}>
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
            <Link aria-hidden={isMobile && isHidden} tabIndex={isMobile && isHidden ? -1 : 0} to={'/consultant'} onClick={isMobile ? onClose : undefined}>
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