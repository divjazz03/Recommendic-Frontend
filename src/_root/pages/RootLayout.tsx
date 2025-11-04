import MobileNavBar from '@/components/MobileNavBar';
import GlobalSearch from '@/components/shared/GlobalSearch';
import SideBar, { NavLinksObject } from '@/components/SideBar';
import Logo from '@/components/svg/Logo';
import { useUserContext } from '@/context/AuthContext';
import { Bell, Calendar1Icon, CalendarClock, ChartLine, Home, Loader, Menu, Settings2, User, User2 } from 'lucide-react';
import React, { MutableRefObject, useEffect, useRef, useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom';





const RootLayout = () => {
	const [asideHidden, setAsideHidden] = useState(true);
	const location = useLocation();
	const asideRef: MutableRefObject<HTMLDivElement | null> = useRef(null);
	const { userContext: auth, profileData, isLoading } = useUserContext();
	const navLinkObject: Record<string, NavLinksObject> = auth.userType === 'CONSULTANT'? {
		home: {
			to: '/',
			icon: Home,
			description: 'Home'
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
	} : {
		home: {
			to: '/',
			icon: Home,
			description: 'Home'
		},
		appointment: {
			to: '/appointment',
			icon: CalendarClock,
			description: 'Appointment'
		},
		consultant: {
			to: '/consultants',
			icon: User2,
			description: 'Consultant'
		},
		medication: {
			to: '/medication',
			icon: ChartLine,
			description: 'Medication'
		}
	}
	
	const mobileNavLinks: Record<string, NavLinksObject>  = auth.userType === 'CONSULTANT'? {
		home: {
			to: '/',
			icon: Home,
			description: 'Home'
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
		me: {
			to: '/profile',
			icon: User,
			description: 'Me'
		},
		notification: {
			to: '/notification',
			icon: Bell,
			description: 'Notification'
		},
	} : {
		home: {
			to: '/',
			icon: Home,
			description: 'Home'
		},
		consultant: {
			to: '/consultants',
			icon: User2,
			description: 'Consultants'
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
		me: {
			to: '/profile',
			icon: User,
			description: 'Me'
		},
		notification: {
			to: '/notification',
			icon: Bell,
			description: 'Notification'
		},
	}

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
	return (
		isLoading ? <div className='flex justify-center h-full items-center '><Loader className=' animate-spin' /></div>
			:
			<main className='bg-light-4 min-w-[320px] w-full h-full'>
				<div className='lg:flex lg:flex-row  h-full'>




					{/* Main content */}
					<section className='relative w-full h-full flex-1 flex flex-col '>
						<div ref={asideRef} className={`absolute transition-all duration-200 h-full w-[20em] top-0 z-50 ${asideHidden ? '-left-[20em]' : 'left-0'}`}>
							<SideBar
								navLinks={navLinkObject}
								isHidden={asideHidden}
								setAsideHidden={setAsideHidden}
							/>
						</div>

						{/* Mobile Header */}
						<header className='lg:hidden bg-white'>
							<div className='flex flex-row h-20 items-center justify-between w-full border gap-2 pt-4 pl-3'>
								<div className='flex flex-row justify-start gap-4 items-center'>
									<Logo className='w-8 h-8' />
									<p className='font-berkshire text-main font-bold text-3xl'>{location.pathname.split('/')[1] || ''}</p>
								</div>
								<div className='flex gap-4'>
									<Link to={mobileNavLinks.notification.to}>
										<div className={`relative p-2 hover:bg-main-light hover:text-white rounded-lg ${location.pathname === mobileNavLinks.notification.to || location.pathname.startsWith(`${mobileNavLinks.notification.to}/`)? 'text-white bg-main':''}`}>
											<mobileNavLinks.notification.icon />
											<div className='absolute top-0 right-0 rounded-full bg-red-500 w-2 h-2'></div>
										</div>
									</Link>
									<GlobalSearch />
								</div>

							</div>
						</header>
						{/* Laptop header */}
						<header className='hidden lg:flex bg-white w-full border-b py-2 px-2 justify-between'>
							<div className='flex justify-start gap-3'>
								<Menu className='w-8 h-8' onClick={() => setAsideHidden(false)} />
								<Logo className='w-8 h-8' />
								<p className='font-berkshire text-main font-bold text-3xl'>Recommendic</p>
							</div>
							<div className='flex gap-2'>
							<Link to={mobileNavLinks.notification.to}>
										<div className={`relative p-2 hover:bg-main-light hover:text-white rounded-lg ${location.pathname === mobileNavLinks.notification.to || location.pathname.startsWith(`${mobileNavLinks.notification.to}/`)? 'text-white bg-main':''}`}>
											<mobileNavLinks.notification.icon />
											<div className='absolute top-0 right-0 rounded-full bg-red-500 w-2 h-2'></div>
										</div>
									</Link>
							<GlobalSearch />
							</div>
						</header>
						<div className='flex-1 h-full border-gray-950 overflow-auto'>
							<Outlet />
						</div>
						<div className='lg:hidden h-20 flex flex-col justify-center bg-white shadow-lg'>
							<MobileNavBar navLinkObject={mobileNavLinks}/>
						</div>
					</section>

				</div>
			</main>
	)
}

export default RootLayout