import { extractInitialsFromName, handleDateTimeFormatting } from '@/lib/utils/utils'
import React from 'react'
import InitialsOrAvartar from './InitialsOrAvartar'


interface ChatMessageProps {
    messageType: "me"|"other",
    nameOfCurrentUser: string,
    message: string,
    date: string,
    avatarForThisMessage?: string
}



const ChatMessage:React.FC<ChatMessageProps> = ({
    messageType = 'me',
    nameOfCurrentUser,
    message,
    date,
    avatarForThisMessage
}) => {
  return (
    <div className={`flex flex-row w-full h-fit`}>
        
        {   (
                <div className={`${messageType === 'me'? 'items-end flex-row-reverse' : 'items-start'} flex flex-row w-full h-fit py-6 px-3`}>
                    <div className={`${messageType === 'me'? 'flex-row-reverse':' flex-row'} flex gap-1 '`}>
                        <div className='h-full p-1 w-fit'>
                            <InitialsOrAvartar name={nameOfCurrentUser} avatarUrl={avatarForThisMessage} />
                        </div>

                        <div className='w-fit flex flex-col gap-1'>
                            <div className={`${messageType === 'me'? 'flex-row-reverse' : 'flex-row'} flex  gap-2 p-1 w-full h-fit'`}>
                                <p>{nameOfCurrentUser}</p>
                                <p>{handleDateTimeFormatting(date)}</p>
                            </div>
                            <div tabIndex={0} className={`${messageType === 'me'? 'rounded-se-none bg-main ' : 'rounded-ss-none bg-light-4'} flex flex-row rounded-xl min-w-52 max-w-52 shadow-sm p-3 h-fit'`}>
                                <p className={`${messageType === 'me'? 'text-light-4':'text-dark-3'} text-wrap text-sm`}>{message}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )
        }
    </div>
  )
}

export default ChatMessage