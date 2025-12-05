import { extractInitialsFromName } from '@/lib/utils/utils'
import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar'

interface InitialsOrAvartarProps extends React.HtmlHTMLAttributes<HTMLDivElement> {
    name: string,
    avatarUrl?: string
}

const InitialsOrAvartar: React.FC<InitialsOrAvartarProps> = ({
    name,
    avatarUrl,
    className,
    ...props
}) => {


    return (
        // <div {...props}  className={` ${avatarUrl ? 'bg-white' : 'bg-main'} flex flex-shrink flex-row justify-center items-center p-2 rounded-full ${className? className : 'w-16 h-16'}`}
        // >
        //     {avatarUrl && <img src={avatarUrl} className='rounded-full object-cover' alt="Avatar" />
        //     }
        //     {!avatarUrl && name && <p className='text-white text-xl'>{extractInitialsFromName(name)}</p>}
        // </div>
        <Avatar className={className} {...props}>
            <AvatarImage src={avatarUrl} alt='avatar' />
            <AvatarFallback>{extractInitialsFromName(name)}</AvatarFallback>
        </Avatar>
    )
}

export default InitialsOrAvartar