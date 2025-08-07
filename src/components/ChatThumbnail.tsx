import React, { useRef } from 'react'
import { DateTime } from 'luxon'
import {handleDateTimeFormatting } from '@/lib/utils';
import InitialsOrAvartar from './shared/InitialsOrAvartar';

export interface ChatThumbnailProps {
    imgLink?: string,
    name: string,
    mostRecentChatPreview: string,
    numberOfUnreadChats?: number,
    dateOfLastChat?: string
}



const ChatThumbnail = ({ name, mostRecentChatPreview,imgLink, numberOfUnreadChats = 9, dateOfLastChat}: ChatThumbnailProps) => {
    const divRef = useRef<HTMLDivElement>(null);

    return (
        <>
            <main ref={divRef} tabIndex={0} className='px-2 py-2 w-full max-h-fit cursor-pointer bg-light-5 hover:bg-light-4 ring-offset-white focus:ring-1 focus:bg-light-4'>
                <div className='flex flex-row gap-3'>
                    <div>
                        <InitialsOrAvartar name={name} avatarUrl={imgLink}/>
                    </div>
                    <div className='flex flex-row  w-full justify-between'>
                        <div className='flex flex-col gap-4'>
                            <h3 className='font-semibold text-xl'>{name}</h3>
                            <p className='text-sm'>{mostRecentChatPreview.slice(0, 15) + (mostRecentChatPreview.length > 15? '...':'')}</p>
                        </div>
                        <div className='flex flex-col min-w-[48px] gap-4 mt-2 items-center'>
                            <p className='text-xs'>{DateTime.fromISO(dateOfLastChat).toRelative()}</p>
                            <div className={numberOfUnreadChats < 1 ? 'hidden' : 'flex justify-center items-center bg-main min-w-fit min-h-fit w-6 h-6 rounded-full'}>
                                <p className='text-white text-xs text-center'>{numberOfUnreadChats <= 99 ? numberOfUnreadChats : '99+'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}

export default ChatThumbnail