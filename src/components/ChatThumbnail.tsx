import React, { ReactNode, useRef } from 'react'

export interface ChatThumbnailProps {
    imgLink?: string,
    name: string,
    mostRecentChatPreview: string,
    numberOfUnreadChats?: number,
    dateOfLastChat?: Date
}
const ChatThumbnail = ({ name, mostRecentChatPreview, numberOfUnreadChats = 9, dateOfLastChat = (new Date()) }: ChatThumbnailProps) => {
    const divRef = useRef(null);
    const handleDateTimeFormatting = (date: Date): string => {
        //Day is today
        const today = new Date()
        const daysOfTheWeek = ["Sunday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
        if (date.getDate() === today.getDate()) {
            return `${dateOfLastChat.getHours() > 12 ? dateOfLastChat.getHours() - 12 : dateOfLastChat.getHours()}:${dateOfLastChat.getMinutes()<10? '0' + (dateOfLastChat.getMinutes()):dateOfLastChat.getMinutes() } ${dateOfLastChat.getHours() > 12? 'PM':'AM'}`
        } else if (today.getDate() - date.getDate() === 1) { // is not today but yesterday
            return 'yesterday';
        } else if (today.getDate() - date.getDate() <= 7) { // difference is less than one week
            return `${daysOfTheWeek[today.getDay()]}`
        } else {
            return dateOfLastChat.getMonth().toString();
        }
    }
    return (
        <>
            <main ref={divRef} tabIndex={0} onClick={() => divRef.current?.focus()} className='px-2 py-2 w-full max-h-fit cursor-pointer bg-light-5 hover:bg-light-4 shadow-sm rounded-sm ring-offset-white focus:ring-1 focus:bg-light-4'>
                <div className='flex flex-row gap-3'>
                    <div className='bg-dark-2 max-w-10 max-h-10 p-2 rounded-full'>
                        <p className='text-white'>DM</p>
                    </div>
                    <div className='flex flex-row  w-full justify-between'>
                        <div className='flex flex-col gap-4'>
                            <p className='body-bold'>{name}</p>
                            <p>{mostRecentChatPreview.slice(0,15) + ' ...'}</p>
                        </div>
                        <div className='flex flex-col min-w-[48px] gap-4 items-center'>
                            <p>{handleDateTimeFormatting(dateOfLastChat)}</p>
                            <div hidden={numberOfUnreadChats < 1} className={'flex flex-row justify-center items-center bg-dark-2 min-w-fit min-h-fit w-6 h-6 rounded-full'}>
                                <p className='text-white tiny-thin text-center'>{numberOfUnreadChats <= 99? numberOfUnreadChats : '99+'}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </>
    )
}

export default ChatThumbnail