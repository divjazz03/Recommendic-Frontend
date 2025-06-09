import React, { MouseEvent, useEffect, useRef, useState } from 'react'
import ChatThumbnail from './ChatThumbnail';
import LocalSearch from './LocalSearch';
import { ChatType } from '@/_root/pages/Chat';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { Search, Users } from 'lucide-react';

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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [searchTerm, setSearchTerm] = useState('');
    const [filterSectionVisible, setFilterSectionVisible] = useState(false);
    const [filterSectionHeight, setFilterSectionHeight] = useState(0);
    const [localChats, setLocalChats] = useState(chats);

    const filterOptions = ['All', 'Unread']

    const searchRef: React.MutableRefObject<HTMLDivElement> = useRef(null);
    const filterSectionRef: React.MutableRefObject<HTMLDivElement> = useRef(null);

    const handleThumbnailClick = () => {
        setSelectedChat((chat) => {
            chat.messages.forEach(message => message.read = true)
            return chat;
        })
    };
    const handleFilterClick = (event: MouseEvent) => {
            const value = event.currentTarget.innerHTML;
            console.log(value)
            setSelectedFilter(value);
    }
    const handleFilter = (value: string) => {
        console.log("filter called: ",value)
        if (selectedFilter.includes('Unread')) {
            setLocalChats((chats) => chats.filter((chat) => chat.messages.find(message => !message.read)))
        } else if (selectedFilter.includes('All')){
            setLocalChats(() => chats)
        }

    }

    useEffect(() => {
        handleFilter(selectedFilter);
    }, [selectedFilter, localChats])

    useEffect(() => {
        if (searchBarVisible && searchRef.current) {
            setSearchBarHeight(50);
        } else {
            setSearchBarHeight(0);
        }
    }, [searchBarVisible])
    useEffect(() => {
        if (filterSectionVisible && filterSectionRef.current) {
            setFilterSectionHeight(25);
        } else {
            setFilterSectionHeight(0);
        }
    }, [filterSectionVisible])

    return (
        <section className={`w-full min-h-full flex flex-col  min-w-80 md:max-w-96 shadow-sm py-2 rounded-xl bg-white`}>
            <header className={`${(!filterSectionVisible && !searchBarVisible) ? '' : 'space-y-2'} flex py-4 flex-col justify-center min-h-12`}>
                <div className='flex justify-between px-6'>
                    <h3 className='font-bold text-2xl tracking-wider'>Chats</h3>
                    <div>
                        <div className='flex space-x-1'>
                            <div className={`max-w-7 ${searchBarVisible ? 'bg-main text-light-4' : ''} hover:bg-main-light hover:text-light-4 rounded-md flex items-center w-10 h-10 p-1`} onClick={() => setSearchBarVisible(!searchBarVisible)}><Search /></div>
                            <div className={`max-w-7 ${filterSectionVisible ? 'bg-main text-light-4' : ''} hover:bg-main-light hover:text-light-4 rounded-md flex items-center w-10 h-10 p-1`} onClick={() => setFilterSectionVisible(!filterSectionVisible)}><Users /></div>
                        </div>
                    </div>
                </div>
                <div ref={searchRef}
                    style={{ height: `${searchBarHeight}px` }}
                    className={`${!searchBarVisible ? ' opacity-0' : 'opacity-100'} py-1 transition-all ease-in-out overflow-hidden duration-300`}>
                    <LocalSearch setSearchValue={setSearchTerm} placeholder='Search Message' />
                </div>
                {/* Below is the filter section*/}
                <div ref={filterSectionRef}
                    style={{ height: `${filterSectionHeight}px` }}
                    className={`${!filterSectionVisible ? 'opacity-0 overflow-hidden' : 'opacity-100'} flex gap-2 pl-2 transition-all ease-in-out duration-300`} >
                    {filterOptions.map((value, index) =>
                    (<div key={index}
                        onClick={handleFilterClick}
                        className={`${selectedFilter.includes(value) ? 'bg-light-1' : 'bg-light-4 hover:bg-light-3'} cursor-pointer px-2 py-1 rounded-xl h-fit`}>
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
                                    imgLink={chat.avatarUrlOfOtherUser}
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