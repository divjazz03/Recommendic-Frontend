import { extractInitialsFromName } from '@/lib/utils/utils'
import React from 'react'

interface InitialsOrAvartarProps {
    name: string,
    avatarUrl?: string
    className?: string
}

const InitialsOrAvartar: React.FC<InitialsOrAvartarProps> = ({
    name,
    avatarUrl,
    className
}) => {


    return (
        <div 
            
        className={` ${avatarUrl ? 'bg-white' : 'bg-main'} flex flex-shrink flex-row justify-center items-center p-2 rounded-full ${className? className : 'w-16 h-16'}`}
        >
            {avatarUrl && <img src={avatarUrl} className='rounded-full object-cover' alt="Avatar" />
            }
            {!avatarUrl && name && <p className='text-white text-xl'>{extractInitialsFromName(name)}</p>}
        </div>
    )
}

export default InitialsOrAvartar