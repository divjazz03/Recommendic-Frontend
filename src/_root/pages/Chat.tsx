
import ChatList from '@/components/ChatList'
import ChatScreen from '@/components/ChatScreen'
import { DateTime } from 'luxon'
import { useEffect, useRef, useState } from 'react'

export interface ChatType {
	id: string,
	nameOfCurrentUser: string,
	nameOfOtherUser: string,
	messages: Message[],
}
export interface Message {
	id: string,
	message: string,
	type: "currentUser" | "other",
	date?: string,
	read?: boolean,
	sent?: boolean

}
interface ChatThumbnailObject {
	chatId?: string,
	name: string,
	mostRecentChatPreview: string,
	numberOfUnreadChats?: number
}

const slideVariants = {
	initial: { x: '100%' },
	animate: { x: 0 },
	exit: { x: '100%' },
};


const Chat = () => {
	const chatsMock: ChatType[] = [{
		id: 'fffdfd',
		nameOfCurrentUser: 'Maduka Divine',
		nameOfOtherUser: 'Benson Idahosa',
		messages: [{
			type: "currentUser",
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
	},
	{
		id: 'fffdfe',
		nameOfCurrentUser: 'Maduka Divine',
		nameOfOtherUser: 'Maduka Ebube',
		messages: [{
			type: "currentUser",
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
			message: "What' up na",
			date: DateTime.local().toISO(),
			read: false,
			id: ''
		},
		{
			type: "other",
			message: "How your side?",
			date: DateTime.local().toISO(),
			read: false,
			id: ''
		},
		{
			type: "other",
			message: "Una dey?",
			date: DateTime.local().toISO(),
			read: false,
			id: ''
		}
		]
	},
	{
		id: 'fffdff',
		nameOfCurrentUser: 'Maduka Divine',
		nameOfOtherUser: 'Maduka Ebube',
		messages: [{
			type: "currentUser",
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
			message: "What' up na",
			date: DateTime.local().toISO(),
			read: false,
			id: ''
		},
		{
			type: "other",
			message: "How your side?",
			date: DateTime.local().toISO(),
			read: false,
			id: ''
		},
		{
			type: "other",
			message: "Una dey?",
			date: DateTime.local().toISO(),
			read: false,
			id: ''
		}
		]
	},
	{
		id: 'fffdfg',
		nameOfCurrentUser: 'Maduka Divine',
		nameOfOtherUser: 'Maduka Ebube',
		messages: [{
			type: "currentUser",
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
			message: "What' up na",
			date: DateTime.local().toISO(),
			read: false,
			id: ''
		},
		{
			type: "other",
			message: "How your side?",
			date: DateTime.local().toISO(),
			read: false,
			id: ''
		},
		{
			type: "other",
			message: "Una dey?",
			date: DateTime.local().toISO(),
			read: false,
			id: ''
		}
		]
	},
	{
		id: 'fffdfh',
		nameOfCurrentUser: 'Maduka Divine',
		nameOfOtherUser: 'Maduka Ebube',
		messages: [{
			type: "currentUser",
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
			message: "What' up na",
			date: DateTime.local().toISO(),
			read: false,
			id: ''
		},
		{
			type: "other",
			message: "How your side?",
			date: DateTime.local().toISO(),
			read: false,
			id: ''
		},
		{
			type: "other",
			message: "Una dey?",
			date: DateTime.local().toISO(),
			read: false,
			id: ''
		}
		]
	},
	{
		id: 'fffdfi',
		nameOfCurrentUser: 'Maduka Divine',
		nameOfOtherUser: 'Maduka Ebube',
		messages: [{
			type: "currentUser",
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
			message: "What' up na",
			date: DateTime.local().toISO(),
			read: false,
			id: ''
		},
		{
			type: "other",
			message: "How your side?",
			date: DateTime.local().toISO(),
			read: false,
			id: ''
		},
		{
			type: "other",
			message: "Una dey?",
			date: DateTime.local().toISO(),
			read: false,
			id: ''
		}
		]
	},
	{
		id: 'fffdfj',
		nameOfCurrentUser: 'Maduka Divine',
		nameOfOtherUser: 'Maduka Ebube',
		messages: [{
			type: "currentUser",
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
			message: "What' up na",
			date: DateTime.local().toISO(),
			read: false,
			id: ''
		},
		{
			type: "other",
			message: "How your side?",
			date: DateTime.local().toISO(),
			read: false,
			id: ''
		},
		{
			type: "other",
			message: "Una dey?",
			date: DateTime.local().toISO(),
			read: false,
			id: ''
		}
		]
	},
	{
		id: 'fffdfk',
		nameOfCurrentUser: 'Maduka Divine',
		nameOfOtherUser: 'Maduka Ebube',
		messages: [{
			type: "currentUser",
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
			message: "What' up na",
			date: DateTime.local().toISO(),
			read: false,
			id: ''
		},
		{
			type: "other",
			message: "How your side?",
			date: DateTime.local().toISO(),
			read: false,
			id: ''
		},
		{
			type: "other",
			message: "Una dey?",
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

const chatScreenSectionRef = useRef(null)
useEffect(() => {

}, [showChatScreen])

const handleMessageSending = () => {

}

return (
	<>
		<main className='flex flex-row h-[800px] bg-light-4 rounded-xl p-2'>
			<section className={`${showChatScreen ? 'opacity-0 w-0 overflow-hidden sm:min-w-[360px] sm:max-w-360px sm:flex-1 sm:opacity-100 sm:block sm:mr-2' : 'block mr-2 min-w-[360px]'} duration-300 ease-in-out transition-all h-full`}>
				<ChatList chats={chats}
					showChatScreen={showChatScreen}
					setShowChatScreen={setShowChatScreen}
					setSelectedChat={setSelectedChat} />
			</section>
			<section ref={chatScreenSectionRef} className={`${showChatScreen && selectedChat != null ? 'block mr-2' : 'hidden sm:block'} w-full min-w-[280px] max-w-[760px] ease-linear duration-200`}>
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