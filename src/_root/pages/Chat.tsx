
import ChatList from '@/components/ChatList'
import ChatScreen from '@/components/ChatScreen'
import { DateTime } from 'luxon'
import { useState } from 'react'

export interface ChatType {
	id: string,
	nameOfCurrentUser: string,
	nameOfOtherUser: string,
	avatarUrlOfOtherUser?: string,
	avatarUrlOfCurrentUser?: string,
	messages: Message[],
}
export interface Message {
	id: string,
	message: string,
	type: "me" | "other",
	date?: string,
	read?: boolean,
	sent?: boolean

}


const Chat = () => {
	const chatsMock: ChatType[] = [{
		id: 'fffdfd',
		nameOfCurrentUser: 'Maduka Divine',
		nameOfOtherUser: 'Benson Idahosa',
		avatarUrlOfCurrentUser: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&h=150&fit=crop&crop=face',
		avatarUrlOfOtherUser: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&h=150&fit=crop&crop=face',
		messages: [{
			type: "me",
			message: "Hello Nigga",
			date: DateTime.local().toISO(),
			read: false,
			id: ''
		},
		{
			type: "other",
			message: "I dey gee",
			date: DateTime.local().toISO(),
			read: false,
			id: ''
		},
		{
			type: "other",
			message: "I dey gee",
			date: DateTime.local().toISO(),
			read: false,
			id: ''
		},
		{
			type: "other",
			message: "I dey gee",
			date: DateTime.local().toISO(),
			read: false,
			id: ''
		},
		{
			type: "other",
			message: "I dey gee",
			date: DateTime.local().toISO(),
			read: false,
			id: ''
		}
		]
	}
	]


const [chats, setChats] = useState<ChatType[]>(chatsMock);
const [selectedChat, setSelectedChat] = useState<ChatType>(null);
const [showChatScreen, setShowChatScreen] = useState<boolean>(false);

return (
	<>
		<main className='flex flex-row h-[800px] bg-light-4 rounded-xl p-2'>
			<section className={`${showChatScreen ? 'opacity-0 w-0 overflow-hidden sm:min-w-[360px] sm:max-w-360px sm:opacity-100 sm:block sm:mr-2' : 'block mr-2 min-w-[360px] w-full'} flex-1 duration-300 ease-in-out transition-all h-full`}>
				<ChatList chats={chats}
					showChatScreen={showChatScreen}
					setShowChatScreen={setShowChatScreen}
					setSelectedChat={setSelectedChat} />
			</section>
			<section className={`${showChatScreen && selectedChat != null ? 'block mr-2' : 'hidden sm:block'} w-full min-w-[280px] max-w-[760px] ease-linear duration-200`}>
				<ChatScreen setShowChatScreen={setShowChatScreen}
					setSelectedChat={setSelectedChat}
					selectedChat={selectedChat} />
			</section>
			<section className='hidden md:flex flex-col flex-1 h-full w-full bg-white rounded-md'></section>
		</main>
	</>
)
}

export default Chat