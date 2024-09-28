
import { useState } from 'react'
import { RxCross2 } from "react-icons/rx";
import { FaHandHoldingMedical as HeaderIcon } from "react-icons/fa6"
import { IoMenu } from 'react-icons/io5'

import { Link } from 'react-router-dom'
import { useLocation } from 'react-router-dom'

const Header = () => {
  const [sidebar, setSidebar] = useState(false);
  const handleSidebar = () => {
    setSidebar(!sidebar);
  }

  const location = useLocation();
  return (
    <>
      <div className={sidebar ? 'fixed flex flex-row flex-nowrap w-screen h-screen left-0 top-0 bg-transparent backdrop-blur-sm' : 'hidden'}>

        <div id='sidebar' className='flex flex-col gap-8 h-full bg-slate-50 ml-4'>
          <div className='px-2 flex flex-row justify-between gap-2 py-8 h-auto'>
            <header className='font-poppins text-pretty h2-bold'>Recommendic</header>
            <HeaderIcon
              className='w-12 h-12 text-white fill-blue-700 p-2 rounded-full shadow-blue-300 shadow-md ' />
          </div>

          <ul className='px-1 flex flex-col gap-2 w-full'>
            <li className='pl-1 side-nav-link '><Link to="">Home</Link></li>
            <li className='pl-1 side-nav-link '><Link to="">Find a doctor</Link></li>
            <li className='pl-1 side-nav-link '><Link to="">Apps</Link></li>
            <li className='pl-1 side-nav-link '><Link to="">About</Link></li>
          </ul>
        </div>
        <div className='h-full w-full bg-transparent' onClick={handleSidebar}>
          {/* <RxCross2 size={20}/> */}
        </div>
      </div>

      <nav className='flex flex-row justify-between h-auto w-full'>
        <div className='flex gap-4 '>
          <HeaderIcon
            className='w-12 h-12 text-white fill-blue-700 p-2 rounded-full shadow-blue-300 shadow-md ' />

          <h1 className='font-poppins text-pretty h1-semibold cursor-pointer'>recommendic</h1>

        </div>
        <div className='hidden smmd:block h-fit'>
          <ul className='flex gap-2'>
            <li className={location.pathname === '/' ? 'nav-link-selected' : 'nav-link'}><Link to="/">Home</Link></li>
            <li className={location.pathname === 'finddoctor' ? 'nav-link-selected' : 'nav-link'}><Link to="finddoctor">Find a doctor</Link></li>
            <li className={location.pathname === 'apps' ? 'nav-link-selected' : 'nav-link'}><Link to="apps">Apps</Link></li>
            <li className={location.pathname === 'about' ? 'nav-link-selected' : 'nav-link'}><Link to="about">About</Link></li>

          </ul>
        </div>
        <div className='hidden smmd:flex smmd:gap-2 h-fit'>
          <Link to='signin' className='nav-link'>Login</Link>
          <Link to='signup' className='nav-link'>Sign Up</Link>
        </div>
        <IoMenu className=' smmd:hidden w-8 h-8 cursor-pointer hover:ring-1 hover:transition rounded-md' onClick={handleSidebar} />

      </nav>
    </>
  )
}

export default Header