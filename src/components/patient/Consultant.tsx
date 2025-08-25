import { Outlet } from 'react-router-dom';

const Consultant = () => {
  return (
    <div className='flex flex-col space-y-2 w-full h-full p-2 rounded-md'>
      <section className='h-full'>
        <Outlet />
      </section>
    </div>
  )
}

export default Consultant