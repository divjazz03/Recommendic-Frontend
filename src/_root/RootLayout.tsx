import { useUserContext } from '@/context/AuthContext';
import React, { useEffect, useRef, useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router-dom'

const RootLayout = () => {

  const [asideHidden, setAsideHidden] = useState(true);
  const { userContext } = useUserContext();
  const location = useLocation();
  const menuRefs = {
    "/overview": useRef(null),
    "/appointment": useRef(null),
    "/patient": useRef(null),
    "/schedule": useRef(null),
    "/chat": useRef(null),
    "/medication": useRef(null),
    "/notification": useRef(null),
    "/consultant": useRef(null)
  }

  useEffect(() => {
    const currentRef = menuRefs[location.pathname];
    if (currentRef && currentRef.current) {
      currentRef.current.focus();
    }
  }, [location.pathname]);

  const handleMenuClick = () => setAsideHidden(!asideHidden);
  return (
    <main className='relative bg-white w-full min-w-[320px] max-w-[1520px] lg:rounded-md h-screen overflow-hidden'>
      <div className='w-full'>
        <header className='lg:hidden sticky top-0 bg-light-4'>
          <div className='flex flex-row justify-start w-full border gap-2 pt-4 pl-3'>
            <img src='/assets/svg/logo-no-background.svg' className='max-w-[32px]' />
            <p className='font-berkshire text-dark-1 h1-bold'>Recommendic</p>
          </div>
          <div className=' flex flex-row gap-2 px-1 py-2 lg:hidden'>
            <div className='hover:bg-stone-50 p-2 flex flex-row justify-center items-center rounded-sm'>
              <img src='/assets/svg/bars-solid.svg' className='min-w-[24px]' onClick={handleMenuClick} />
            </div>
            <div className='flex flex-col justify-center items-center'>
              <p className='items-center'> current page</p>
            </div>
          </div>
        </header>
        <aside className={`${asideHidden ? 'hidden' : 'absolute'} z-50 lg:hidden h-full w-full top-0`}>
          <div className='w-auto flex flex-col pr-3 max-w-[320px] h-full bg-stone-50'>
            <header className='py-4 flex flex-row justify-between pl-3 gap-3'>
              <div className='flex justify-start gap-2'>
                <img src='/assets/svg/logo-no-background.svg' className='max-w-[32px]' />
                <p className='font-berkshire text-dark-1 h1-bold'>Recommendic</p>
              </div>
              <img src='/assets/svg/bars-solid.svg' className='max-w-[24px] mr-2' onClick={handleMenuClick} />
            </header>
            <div className='flex flex-col h-full py-4 justify-between'>
              <div>
                <ul>
                  <li className='side-bar-li'>
                    <Link to={"/overview"} ref={menuRefs["/overview"]}>
                      <div className='flex flex-row gap-2 side-bar-icons'>
                        <img src='/assets/svg/overview-icon.svg' className='max-w-[24px]' />
                        <p>Overview</p>
                      </div>
                    </Link>
                  </li>
                  <li className='side-bar-li' ref={menuRefs["/appointment"]}>
                    <Link to={"/appointment"}>
                      <div className='flex flex-row gap-2 side-bar-icons'>
                        <img src='/assets/svg/calendar-icon.svg' className='max-w-[24px]' />
                        <p>Appointment</p>
                      </div>
                    </Link>
                  </li>
                  <li className={`${userContext.userType !== 'CONSULTANT' ? 'side-bar-li' : 'hidden'}`} ref={menuRefs["/patient"]}>
                    <Link to={"/patient"}>
                      <div className='flex flex-row gap-2 side-bar-icons'>
                        <img src='/assets/svg/people-icon.svg' className='max-w-[24px]' />
                        <p>Patients</p>
                      </div>
                    </Link>
                  </li>
                  <li className={`${userContext.userType === 'CONSULTANT' ? 'side-bar-li' : 'hidden'}`} ref={menuRefs["/consultant"]}>
                    <Link to={"/consultant"}>
                      <div className='flex flex-row gap-2 side-bar-icons'>
                        <img src='/assets/svg/people-icon.svg' className='max-w-[24px]' />
                        <p>Consultant</p>
                      </div>
                    </Link>
                  </li>
                  <li className='side-bar-li' ref={menuRefs["/schedule"]}>
                    <Link to={"/schedule"}>
                      <div className='flex flex-row gap-2 side-bar-icons'>
                        <img src='/assets/svg/calendar-icon.svg' className='max-w-[24px]' />
                        <p>Schedule</p>
                      </div>
                    </Link>
                  </li>
                  <li className='side-bar-li' ref={menuRefs["/chat"]}>
                    <Link to={"/chat"}>
                      <div className='flex flex-row gap-2 side-bar-icons'>
                        <img src='/assets/svg/overview-icon.svg' className='max-w-[24px]' />
                        <p>Chats</p>
                      </div>
                    </Link>
                  </li>
                  <li className='side-bar-li' ref={menuRefs["/medication"]}>
                    <Link to={"/medication"}>
                      <div className='flex flex-row gap-2 side-bar-icons'>
                        <img src='/assets/svg/overview-icon.svg' className='max-w-[24px]' />
                        <p>Medication</p>
                      </div>
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <ul>
                  <li className='side-bar-li' ref={menuRefs["/notification"]}>
                    <Link to={"/notification"}>
                      <div className='flex flex-row gap-2 side-bar-icons'>
                        <img src='/assets/svg/overview-icon.svg' className='max-w-[24px]' />
                        <p className=''>Notification</p>
                      </div>
                    </Link>
                  </li>
                </ul>
              </div>

            </div>
          </div>
        </aside>

        <div className='lg:flex lg:flex-row lg:gap-5 w-full h-screen'>
          <aside className='hidden lg:flex lg:h-full lg:min-w-[320px] lg:flex-col lg:gap-24'>
            <div className='w-auto flex flex-col pr-3 max-w-[320px] h-full bg-stone-50'>
              <header className='py-4 flex flex-row justify-between pl-3 gap-3'>
                <div className='flex justify-start gap-2'>
                  <img src='/assets/svg/logo-no-background.svg' className='max-w-[32px]' />
                  <p className='font-berkshire text-dark-1 h1-bold'>Recommendic</p>
                </div>
              </header>
              <div className='flex flex-col h-full py-4 justify-between'>
                <div>
                  <ul>
                    <li className='side-bar-li' ref={menuRefs["/overview"]}>
                      <Link to={"/overview"}>
                        <div className='flex flex-row gap-2 side-bar-icons'>
                          <img src='/assets/svg/overview-icon.svg' className='max-w-[24px]' />
                          <p>Overview</p>
                        </div>
                      </Link>
                    </li>
                    <li className='side-bar-li' ref={menuRefs["/appointment"]}>
                      <Link to={"/appointment"}>
                        <div className='flex flex-row gap-2 side-bar-icons'>
                          <img src='/assets/svg/calendar-icon.svg' className='max-w-[24px]' />
                          <p>Appointment</p>
                        </div>
                      </Link>
                    </li>
                    <li className={`${userContext.userType !== 'CONSULTANT' ? 'side-bar-li' : 'hidden'}`} ref={menuRefs["/patient"]}>
                      <Link to={"/patient"}>
                        <div className='flex flex-row gap-2 side-bar-icons'>
                          <img src='/assets/svg/people-icon.svg' className='max-w-[24px]' />
                          <p>Patients</p>
                        </div>
                      </Link>
                    </li>
                    <li className={`${userContext.userType === 'CONSULTANT' ? 'side-bar-li' : 'hidden'}`} ref={menuRefs["/consultant"]}>
                    <Link to={"/consultant"}>
                      <div className='flex flex-row gap-2 side-bar-icons'>
                        <img src='/assets/svg/people-icon.svg' className='max-w-[24px]' />
                        <p>Consultant</p>
                      </div>
                    </Link>
                  </li>
                    <li className='side-bar-li' ref={menuRefs["/schedule"]}>
                      <Link to={"/schedule"}>
                        <div className='flex flex-row gap-2 side-bar-icons'>
                          <img src='/assets/svg/schedule-svgrepo-com.svg' className='max-w-[24px]' />
                          <p>Schedule</p>
                        </div>
                      </Link>
                    </li>
                    <li className='side-bar-li' ref={menuRefs["/chat"]}>
                      <Link to={"/chat"}>
                        <div className='flex flex-row gap-2 side-bar-icons'>
                          <img src='/assets/svg/chats-svgrepo-com.svg' className='max-w-[24px]' />
                          <p>Chats</p>
                        </div>
                      </Link>
                    </li>
                    <li className='side-bar-li' ref={menuRefs["/medication"]}>
                      <Link to={"/medication"}>
                        <div className='flex flex-row gap-2 side-bar-icons'>
                          <img src='/assets/svg/mrdication-bottle-svgrepo-com.svg' className='max-w-[24px]' />
                          <p>Medication</p>
                        </div>
                      </Link>
                    </li>
                  </ul>
                </div>

                <div>
                  <ul>
                    <li className='side-bar-li' ref={menuRefs["/notification"]}>
                      <Link to={"/notification"}>
                        <div className='flex flex-row gap-2 side-bar-icons'>
                          <img src='/assets/svg/overview-icon.svg' className='max-w-[24px]' />
                          <p className=''>Notification</p>
                        </div>
                      </Link>
                    </li>
                  </ul>
                </div>

              </div>
            </div>
          </aside>
          <section className='w-full h-full min-h-fit px-3 py-3'>
            <Outlet />
          </section>
        </div>
      </div>

    </main>
  )
}

export default RootLayout