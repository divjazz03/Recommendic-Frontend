import { extractInitialsFromName } from '@/lib/utils/utils'
import React from 'react'
import internal from 'stream'

interface InitialsOrAvartarProps {
    name: string,
    avatarUrl?: string
    width?: string
    height?: string
}

const InitialsOrAvartar = (prop: InitialsOrAvartarProps) => {


    return (
        <div className={` ${prop.avatarUrl ? 'bg-white' : 'bg-main'} flex flex-shrink flex-row justify-center items-center p-2 rounded-full`}
            style={{
                minHeight: prop.height ? `${prop.height}px` : '60px',
                maxHeight: prop.height ? `${prop.height}px` : '60px',
                minWidth: prop.width ? `${prop.width}px` : '60px',
                maxWidth: prop.width ? `${prop.width}px` : '60px',
            }}
        >
            {prop.avatarUrl && <img src={prop.avatarUrl} className='rounded-full object-cover' alt="" />
            }
            {!prop.avatarUrl && <p className='text-white'>{extractInitialsFromName(prop.name)}</p>}
        </div>
    )
}

export default InitialsOrAvartar