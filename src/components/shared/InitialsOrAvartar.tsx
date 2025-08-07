import { extractInitialsFromName } from '@/lib/utils'
import React from 'react'

interface InitialsOrAvartarProps {
    name: string,
    avatarUrl?: string
    width?: string
    height?: string
}

const InitialsOrAvartar: React.FC<InitialsOrAvartarProps> = ({
    name,
    avatarUrl,
    width,
    height
}) => {


    return (
        <div className={` ${avatarUrl ? 'bg-white' : 'bg-main'} flex flex-shrink flex-row justify-center items-center p-2 rounded-full`}
            style={{
                minHeight: height ? `${height}px` : '60px',
                maxHeight: height ? `${height}px` : '60px',
                minWidth: width ? `${width}px` : '60px',
                maxWidth: width ? `${width}px` : '60px',
            }}
        >
            {avatarUrl && <img src={avatarUrl} className='rounded-full object-cover' alt="" />
            }
            {!avatarUrl && <p className='text-white text-xl'>{extractInitialsFromName(name)}</p>}
        </div>
    )
}

export default InitialsOrAvartar