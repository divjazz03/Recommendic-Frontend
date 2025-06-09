import InitialsOrAvartar from '@/components/shared/InitialsOrAvartar';
import GlobalSearch from '@/components/shared/GlobalSearch';
import React, { MutableRefObject, useEffect, useRef, useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'
import { Bell, Calendar1Icon, ChartLine, MessageSquareMoreIcon, PillBottle, Settings2, Users } from 'lucide-react';

const PatientRootLayout = () => {

	const [asideHidden, setAsideHidden] = useState(true);
	const location = useLocation();
	const menuRefs = {
		"/patient/overview": useRef<HTMLDivElement>(null),
		"/patient/schedule": useRef<HTMLDivElement>(null),
		"/patient/chat": useRef<HTMLDivElement>(null),
		"/patient/medication": useRef<HTMLDivElement>(null),
		"/patient/notification": useRef<HTMLDivElement>(null),
		"/patient/consultant": useRef<HTMLDivElement>(null),
		"/patient/settings": useRef<HTMLDivElement>(null)
	}
	const asideRef: MutableRefObject<HTMLElement> = useRef(null);

	useEffect(() => {
		const currentRef: MutableRefObject<HTMLDivElement> = menuRefs[location.pathname];
		console.log(currentRef.current)
		if (currentRef && currentRef.current) {
			currentRef.current.focus()
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [location]);

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
		<main className='relative bg-light-4 min-w-[320px] max-w-full h-screen overflow-hidden'>
			<div className='border-2'>
				<header className='lg:hidden sticky top-0 bg-white'>
					<div className='flex flex-row h-20 items-center justify-start w-full border gap-2 pl-3'>
						<img src='/assets/svg/logo-no-background.svg' className='max-w-[32px]' />
						<p className='font-berkshire text-main font-bold text-3xl'>Recommendic</p>
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
						<header className='py-4 flex flex-row items-center justify-between pl-3 gap-3'>
							<div className='flex justify-start gap-2'>
								<img src='/assets/svg/logo-no-background.svg' className='max-w-[32px]' />
								<p className='font-berkshire text-main font-bold text-3xl'>Recommendic</p>
							</div>
							<img src='/assets/svg/cross-svgrepo-com.svg' className='max-w-[24px] mr-2 hover:bg-light-4' onClick={handleMenuClick} />
						</header>
						<div className='flex flex-col h-full py-4 justify-between'>
							<div>
								<ul>
									<li>
										<Link to={"/patient/overview"}>
											<div className='flex flex-row gap-2 side-bar-li' ref={menuRefs["/patient/overview"]}>
												<ChartLine className='w-6 h-6' />
												<p>Overview</p>
											</div>
										</Link>
									</li>
									<li>
										<Link to={"/patient/consultant"}>
											<div className='flex flex-row gap-2 side-bar-li' ref={menuRefs["/patient/consultant"]}>
												<Users className='w-6 h-6 ' />
												<p>Consultant</p>
											</div>
										</Link>
									</li>
									<li>
										<Link to={"/patient/schedule"}>
											<div className='flex flex-row gap-2 side-bar-li' ref={menuRefs["/patient/schedule"]}>
												<Calendar1Icon className='w-6 h-6' />
												<p>Schedule</p>
											</div>
										</Link>
									</li>
									<li >
										<Link to={"/patient/chat"}>
											<div className='flex flex-row gap-2 side-bar-li' ref={menuRefs["/patient/chat"]}>
												<div className='relative block max-w-fit max-h-fit'>
													<MessageSquareMoreIcon className='w-6 h-6' />
													<div className='absolute min-h-2 min-w-2 rounded-full bg-red-600 top-0 right-0'></div>
												</div>
												<p>Chats</p>
											</div>
										</Link>
									</li>
									<li >
										<Link to={"/patient/medication"}>
											<div className='flex flex-row gap-2 side-bar-li' ref={menuRefs["/patient/medication"]}>
												<PillBottle className='w-6 h-6' />
												<p>Medication</p>
											</div>
										</Link>
									</li>
								</ul>
							</div>

							<div>
								<ul>
									<li >
										<Link to={"/patient/notification"}>
											<div className='flex flex-row gap-2 side-bar-li' ref={menuRefs["/patient/notification"]}>
												<div className='relative block max-w-fit max-h-fit'>
													<Bell className='w-6 h-6' />
													<div className='absolute min-h-2 min-w-2 rounded-full bg-red-600 top-0 right-0'></div>
												</div>
												<p className=''>Notification</p>
											</div>
										</Link>
									</li>
									<li>
										<Link to={"/patient/settings"}>
											<div className='flex flex-row gap-2 side-bar-li' ref={menuRefs["/patient/settings"]}>
												<Settings2 className='w-6 h-6'/>
												<p className=''>Settings</p>
											</div>
										</Link>
									</li>
								</ul>
								<hr className='pb-2' />
								<div className=' flex flex-row gap-2 min-h-10 pl-5'>
									<InitialsOrAvartar name='Maduka Divine'/>
										<div className='flex flex-col gap-1'>
											<p className='base-bold'>Dr. Maduka</p>
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
							<header className='py-4 flex flex-row items-center justify-between pl-3 gap-3'>
								<div className='flex justify-start gap-2'>
									<img src='/assets/svg/logo-no-background.svg' className='max-w-[32px]' />
									<p className='font-berkshire text-main font-bold text-3xl'>Recommendic</p>
								</div>
							</header>
							<div className='flex flex-col h-full py-4 justify-between'>
								<div>
									<ul>
										<li >
											<Link to={"/patient/overview"}>
												<div className='flex flex-row gap-2 side-bar-li' ref={menuRefs["/patient/overview"]}>
													<ChartLine className='w-6 h-6 text-inherit'/>
													<p>Overview</p>
												</div>
											</Link>
										</li>
										<li>
											<Link to={"/patient/consultant"}>
												<div className='flex flex-row gap-2  side-bar-li' ref={menuRefs["/patient/consultant"]}>
													<Users className='w-6 h-6'/>
													<p>Consultant</p>
												</div>
											</Link>
										</li>
										<li>
											<Link to={"/patient/schedule"}>
												<div className='flex flex-row gap-2  side-bar-li' ref={menuRefs["/patient/schedule"]}>
													<Calendar1Icon className='w-6 h-6' />
													<p>Schedule</p>
												</div>
											</Link>
										</li>
										<li >
											<Link to={"/patient/chat"}>
												<div className='flex flex-row gap-2  side-bar-li' ref={menuRefs["/patient/chat"]}>
													<div className='relative block max-w-fit max-h-fit'>
														<MessageSquareMoreIcon className='w-6 h-6' />
														<div className='absolute min-h-2 min-w-2 rounded-full bg-red-600 top-0 right-0'></div>
													</div>
													<p>Chats</p>
												</div>
											</Link>
										</li>
										<li >
											<Link to={"/patient/medication"}>
												<div className='flex flex-row gap-2  side-bar-li' ref={menuRefs["/patient/medication"]}>
													<PillBottle className='w-6 h-6' />
													<p>Medication</p>
												</div>
											</Link>
										</li>
									</ul>
								</div>

								<div>
									<ul>
										<li >
											<Link to={"/patient/notification"}>
												<div className='flex flex-row gap-2  side-bar-li' ref={menuRefs["/patient/notification"]}>
													<div className='relative block max-w-fit max-h-fit'>
														<Bell className='w-6 h-6' />
														<div className='absolute min-h-2 min-w-2 rounded-full bg-red-600 top-0 right-0'></div>
													</div>
													<p className=''>Notification</p>
												</div>
											</Link>
										</li>
										<li>
											<Link to={"/patient/settings"}>
												<div className='flex flex-row gap-2  side-bar-li' ref={menuRefs["/patient/settings"]}>
													<Settings2 className='w-6 h-6'/>
													<p className=''>Settings</p>
												</div>
											</Link>
										</li>
									</ul>
									<hr className='pb-2' />
									<div className=' flex flex-row gap-2 min-h-10 pl-5'>
										<InitialsOrAvartar name='Maduka Divine'/>
										<div className='flex flex-col gap-1'>
											<p className='base-bold'>Dr. Maduka</p>
											<p className='tiny-thin'>Vetinary</p>
										</div>
									</div>
								</div>

							</div>
						</div>
					</aside>
					<section className='w-full h-full min-h-fit'>
						<div className='hidden w-full min-h-12 bg-white lg:flex flex-row justify-end mx-auto '>
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