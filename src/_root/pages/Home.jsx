import React from 'react'
import doctorIllustration from "/assets/svg/MedicalDoctor.svg"
import abstractShape1 from "../../../assets/images/AbstractShape1.jpeg"
import Healthcare from '../../../assets/svg/Healthcare.svg'
import MedicalApp from '../../../assets/svg/MedicalApp.svg'
import { FcSearch, FcViewDetails } from "react-icons/fc"
import { FaBriefcaseMedical } from 'react-icons/fa6'
import { GiMedicinePills } from "react-icons/gi"
import { IoMdPerson, IoMdInformationCircleOutline } from 'react-icons/io'
import { IoInformationCircle, IoSearch } from 'react-icons/io5'
import { BsJournalMedical } from "react-icons/bs";

import ServicesCard from '../../components/ServicesCard'


const Home = () => {
  return (
    <div className='mt-20 smmd:mt-5 space-y-40'>
      <section id='introductdre…ion' className='block justify-center smmd:grid smmd:grid-cols-2 font-poppins items-center smmd:text-left smmd:overflow-visible w-full '>
        <div className='flex flex-col space-y-5 justify-center items-center'>
          <h1 className=' font-semibold text-4xl'>Virtual healthcare</h1>
          <h2 className='font-semibold text-4xl'>for you</h2>
          <p className=' font-normal text-slate-600'>Recommendic provides progressive and affordable healthcare services
            accessible on mobile and online for all and sundry
          </p>
          <a href='#' className='button-link text-sm w-fit'> Consult Today</a>
        </div>
        <div className='hidden smmd:block overflow-clip'>
          <img src={doctorIllustration} alt="" className='opacity-85' />
        </div>
      </section>
      <section id='our-services' className='flex flex-col items-center font-poppins space-y-10'>
        <div className='flex flex-col justify-center space-y-10 items-center' >
          <header className=' font-semibold divide-y-2 text-center text-3xl'>Our services</header>
          <p className='font-normal text-center text-slate-600'>We provide the best choices for you. Adjust to your health needs and make sure
            you undergo your treatments with our best doctors
          </p>
          <ul className='flex flex-col sm:grid sm:grid-cols-2 smmd:grid-cols-3 gap-14'>
            <li><ServicesCard name={"Search doctor"} description={"Choose your doctor from thousands of specialist, general and trusted hospitals"} icon={<FcSearch className=' size-20' />} /></li>
            <li><ServicesCard name={"Online pharmacy"} description={"Buy your medicines with our mobile application"} icon={<GiMedicinePills className=' size-20 fill-blue-500' />} /></li>
            <li><ServicesCard name={"Consultation"} description={"Free consultation from our trusted doctors"} icon={<IoSearch className=' size-20 fill-blue-500' />} /></li>
            <li><ServicesCard name={"Detailed info"} description={"Get detailed info about our specialists and services they provide"} icon={<IoInformationCircle className='fill-blue-500 size-20' />} /></li>
            <li><ServicesCard name={"Emergency care"} description={"You can get 24/7 urgent care for your family"} icon={<FaBriefcaseMedical className=' size-20 fill-blue-500' />} /></li>
            <li><ServicesCard name={"Tracking"} description={"Track and save your medical history and health data"} icon={<BsJournalMedical className=' size-20 fill-blue-500' />} /></li>

          </ul>
        </div>
        <a href='#' className='button-link text-sm w-fit'>learn more</a>
      </section>
      <img src={abstractShape1} className='fixed -top-32  opacity-10 -z-10 aspect-auto' />
      <section id='leading-healthcare-providers' className='block justify-center smmd:grid smmd:grid-cols-2 font-poppins items-center smmd:text-left smmd:overflow-visible w-full'>
        <img src={Healthcare} alt="Health Image" className='hidden smmd:block' />
        <div className='flex flex-col space-y-5 justify-center items-center md:items-left'>
          <h1 className=' font-semibold text-4xl'>Leading healthcare</h1>
          <h2 className='font-semibold text-4xl'>providers</h2>
          <hr />
          <p className=' font-normal text-slate-600'>Recommendic provides progressive and affordable healthcare services
            accessible on mobile and online for all and sundry
          </p>
          <a href='#' className='button-link text-sm w-fit'> Consult Today</a>
        </div>
      </section>
      <section id='download our mobile apps' className='block justify-center smmd:grid smmd:grid-cols-2 font-poppins items-center smmd:text-left smmd:overflow-visible w-full'>
        <div className='flex flex-col space-y-5 justify-center items-center md:items-left'>
          <h1 className=' font-semibold text-4xl'>Download our</h1>
          <h2 className='font-semibold text-4xl'>mobile apps</h2>
          <hr />
          <p className=' font-normal text-slate-600'>Our dedicated patient engagement app and web portal allow you to access information instantaneously (no tedious
            forms, long calls, or administerative hassles) and securely
          </p>
          <a href='#' className='button-link text-sm w-fit'> Download</a>
        </div>
        <img src={MedicalApp} className='hidden smmd:block' />
      </section>
    </div>
  )
}
export default Home;