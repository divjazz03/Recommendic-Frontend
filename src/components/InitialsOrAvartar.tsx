import { extractInitialsFromName } from '@/lib/utils'
import React from 'react'

interface InitialsOrAvartarProps {
    name: string,
    avatarUrl?: string
}

const InitialsOrAvartar = (prop: InitialsOrAvartarProps) => {


    return (
        <div className='bg-main flex flex-row justify-center items-center min-h-10 min-w-10 max-w-12 max-h-12 p-2 rounded-full'>
            {prop.avatarUrl && <img src={prop.avatarUrl} alt="" />
            }
            {!prop.avatarUrl && <p className='text-white'>{extractInitialsFromName(prop.name)}</p>}
        </div>
    )
}

export default InitialsOrAvartar