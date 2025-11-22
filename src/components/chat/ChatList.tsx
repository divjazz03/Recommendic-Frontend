import { MoreVertical } from 'lucide-react'
import React, { useMemo, useState } from 'react'
import LocalSearch from '../shared/LocalSearch'
import InitialsOrAvartar from '../shared/InitialsOrAvartar'
import { DateTime } from 'luxon'
import { handleDateTimeFormatting } from '@/lib/utils/utils'
import { ChatType, Message, useChat } from '@/hooks/useChat'



interface ChatListProps {
    selectedChat: ChatType | null | undefined,
    setSelectedChat: (value: React.SetStateAction<ChatType | null | undefined>) => void
}
type SearchFilter = 'all' | 'unread'
const ChatList: React.FC<ChatListProps> = (
    {selectedChat,
        setSelectedChat
    }
) => {

    const [searchValue, setSearchValue] = useState<string>('');
    
    const [filter, setFilter] = useState<SearchFilter>('all');
    const {chats} = useChat();
    console.log('Chat list rerenders: ', selectedChat)
    const filteredChatList: ChatType[] = useMemo(() => {
        return chats?.filter(chat => {
            const matchesSearch = chat.otherFullName.toLowerCase().includes(searchValue.toLowerCase()) ||
                chat.messages.find(m => m.content.includes(searchValue));
            const matchesFilter = (filter === 'all') || (filter === 'unread' && chat.hasUnreadMessages);

            return matchesSearch && matchesFilter
        }) ?? []
    }, [searchValue])
    return (
        <main className='flex flex-col h-full'>
            <section className='border-b'>
                <header className='flex justify-between items-center h-16 py-1 px-2'>
                    <h1 className='font-semibold text-2xl'>Chat</h1>
                    <MoreVertical />
                </header>

                {/* Search and Filter */}
                <section className='space-y-2 px-2 py-1'>
                    <LocalSearch
                        placeholder='Search chats'
                        handleEnterKeyPress={() => { }}
                        setSearchValue={setSearchValue}
                    />
                    <div className='flex gap-2'>
                        {['all', 'unread'].map((f) => (
                            <div
                                onClick={() => setFilter(f as SearchFilter)}
                                className={`text-center cursor-pointer capitalize py-1 px-2 ${filter.includes(f) ? 'bg-main-light text-white' : 'bg-gray-50'} rounded-md`}>
                                {f}
                            </div>))}
                    </div>
                </section>
            </section>
            {/* Chats */}
            <section className='flex-1 flex flex-col overflow-y-auto px-2 py-2 gap-2'>
                {filteredChatList.map((chat) => (
                    <ChatThumbnail
                        key={chat.otherId}
                        fullName={chat.otherFullName}
                        lastMessagePreview={getLastMessagePreview(chat)}
                        noUnreadMessages={getNoOfUnreadMessages(chat)}
                        selectedChat={selectedChat}
                        chat={chat}
                        lastSeen={chat.lastSeen}
                        avatarUrl={chat.otherImageUrl}
                        setSelectedChat={setSelectedChat} />

                ))}
            </section>
        </main>
    )
}

export default ChatList

interface ChatThumbnailProps {
    setSelectedChat: (value: React.SetStateAction<ChatType | null |undefined>) => void
    chat: ChatType
    selectedChat: ChatType | null | undefined
    fullName: string
    avatarUrl?: string
    lastMessagePreview: string
    noUnreadMessages: string
    lastSeen: string
}
const ChatThumbnail = ({
    avatarUrl,
    fullName,
    lastMessagePreview,
    noUnreadMessages,
    setSelectedChat,
    chat,
    selectedChat,
    lastSeen
}: ChatThumbnailProps) => (
    <main
        onClick={() => setSelectedChat(chat)}
        className={`flex justify-between w-full h-20 py-3 px-2 rounded-md ${selectedChat?.otherId === chat.otherId ? 'bg-main text-white': 'bg-transparent hover:bg-gray-50'}  cursor-pointer`}>
        <div className='flex gap-2 w-full'>
            <InitialsOrAvartar name={fullName} avatarUrl={avatarUrl} />
            <div className='flex-1 flex justify-between flex-col w-full'>
                <div className='flex justify-between items-center'>
                    <h1 className='font-semibold text-xl'>{fullName}</h1>
                    <p className='text-xs'>{handleDateTimeFormatting(lastSeen)}</p>
                </div>
                <div className='flex justify-between items-center'>
                    <p className='text-sm font-normal'>{lastMessagePreview}</p>
                    {noUnreadMessages && 
                    <div className='text-xs bg-main text-gray-50 w-fit py-0.5 px-1 rounded-full flex items-center justify-center'>
                        {noUnreadMessages}
                    </div>}
                </div>
            </div>
        </div>
    </main>
)

function getLastMessagePreview(chat: ChatType): string {
    const maxCharacters = 30
    const messages = chat.messages
    const lastMessage = messages.sort((a, b) => Date.parse(a.timestamp) - Date.parse(b.timestamp))[messages.length - 1]
    
    const indexOfLastSpaceLessThanMaxCharacters = lastMessage.content.slice(0, maxCharacters).lastIndexOf(" ")
    return lastMessage.content.slice(0, indexOfLastSpaceLessThanMaxCharacters) + ( lastMessage.content.length > maxCharacters? '...':'')
}
function getNoOfUnreadMessages(chat: ChatType): string {
    const unreadMessages = chat.messages.filter(message => message.sender !== 'me'
        && message.sender !== 'system' && !message.read);
    return unreadMessages.length > 99 ? '99+': unreadMessages.length + ''
}