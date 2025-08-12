import GlobalSearch from '@/components/shared/GlobalSearch';
import SideBar from '@/components/SideBar';
import Logo from '@/components/svg/Logo';
import { useUserContext } from '@/context/AuthContext';
import { Bell, Calendar1Icon, CalendarClock, ChartLine, Loader, Settings2 } from 'lucide-react';
import React, { MutableRefObject, useEffect, useRef, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom';

const navLinkObject = {
    overview: {
        to: '/overview',
        icon: ChartLine,
        description: 'Overview'
    },
    appointment: {
        to: '/appointment',
        icon: CalendarClock,
        description: 'Appointment'
    },
    schedule: {
        to: '/schedule',
        icon: Calendar1Icon,
        description: 'Schedule'
    },
    medication: {
        to: '/medication',
        icon: ChartLine,
        description: 'Medication'
    },
    notification: {
        to: '/notification',
        icon: Bell,
        description: 'Notification'
    },
    setting: {
        to: '/settings',
        icon: Settings2,
        description: 'Setting'
    },
}

const RootLayout = () => {
    const [asideHidden, setAsideHidden] = useState(true);
	const location = useLocation();
	const asideRef: MutableRefObject<HTMLElement | null> = useRef(null);
	const {userContext:auth, profileData,  isLoading} = useUserContext();

	useEffect(() => {
		function handleClickOutside(event: MouseEvent) {
			if (asideRef.current && !asideRef.current.contains(event.target as Node)) {
				setAsideHidden(true);
			}
		}
		function handleEsc(event: KeyboardEvent) {
			if (event.key === 'Escape') {
				setAsideHidden(true);
			}
		}

		document.addEventListener('mousedown', handleClickOutside);
		document.addEventListener('keydown', handleEsc);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
			document.removeEventListener('keydown', handleEsc);
		}
	}, [])

	const handleMenuClick = () => {
		setAsideHidden(aside => !aside);
	};
  return (
	isLoading ? <div className='flex justify-center h-full items-center '><Loader className=' animate-spin' /></div>  :
    <main className='relative bg-light-4 min-w-[320px] max-w-full h-screen overflow-hidden'>
			<div className='border-2'>

				{/* Mobile Header */}
				<header className='lg:hidden sticky top-0 bg-white'>
					<div className='flex flex-row h-20 items-center justify-start w-full border gap-2 pt-4 pl-3'>
						{/* <img src='/assets/svg/logo-no-background.svg' className='max-w-[32px]' /> */}
						<Logo className='w-8 h-8' />
						<p className='font-berkshire text-main font-bold text-3xl'>Recommendic</p>
					</div>
					<div className='flex flex-row justify-between items-center '>
						<div className='flex flex-row items-center gap-2 px-1 py-2'>
							<div className='p-2 flex justify-center items-center hover:bg-light-4 rounded-sm' onClick={handleMenuClick}>
								<img src='/assets/svg/bars-solid.svg' className='min-w-[24px]' />
							</div>
							<p className='items-center body-medium capitalize'>
								{location.pathname.split('/')[2] || ''}
							</p>
						</div>
						<GlobalSearch />
					</div>
				</header>

				{/* Mobile Sidebar */}
				<SideBar
					navLinks={navLinkObject}
					sideBarRef={asideRef}
					name={profileData?.userName?.full_name ?? 'Guest'}
					specialization={undefined}
					isMobile
					isHidden={asideHidden}
					onClose={handleMenuClick}
					userContext={auth}
				/>

				<div className='lg:flex lg:flex-row w-full h-screen'>

					{/* Desktop Sidebar */}
					<SideBar
						navLinks={navLinkObject}
						name='Maduka Divine'
						title='Dr. Maduka'
						specialization='Veterinary'
						userContext={auth}
					/>

					{/* Main content */}
					<section className='w-full h-full flex flex-col gap-2'>
						<div className='hidden w-full min-h-10 lg:flex flex-row justify-end lg:mb-3'>
							<GlobalSearch />
						</div>
						<Outlet />
					</section>

				</div>
			</div>
		</main>
  )
}

export default RootLayout