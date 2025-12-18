import ChatList from '@/components/chat/ChatList'
import ChatSection from '@/components/chat/ChatSection'
import { ChatType } from '@/hooks/useChat'
import { MutableRefObject, useEffect, useState } from 'react'




const Chat = () => {

    const scrollToBottom = (messagesEndRef: MutableRefObject<HTMLDivElement | null>) => {
        messagesEndRef?.current?.scrollIntoView()
    };
    const [selectedChat, setSelectedChat] = useState<ChatType | null>();

    useEffect(() => { }, [selectedChat])
    console.log('chat rerenders', selectedChat)
    return (
        <main className='flex justify-center items-center w-full h-full overflow-y-hidden border'>

            <div className='mx-auto max-w-7xl border w-full h-full'>
                <section className='md:hidden h-full w-full'>

                </section>
                <section className='hidden h-full md:flex md:gap-2 flex-row'>
                    <div className='min-w-96 h-full shadow-md'>
                        <ChatList selectedChat={selectedChat} setSelectedChat={setSelectedChat} />
                    </div>
                    <div className='overflow-y-hidden flex-1 h-full shadow-md'>
                        {selectedChat ? <ChatSection
                            scrollToBottom={scrollToBottom}
                            selectedChat={selectedChat}
                            setSelectedChat={setSelectedChat} /> 
                            : <div className='flex justify-center items-center h-full '>
                            <p>Please choose a chat</p>
                        </div>}
                    </div>
                </section>

            </div>



        </main>
    )
}

export default Chat