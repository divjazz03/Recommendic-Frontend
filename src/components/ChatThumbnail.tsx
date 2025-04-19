import React, { ReactNode, useRef } from 'react'
import {DateTime} from 'luxon'

export interface ChatThumbnailProps {
    imgLink?: string,
    name: string,
    mostRecentChatPreview: string,
    numberOfUnreadChats?: number,
    dateOfLastChat?: string
}
const ChatThumbnail = ({ name, mostRecentChatPreview, numberOfUnreadChats = 9, dateOfLastChat = DateTime.now().toISO() }: ChatThumbnailProps) => {
    const divRef = useRef(null);
    
    const handleDateTimeFormatting = (date: string): string => {
        //Day is today
        const dateToday = DateTime.local();
        const dateOfChat = DateTime.fromISO(date);
        const startOfWeek = dateToday.startOf('week');
        const endOfWeek = dateToday.endOf('week')
        const daysOfTheWeek = ["Sunday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
        if (dateOfChat.day === dateToday.day) {
            return `${dateOfChat.hour > 12 ? dateOfChat.hour - 12 : dateOfChat.hour}:${dateOfChat.minute < 10 ? '0' + (dateOfChat.minute):dateOfChat.minute } ${dateOfChat.hour > 12? 'PM':'AM'}`
        } else if (dateToday.day - dateOfChat.day === 1) { // is not today but yesterday
            return 'yesterday';
        } else if (dateOfChat >= startOfWeek && dateOfChat <= endOfWeek ) { // difference is less than one week
            return dateOfChat.weekdayLong //`${daysOfTheWeek[dateOfChat.localWeekday]}`
        } else {
            return dateOfChat.monthLong;
        }
    }
    const handleClick = () => {
        divRef.current?.focus();
    }
    return (
        <>
            <main ref={divRef} tabIndex={0} onClick={() => {divRef.current?.focus()}} className='px-2 py-2 w-full max-h-fit cursor-pointer bg-light-5 hover:bg-light-4 shadow-sm rounded-sm ring-offset-white focus:ring-1 focus:bg-light-4'>
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
                            <div className={numberOfUnreadChats < 1? 'hidden': 'flex flex-row justify-center items-center bg-dark-2 min-w-fit min-h-fit w-6 h-6 rounded-full'}>
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