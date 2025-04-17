import ChatThumbnail, { ChatThumbnailProps } from '@/components/ChatThumbnail'
import LocalSearch from '@/components/LocalSearch'
import React, { useState } from 'react'

const Chat = () => {

	const filterOptions = ['All', 'Unread']
	const [selectedFilter, setSelectedFilter] = useState('All')
	const chatThumbnailObjects: ChatThumbnailProps[] = [
		{
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
		}
	]
	return (
		<>
			<main className='flex flex-row h-[780px] bg-light-4 rounded-lg p-2'>
				<section className=' max-h-full overflow-clip flex flex-col gap-6 min-w-80 max-w-80 shadow-sm rounded-md py-2 bg-white'>
					<header className='flex flex-col gap-2'>
						<div className='flex flex-row justify-between'>
							<p className='h3-bold px-2'>Chats</p>
						</div>
						<LocalSearch placeholder='Search Message' />
						<div className='px-2 flex flex-row gap-2' >
							{filterOptions.map((value, index) =>
							(<div key={index} onClick={() => setSelectedFilter(value)} className={`${selectedFilter === value ? 'bg-light-1' : 'bg-light-4 hover:bg-light-3'} + ${'cursor-pointer px-2 rounded-xl'}`}>
								<p className='cursor-pointer'>{value}</p>
							</div>)
							)}
						</div>
					</header>
					<main className='min-w-fit overflow-auto [&::-webkit-scrollbar]:hidden [scrollbar-width:none] [-ms-overflow-style:none]'>
						<div className='flex flex-col w-full px-1 gap-2 py-1 '>
							{chatThumbnailObjects.map((value, key) => (
								<ChatThumbnail key={key} name={value.name} mostRecentChatPreview={value.mostRecentChatPreview} numberOfUnreadChats={value.numberOfUnreadChats} />
							))}
						</div>
					</main>
				</section>
				<section>
						<header>
						</header>
				</section>
			</main>
		</>
	)
}

export default Chat