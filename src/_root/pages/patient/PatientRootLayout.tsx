import InitialsOrAvartar from '@/components/shared/InitialsOrAvartar';
import GlobalSearch from '@/components/shared/GlobalSearch';
import React, { MutableRefObject, useEffect, useRef, useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { Bell, Calendar1Icon, CalendarClock, ChartLine, MessageSquareMoreIcon, PillBottle, Settings2, Users } from 'lucide-react';
import SideBar from '@/components/SideBar';

const navLinkObject = {
	overview: {
		to: '/patient/overview',
		icon: ChartLine,
		description: 'overview'
	},
	appointment: {
		to: '/patient/appointment',
		icon: CalendarClock,
		description: 'appointment'
	},
	consultant: {
		to: '/patient/patient',
		icon: Users,
		description: 'Patients'
	},
	schedule: {
		to: '/patient/schedule',
		icon: Calendar1Icon,
		description: 'Schedule'
	},
	chat: {
		to: '/patient/chat',
		icon: MessageSquareMoreIcon,
		description: 'Chat'
	},
	medication: {
		to: '/patient/medication',
		icon: ChartLine,
		description: 'medication'
	},
	notification: {
		to: '/patient/notification',
		icon: Bell,
		description: 'Notification'
	},
	setting: {
		to: '/patient/setting',
		icon: Settings2,
		description: 'Setting'
	},
}

const PatientRootLayout = () => {

	const [asideHidden, setAsideHidden] = useState(true);
	const location = useLocation();
	const asideRef: MutableRefObject<HTMLElement|null> = useRef(null);

	useEffect(() => {
			//const { user } = useUserContext();
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
		<main className='relative bg-light-4 min-w-[320px] max-w-full h-screen overflow-hidden'>
			<div className='border-2'>

				{/* Mobile Header */}
				<header className='lg:hidden sticky top-0 bg-white'>
					<div className='flex flex-row h-20 items-center justify-start w-full border gap-2 pt-4 pl-3'>
						<img src='/assets/svg/logo-no-background.svg' className='max-w-[32px]' />
						<p className='font-berkshire text-main font-bold text-3xl'>Recommendic</p>
					</div>
					<div className='flex flex-row justify-between items-center'>
						<div className='flex flex-row gap-2 px-1 py-2'>
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
					name='Maduka Divine'
					title='Dr. Maduka'
					specialization='Veterinary'
					isMobile
					isHidden={asideHidden}
					onClose={handleMenuClick}
				/>

				<div className='lg:flex lg:flex-row w-full h-screen'>

					{/* Desktop Sidebar */}
					<SideBar
						navLinks={navLinkObject}
						name='Maduka Divine'
						title='Dr. Maduka'
						specialization='Veterinary'
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

export default PatientRootLayout