import ChatThumbnail, { ChatThumbnailProps } from '@/components/ChatThumbnail'
import LocalSearch from '@/components/LocalSearch'
import { Separator } from '@/components/ui/separator'
import { ScrollArea } from '@radix-ui/react-scroll-area'
import { DateTime } from 'luxon'
import React, { useEffect, useRef, useState } from 'react'

interface ChatType {
	id: string,
	name: string,
	lastSeen: string,
	currentUserMessages: Message[],
	receipientMessages: Message[],
}
interface Message {
	message: string,
	time?: string

}
interface ChatThumbnailObject {
	chatId?: string,
	name: string,
	mostRecentChatPreview: string,
	numberOfUnreadChats?: number
}

const Chat = () => {
	const chat: ChatType = {
		id: 'fffdfd',
		name: 'Maduka Divine',
		lastSeen: DateTime.local().toISO(),
		currentUserMessages: [{
			message: "Hello Nigga"
		}],
		receipientMessages: [{
			message: "I dey gee"
		}]
	}
	const searchRef = useRef(null);
	const filterSectionRef = useRef(null);
	const filterOptions = ['All', 'Unread']
	const [selectedFilter, setSelectedFilter] = useState('All');
	const [chats, setChats] = useState<ChatType[]>([chat]);
	const [selectedChatId, setSelectedChatId] = useState<string>(null);
	const [searchBarVisible, setSearchBarVisible] = useState(false);
	const [searchBarHeight, setSearchBarHeight] = useState(0);
	const [filterSectionVisible, setFilterSectionVisible] = useState(false);
	const [filterSectionHeight, setFilterSectionHeight] = useState(0);
	const chatThumbnailObjects: ChatThumbnailObject[] = [
		{
			chatId: 'fffdfd',
			name: 'Maduka Divine',
			mostRecentChatPreview: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
			numberOfUnreadChats: 0
		},
		{
			name: 'Maduka Divine',
			mostRecentChatPreview: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.',
			numberOfUnreadChats: 20
		},
		{
			name: 'Maduka Divine',
			mostRecentChatPreview: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.'
		},
		{
			name: 'Maduka Divine',
			mostRecentChatPreview: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.'
		},
		{
			name: 'Maduka Divine',
			mostRecentChatPreview: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.'
		},
		{
			name: 'Maduka Divine',
			mostRecentChatPreview: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.'
		},
		{
			name: 'Maduka Divine',
			mostRecentChatPreview: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.'
		},
		{
			name: 'Maduka Divine',
			mostRecentChatPreview: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.'
		},
		{
			name: 'Maduka Divine',
			mostRecentChatPreview: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.'
		},
		{
			name: 'Maduka Divine',
			mostRecentChatPreview: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.'
		},
		{
			name: 'Maduka Divine',
			mostRecentChatPreview: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.'
		},
		{
			name: 'Maduka Divine',
			mostRecentChatPreview: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.'
		},
		{
			name: 'Maduka Divine',
			mostRecentChatPreview: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.'
		},
		{
			name: 'Maduka Divine',
			mostRecentChatPreview: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.'
		},
		{
			name: 'Maduka Divine',
			mostRecentChatPreview: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.'
		},
		{
			name: 'Maduka Divine',
			mostRecentChatPreview: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.'
		},
		{
			name: 'Maduka Divine',
			mostRecentChatPreview: 'Lorem ipsum dolor sit amet consectetur adipisicing elit.'
		}
	]

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
		<>
			<main className='flex flex-row h-[800px] bg-light-4 rounded-xl p-2 space-x-4'>
				<section className='w-full max-h-full overflow-clip flex flex-col space-y-2 min-w-80 md:max-w-96 shadow-sm rounded-md py-2 bg-white'>
					<header className={`${(!filterSectionVisible && !searchBarVisible )? '':'space-y-2'} flex flex-col mt-5 ` }>
						<div className='flex flex-row justify-between px-4'>
							<p className='body-bold'>Chats</p>
							<div>
								<div className='flex flex-row space-x-1'>
									<div className='max-w-7 hover:bg-light-4 p-1 rounded-sm' onClick={ () => setSearchBarVisible(!searchBarVisible)}><img src='/assets/svg/search-alt-1-svgrepo-com.svg' className='w-full'/></div>
									<div className='max-w-7 hover:bg-light-4 p-1 rounded-sm' onClick={ () => setFilterSectionVisible(!filterSectionVisible)}><img src='/assets/svg/people-svgrepo-com.svg' className='w-full'/></div>
								</div>
							</div>
						</div>
						<div ref={searchRef}
						 style={{height: `${searchBarHeight}px`}} 
						 className={`${!searchBarVisible? ' opacity-0 overflow-hidden':'opacity-100'} transition-[height] ease-linear duration-300`}>
							<LocalSearch placeholder='Search Message' />
						</div>
						{/* Below is the filter section*/}
						<div ref={filterSectionRef}
						 style={{height: `${filterSectionHeight}px`}} 
						 className={ `${!filterSectionVisible ? 'overflow-hidden opacity-100' : 'flex flex-row px-2 gap-2 opacity-100'} + transition-[height] ease-linear duration-300`} >
							{filterOptions.map((value, index) =>
							(<div key={index} onClick={() => setSelectedFilter(value)} className={`${selectedFilter === value ? 'bg-light-1' : 'bg-light-4 hover:bg-light-3'} + ${'cursor-pointer px-2 rounded-xl'}`}>
								<p className='cursor-pointer'>{value}</p>
							</div>)
							)}
						</div>
					</header>
					<Separator />
					<main className='min-w-fit overflow-auto [&::-webkit-scrollbar]:hidden [scrollbar-width:none] [-ms-overflow-style:none]'>
						<ScrollArea className='flex flex-col w-full space-y-2 px-2 py-2' type='scroll'>
							{chatThumbnailObjects.map((value, key) => (
								<div key={key} onClick={() => setSelectedChatId(value.chatId)}>
									<ChatThumbnail
										name={value.name}
										mostRecentChatPreview={value.mostRecentChatPreview} numberOfUnreadChats={value.numberOfUnreadChats}
									/>
								</div>
							))}
						</ScrollArea>
					</main>
				</section>
				<section className='hidden md:flex flex-col h-full bg-white w-full max-w-[720px] rounded-md'>
					{selectedChatId &&
						(
							<div className='w-full'>
								<header>
									<div className='flex flex-row items-center p-2 space-x-3'>
										<div className='flex flex-row justify-center p-2 bg-dark-1 rounded-full w-fit h-fit'>
											<p className='text-white'>DM</p>
										</div>
										<div>
											<p className='text-md font-semibold'>{chats[0].name}</p>
											<p>{selectedChatId}</p>
										</div>
									</div>
								</header>
								<Separator />
								<ScrollArea>

								</ScrollArea>
							</div>

						)
					}
					{!selectedChatId &&

						(
							<div className=' flex flex-col justify-center items-center w-full'>
								<p className='h3-bold'>Select a Chat</p>
							</div>
						)
					}
				</section>
				<section className='hidden large:flex flex-col flex-1 h-full w-full bg-white rounded-md'></section>
			</main>
		</>
	)
}

export default Chat