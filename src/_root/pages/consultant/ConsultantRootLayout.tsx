import InitialsOrAvartar from '@/components/InitialsOrAvartar';
import GlobalSearch from '@/components/shared/GlobalSearch';
import { Input } from '@/components/ui/input';
import { useUserContext } from '@/context/AuthContext';
import React, { MutableRefObject, useEffect, useRef, useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'

const ConsultantRootLayout = () => {

	const [asideHidden, setAsideHidden] = useState(true);
	const { userContext } = useUserContext();
	const location = useLocation();
	const menuRefs = {
		"/overview": useRef<HTMLDivElement>(null),
		"/patient": useRef<HTMLDivElement>(null),
		"/schedule": useRef<HTMLDivElement>(null),
		"/chat": useRef<HTMLDivElement>(null),
		"/medication": useRef<HTMLDivElement>(null),
		"/notification": useRef<HTMLDivElement>(null),
		"/settings": useRef<HTMLDivElement>(null)
	}
	const asideRef: MutableRefObject<HTMLElement> = useRef(null);

	useEffect(() => {
		const currentRef: MutableRefObject<HTMLDivElement> = menuRefs[location.pathname];
		if (currentRef && currentRef.current) {
			currentRef.current.focus();
		}
	}, [location.pathname]);

	useEffect(() => {
		function handleClickOutside(event) {
			if (asideRef.current && !asideRef.current.contains(event.target)) {
				setAsideHidden(true);
			}
		}

		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, [])

	const handleMenuClick = () => {
		setAsideHidden(aside => !aside);
	};
	return (
		<main className='relative bg-white min-w-[320px] max-w-full h-screen overflow-hidden'>
			<div className='border-2'>
				<header className='lg:hidden sticky top-0 bg-white'>
					<div className='flex flex-row justify-start w-full border gap-2 pt-4 pl-3'>
						<img src='/assets/svg/logo-no-background.svg' className='max-w-[32px]' />
						<p className='font-berkshire text-main h1-bold'>Recommendic</p>
					</div>
					<div className='flex flex-row justify-between items-center'>
						<div className=' flex flex-row gap-2 px-1 py-2 lg:hidden'>
							<div className='p-2 flex flex-row justify-center hover:bg-light-4 items-center rounded-sm' onClick={handleMenuClick}>
								<img src='/assets/svg/bars-solid.svg' className='min-w-[24px] ' />
							</div>
							<div className='flex flex-col justify-center items-center'>
								<p className='items-center body-medium'>
									{
										location.pathname.substring(1)
										.split('/')[1]
										.charAt(0)
										.toUpperCase()
										.concat(location.pathname.substring(1)
										.split('/')[1]
										.slice(1))
									}
								</p>
							</div>
						</div>
						<GlobalSearch />
					</div>
				</header>
				<aside ref={asideRef} className={`${asideHidden ? ' -left-[380px]' : 'left-0'} absolute z-50 lg:hidden h-full min-w-[320px] top-0 transition-all ease-linear duration-300`}>
					<div className='min-w-fit w-full flex flex-col pr-3 h-full bg-white'>
						<header className='py-4 flex flex-row justify-between pl-3 gap-3'>
							<div className='flex justify-start gap-2'>
								<img src='/assets/svg/logo-no-background.svg' className='max-w-[32px]' />
								<p className='font-berkshire text-main h1-bold'>Recommendic</p>
							</div>
							<img src='/assets/svg/cross-svgrepo-com.svg' className='max-w-[24px] mr-2 hover:bg-light-4' onClick={handleMenuClick} />
						</header>
						<div className='flex flex-col h-full py-4 justify-between'>
							<div>
								<ul>
									<li>
										<Link to={"/consultant/overview"}>
											<div className='flex flex-row gap-2 side-bar-icons side-bar-li' ref={menuRefs["/overview"]}>
												<img src='/assets/svg/overview-svgrepo-com.svg' className='max-w-[24px]' />
												<p>Overview</p>
											</div>
										</Link>
									</li>
									<li>
										<Link to={"/consultant/patient"}>
											<div className='flex flex-row gap-2 side-bar-icons side-bar-li' ref={menuRefs["/patient"]}>
												<img src='/assets/svg/people-svgrepo-com.svg' className='max-w-[24px]' />
												<p>Patients</p>
											</div>
										</Link>
									</li>
									<li>
										<Link to={"/consultant/schedule"}>
											<div className='flex flex-row gap-2 side-bar-icons side-bar-li' ref={menuRefs["/schedule"]}>
												<img src='/assets/svg/schedule-svgrepo-com.svg' className='max-w-[24px]' />
												<p>Schedule</p>
											</div>
										</Link>
									</li>
									<li >
										<Link to={"/consultant/chat"}>
											<div className='flex flex-row gap-2 side-bar-icons side-bar-li' ref={menuRefs["/chat"]}>
												<div className='relative block max-w-fit max-h-fit'>
													<img src='/assets/svg/chats-svgrepo-com.svg' className='min-w-6 max-w-6' />
													<div className='absolute min-h-2 min-w-2 rounded-full bg-red-600 top-0 right-0'></div>
												</div>
												<p>Chats</p>
											</div>
										</Link>
									</li>
									<li >
										<Link to={"/consultant/medication"}>
											<div className='flex flex-row gap-2 side-bar-icons side-bar-li' ref={menuRefs["/medication"]}>
												<img src='/assets/svg/medication-bottle-svgrepo-com.svg' className='max-w-[24px]' />
												<p>Medication</p>
											</div>
										</Link>
									</li>
								</ul>
							</div>

							<div>
								<ul>
									<li >
										<Link to={"/consultant/notification"}>
											<div className='flex flex-row gap-2 side-bar-icons side-bar-li' ref={menuRefs["/notification"]}>
												<div className='relative block max-w-fit max-h-fit'>
													<img src='/assets/svg/notification-12-svgrepo-com.svg' className='max-w-[24px]' />
													<div className='absolute min-h-2 min-w-2 rounded-full bg-red-600 top-0 right-0'></div>
												</div>
												<p className=''>Notification</p>
											</div>
										</Link>
									</li>
									<li>
										<Link to={"/consultant/settings"}>
											<div className='flex flex-row gap-2 side-bar-icons side-bar-li' ref={menuRefs["/settings"]}>
												<img src='/assets/svg/settings-2-svgrepo-com.svg' className='max-w-[24px]' />
												<p className=''>Settings</p>
											</div>
										</Link>
									</li>
								</ul>
								<hr className='pb-2' />
								<div className=' flex flex-row gap-2 min-h-10 pl-5'>
									<InitialsOrAvartar name='Divine Maduks' />
									<div className='flex flex-col gap-1'>
										<p className='base-bold'>Dr. Maduks</p>
										<p className='tiny-thin'>Vetinary</p>
									</div>
								</div>
							</div>

						</div>
					</div>
				</aside>

				<div className='lg:flex lg:flex-row w-full h-screen'>
					<aside className='hidden lg:flex lg:h-full lg:min-w-[320px] lg:flex-col lg:gap-24 transition-all'>
						<div className='w-auto flex flex-col pr-3 max-w-[320px] h-full bg-white'>
							<header className='py-4 flex flex-row justify-between pl-3 gap-3'>
								<div className='flex justify-start gap-2'>
									<img src='/assets/svg/logo-no-background.svg' className='max-w-[32px]' />
									<p className='font-berkshire text-main h1-bold'>Recommendic</p>
								</div>
							</header>
							<div className='flex flex-col h-full py-4 justify-between'>
								<div>
									<ul>
										<li >
											<Link to={"/consultant/overview"}>
												<div className='flex flex-row gap-2 side-bar-icons side-bar-li' ref={menuRefs["/overview"]}>
													<img src='/assets/svg/overview-svgrepo-com.svg' className='max-w-[24px]' />
													<p>Overview</p>
												</div>
											</Link>
										</li>
										<li>
											<Link to={"/consultant/patient"}>
												<div className='flex flex-row gap-2 side-bar-icons side-bar-li' ref={menuRefs["/patient"]}>
													<img src='/assets/svg/people-svgrepo-com.svg' className='max-w-[24px]' />
													<p>Patients</p>
												</div>
											</Link>
										</li>
										<li>
											<Link to={"/consultant/schedule"}>
												<div className='flex flex-row gap-2 side-bar-icons side-bar-li' ref={menuRefs["/schedule"]}>
													<img src='/assets/svg/schedule-svgrepo-com.svg' className='max-w-[24px]' />
													<p>Schedule</p>
												</div>
											</Link>
										</li>
										<li >
											<Link to={"/consultant/chat"}>
												<div className='flex flex-row gap-2 side-bar-icons side-bar-li' ref={menuRefs["/chat"]}>
													<div className='relative block max-w-fit max-h-fit'>
														<img src='/assets/svg/chats-svgrepo-com.svg' className='min-w-6 max-w-6' />
														<div className='absolute min-h-2 min-w-2 rounded-full bg-red-600 top-0 right-0'></div>
													</div>
													<p>Chats</p>
												</div>
											</Link>
										</li>
										<li >
											<Link to={"/consultant/medication"}>
												<div className='flex flex-row gap-2 side-bar-icons side-bar-li' ref={menuRefs["/medication"]}>
													<img src='/assets/svg/medication-bottle-svgrepo-com.svg' className='max-w-[24px]' />
													<p>Medication</p>
												</div>
											</Link>
										</li>
									</ul>
								</div>

								<div>
									<ul>
										<li >
											<Link to={"/consultant/notification"}>
												<div className='flex flex-row gap-2 side-bar-icons side-bar-li' ref={menuRefs["/notification"]}>
													<div className='relative block max-w-fit max-h-fit'>
														<img src='/assets/svg/notification-12-svgrepo-com.svg' className='min-w-[24px]' />
														<div className='absolute min-h-2 min-w-2 rounded-full bg-red-600 top-0 right-0'></div>
													</div>
													<p className=''>Notification</p>
												</div>
											</Link>
										</li>
										<li>
											<Link to={"/consultant/settings"}>
												<div className='flex flex-row gap-2 side-bar-icons side-bar-li' ref={menuRefs["/settings"]}>
													<img src='/assets/svg/settings-2-svgrepo-com.svg' className='max-w-[24px]' />
													<p className=''>Settings</p>
												</div>
											</Link>
										</li>
									</ul>
									<hr className='pb-2' />
									<div className=' flex flex-row gap-2 min-h-10 pl-5'>
										<div className='bg-dark-2 max-w-fit max-h-fit p-2 rounded-full'><p className='text-white'>DM</p></div>
										<div className='flex flex-col gap-1'>
											<p className='base-bold'>Dr. Maduks</p>
											<p className='tiny-thin'>Vetinary</p>
										</div>
									</div>
								</div>

							</div>
						</div>
					</aside>
					<section className='w-full h-full min-h-fit px-3 py-3'>
						<div className='hidden w-full min-h-10 lg:flex flex-row justify-end mb-10'>
							<GlobalSearch />
						</div>
						<Outlet />
					</section>
				</div>
			</div>

		</main>
	)
}

export default ConsultantRootLayout