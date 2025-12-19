import GlobalSearch from '@/components/shared/GlobalSearch';
import SideBar, { NavLinksObject } from '@/components/shared/SideBar';
import { useUserContext } from '@/context/AuthContext';
import { Bell, Calendar1Icon, CalendarClock, Home, Menu, PillBottle, User, User2 } from 'lucide-react';
import { MutableRefObject, useEffect, useRef, useState } from 'react'
import { Link, Navigate, Outlet, useLocation } from 'react-router-dom';
import Loader from '@/components/shared/Loader';
import InitialsOrAvartar from '@/components/shared/InitialsOrAvartar';





const RootLayout = () => {
	const [asideHidden, setAsideHidden] = useState(true);
	const location = useLocation();
	const asideRef: MutableRefObject<HTMLDivElement | null> = useRef(null);
	const { userContext: auth, profileData, isLoading, isAuthenticated } = useUserContext();

	const navLinkObject: Record<string, NavLinksObject> = auth.userType === 'CONSULTANT' ? {
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
		medicine: {
			to: '/medication',
			icon: PillBottle,
			description: 'Prescription'
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
			icon: PillBottle,
			description: 'Medication'
		}
	}

	const mobileNavLinks: Record<string, NavLinksObject> = auth.userType === 'CONSULTANT' ? {
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
		medicine: {
			to: '/medication',
			icon: PillBottle,
			description: 'Prescription'
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
		medicine: {
			to: '/medication',
			icon: PillBottle,
			description: 'Medication'
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
	}, [asideHidden])
	if (isLoading) return (
		<div className='flex justify-center items-center h-full'>
			<Loader width={30} height={30}/>
		</div>
	)
	return (
		
			<main className='w-full h-full bg-light-5'>
				<div className='lg:flex lg:flex-row w-full h-full'>
					{/* Main content */}
					<section className='relative w-full h-full flex-1 flex flex-col'>
						<aside ref={asideRef} className={`absolute transition-all ease-out duration-300 h-full w-[20em] top-0 z-50 ${asideHidden ? '-left-[25em]' : 'left-0'}`}>
							<SideBar
								navLinks={navLinkObject}
								isHidden={asideHidden}
								setAsideHidden={setAsideHidden}
							/>
						</aside>

						{/* Laptop header */}
						<header className=' bg-main flex flex-row items-center sm:gap-20 w-full py-2 px-2 justify-between'>
							<div className='flex justify-start gap-3'>
								<Menu className='w-8 h-8 text-light-5' onClick={() => setAsideHidden(false)} />
							</div>
							<div className='w-56 sm:w-96'>
								<GlobalSearch />
							</div>
							<div className='flex items-center justify-end gap-2'>
								<Link onClick={() => setAsideHidden(true)} to={mobileNavLinks.notification.to}>
									<div className={`relative p-2 hover:bg-main-light text-white rounded-lg ${location.pathname === mobileNavLinks.notification.to || location.pathname.startsWith(`${mobileNavLinks.notification.to}/`) ? 'bg-main-light' : ''}`}>
										<mobileNavLinks.notification.icon />
										<div className='absolute top-0 right-0 rounded-full bg-red-500 w-2 h-2'></div>
									</div>
								</Link>
							    <InitialsOrAvartar userName={profileData?.userName.full_name} avatarUrl={profileData?.profilePicture.picture_url} className='w-10 h-10 border' />
								

							</div>


						</header>
						<div className='flex-1 h-full overflow-auto'>
							<Outlet />
						</div>
					</section>

				</div>
			</main>
	)
}

export default RootLayout