import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'

const Welcome = () => {

  const navigate = useNavigate();

  const handleSignUpRedirect = () => navigate('/sign-up');
  const handleLoginRedirect = () => navigate('/sign-in') 

  return (
    <>
      <div className='flex sm:bg-light-4 flex-col flex-1 h-full w-full justify-center xs:justify-center sm:items-center'>
        <section className='flex h-screen sm:h-fit sm:py-24 sm:w-[640px] gap-24 bg-light-5 flex-col items-center justify-center rounded-3xl drop-shadow-lg shadow-slate-400'>
          <div className='flex flex-col justify-center gap-3 items-center'>
            <img src='/assets/svg/logo-no-background.svg' className='object-cover min-h-52' />
            <header className='text-5xl font-bold text-main font-berkshire'>Recommendic</header>
            <p className='tracking-wider text-sm text-dark-1'>Bridging the Gap</p>
          </div>
          <div className='flex flex-col px-4 gap-2 justify-center items-center'>
            <Button className='shad-button_primary' onClick={handleSignUpRedirect} type='button'>Sign Up</Button>
            <Button className='shad-button_secondary' onClick={handleLoginRedirect} type='button'>Log In</Button>
          </div>
        </section>
      </div>
    </>
  )
}

export default Welcome