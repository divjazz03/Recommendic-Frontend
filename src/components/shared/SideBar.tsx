import clsx from 'clsx'
import { LucideProps, X } from 'lucide-react'
import React from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import InitialsOrAvartar from './InitialsOrAvartar'
import Logo from '../svg/Logo'
import { BaseProfile, ConsultantProfile } from '@/types'
import { useUserContext } from '@/context/AuthContext'


export interface NavLinksObject {
  to: string,
  icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>
  description: string
}
interface SideBarProps {
  navLinks: Record<string, NavLinksObject>
  setAsideHidden: (value: React.SetStateAction<boolean>) => void
  isHidden?: boolean
}
const SideBar: React.FC<SideBarProps> = ({
  navLinks,
  isHidden,
  setAsideHidden
}) => {
  const location = useLocation();
  const { profileData, userContext } = useUserContext();
  const baseProfileData = profileData as BaseProfile;
  const consultantProfileData = profileData as ConsultantProfile;
  const navigate = useNavigate();
  return (
    <nav
      className={clsx('border bg-white overflow-auto flex flex-col pr-3',
        'justify-between h-full')}
    >
      <div className='flex flex-col gap-6'>
        <header className='py-4 items-center pl-4 gap-3'>
          <div className='flex justify-between gap-3'>
            <Logo className='w-8 h-8' />
            <p className='font-berkshire text-main font-bold text-3xl'>Recommendic</p>
            <X className='w-8 h-8' onClick={() => setAsideHidden(true)} />
          </div>

        </header>
        <div className='flex flex-col py-4 justify-between'>
          <ul>
            {Object.entries(navLinks).map(([, nav], index) => (
              <li key={index} >
                <Link onClick={() => setAsideHidden(true)} aria-hidden={isHidden} tabIndex={isHidden ? -1 : 0} to={nav.to} >
                  <div
                    className={clsx(
                      'flex flex-row gap-2 side-bar-icons side-bar-li',
                      location.pathname.startsWith(`${nav.to}/`) || location.pathname === nav.to && 'bg-main text-light-4'
                    )}
                  >
                    <nav.icon className='w-6 h-6' />
                    <p>{nav.description}</p>
                  </div>
                </Link>
              </li>

            ))}

          </ul>
        </div>
      </div>
      <div>
        <hr className='pb-2' />
        <div
          onClick={() => { 
            setAsideHidden(true)
            navigate('profile')}}
          className='flex flex-row gap-2 h-16 pl-5 items-center cursor-pointer'>
          
          <InitialsOrAvartar
            userName={baseProfileData?.userName.full_name} avatarUrl={baseProfileData?.profilePicture.picture_url} />
          <div className='flex flex-col gap-1'>
            <p className='base-bold'>{baseProfileData?.userName.full_name}</p>
            {userContext.userType === 'CONSULTANT' && <p className='tiny-thin'>{consultantProfileData?.specialization}</p>}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default SideBar