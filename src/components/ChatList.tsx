import React, { MouseEvent, MouseEventHandler, ReactEventHandler, useEffect, useRef, useState } from 'react'
import ChatThumbnail from './ChatThumbnail';
import LocalSearch from './LocalSearch';
import { ChatType } from '@/_root/pages/Chat';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';

interface ChatListProps {
    setSelectedChat: (value: React.SetStateAction<ChatType>) => void,
    showChatScreen: boolean,
    setShowChatScreen: (value: boolean) => void,
    chats: ChatType[]
}


const ChatList: React.FC<ChatListProps> = ({
    setSelectedChat,
    setShowChatScreen,
    chats
}) => {

    const [selectedFilter, setSelectedFilter] = useState('All');
    const [searchBarVisible, setSearchBarVisible] = useState(false);
    const [searchBarHeight, setSearchBarHeight] = useState(0);
    const [filterSectionVisible, setFilterSectionVisible] = useState(false);
    const [filterSectionHeight, setFilterSectionHeight] = useState(0);
    const [localChats, setLocalChats] = useState(chats);

    const filterOptions = ['All', 'Unread']

    const searchRef = useRef(null);
    const filterSectionRef = useRef(null);

    const handleThumbnailClick = () => {
        setSelectedChat((chat) => {
            chat.messages.forEach(message => message.read = true)
            return chat;
        })
    };
    const handleFilterClick = (event: MouseEvent) => {
            //event.preventDefault()
            const value = event.currentTarget.innerHTML;
            console.log(value)
            setSelectedFilter(value);
    }
    const handleFilter = (value: string) => {
        console.log("filter called")
        if (selectedFilter.includes('Unread')) {
            setLocalChats((chats) => chats.filter((chat) => chat.messages.find(message => !message.read)))
        } else if (selectedFilter.includes('All')){
            setLocalChats(() => chats)
        }

    }

    useEffect(() => {
        handleFilter(selectedFilter);
    }, [selectedFilter,localChats])

    useEffect(() => {
        if (searchBarVisible && searchRef.current) {
            setSearchBarHeight(searchRef.current.scrollHeight);
        } else {
            setSearchBarHeight(0);
        }
    }, [searchBarVisible])
    useEffect(() => {
        if (filterSectionVisible && filterSectionRef.current) {
            setFilterSectionHeight(filterSectionRef.current.scrollHeight);
        } else {
            setFilterSectionHeight(0);
        }
    }, [filterSectionVisible])

    return (
        <section className={`w-full min-h-full flex flex-col  min-w-80 md:max-w-96 shadow-sm rounded-md py-1 bg-white`}>
            <header className={`${(!filterSectionVisible && !searchBarVisible) ? '' : 'space-y-2'} flex py-4 flex-col justify-center min-h-12`}>
                <div className='flex flex-row justify-between px-4'>
                    <p className='body-bold'>Chats</p>
                    <div>
                        <div className='flex flex-row space-x-1'>
                            <div className={`max-w-7 ${searchBarVisible ? 'bg-light-4' : ''} hover:bg-light-4 p-1 rounded-sm`} onClick={() => setSearchBarVisible(!searchBarVisible)}><img src='/assets/svg/search-alt-1-svgrepo-com.svg' className='w-full' /></div>
                            <div className={`max-w-7 ${filterSectionVisible ? 'bg-light-4' : ''} hover:bg-light-4 p-1 rounded-sm`} onClick={() => setFilterSectionVisible(!filterSectionVisible)}><img src='/assets/svg/people-svgrepo-com.svg' className='w-full' /></div>
                        </div>
                    </div>
                </div>
                <div ref={searchRef}
                    style={{ height: `${searchBarHeight}px` }}
                    className={`${!searchBarVisible ? ' opacity-0' : 'opacity-100'} py-1 transition-all ease-in-out overflow-hidden duration-300`}>
                    <LocalSearch placeholder='Search Message' />
                </div>
                {/* Below is the filter section*/}
                <div ref={filterSectionRef}
                    style={{ height: `${filterSectionHeight}px` }}
                    className={`${!filterSectionVisible ? 'opacity-0 overflow-hidden' : 'opacity-100'} flex flex-row gap-2 pl-2 transition-all ease-in-out duration-300`} >
                    {filterOptions.map((value, index) =>
                    (<div key={index}
                        onClick={handleFilterClick}
                        className={`${selectedFilter.includes(value) ? 'bg-light-1' : 'bg-light-4 hover:bg-light-3'} cursor-pointer px-2 rounded-xl`}>
                        <p className='cursor-pointer'>{value}</p>
                    </div>)
                    )}
                </div>
            </header>
            <Separator />
            <main className='min-w-fit'>
                <div className='flex flex-col items-center justify-center max-h-[720px] [&::-webkit-scrollbar]:hidden [scrollbar-width:none] [-ms-overflow-style:none]'>
                    <ScrollArea className='flex flex-col w-full px-2 py-2' >
                        {localChats.map((chat) => (
                            <div key={chat.id} onClick={() => {
                                setSelectedChat(chat);
                                setShowChatScreen(true);
                                handleThumbnailClick();
                            }} className='flex flex-col items-center justify-center'>
                                <ChatThumbnail
                                    name={chat.nameOfOtherUser}
                                    mostRecentChatPreview={chat.messages[chat.messages.length - 1].message}
                                    numberOfUnreadChats={chat.messages.filter((message) => !message.read).length}
                                />
                            </div>
                        ))}
                    </ScrollArea>
                </div>
            </main>
        </section>
    )
}

export default ChatList