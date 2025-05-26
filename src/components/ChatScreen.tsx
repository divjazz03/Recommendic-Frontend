import React, { useEffect, useRef, useState } from 'react'
import InitialsOrAvartar from './InitialsOrAvartar';
import { ChatType, Message } from '@/_root/pages/Chat';
import { Separator } from './ui/separator';
import { ScrollArea } from './ui/scroll-area';
import ChatMessage from './ChatMessage';
import AutoResizeTextArea from './AutoResizeTextArea';
import { Button } from './ui/button';
import { randomUUID } from 'crypto';
import { DateTime } from 'luxon';

interface ChatScreenProps{
    selectedChatId?: string;
    selectedChat?: ChatType;
	setSelectedChat?: (value: React.SetStateAction<ChatType>) => void
    setShowChatScreen: (value: boolean) => void

}

const ChatScreen: React.FC<ChatScreenProps> = ({
    selectedChatId,
    selectedChat,
    setShowChatScreen,
	setSelectedChat
    
}) => {

    const [text, setText] = useState<string>('');
	const [sendQueue, setSendQueue] = useState<Message[]>([])

	const scrollAreaRef: React.MutableRefObject<HTMLDivElement> = useRef(null);



	const handleSendMessage = () => {
		const message: Message = {
			id: "randomUUID()",
			message: text.trim(),
			type: 'currentUser',
			date: DateTime.now().toISO(),
			read: false,
			sent: false
		};

		setSelectedChat(prev => ({ ...prev, messages: [...prev.messages, message] }));
		setSendQueue((previous) => [...previous, message]);
	}

	useEffect(() => {
		if(sendQueue.length === 0) return;
		sendQueue.forEach(message => {
			message.sent = true;
			console.log("Sent: ", message)
		});

		setSendQueue(prev => prev.filter(msg => !msg.sent))

		scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
	}, [sendQueue])
  return (
    <section className={`flex flex-col h-full bg-white w-full rounded-md items-center`}>
						{selectedChat &&
							(
								<div className='w-full h-full flex flex-col'>
									<div className='w-full h-full flex flex-col'>
										<header>
											<div className='flex flex-row items-center p-2 pl-4 space-x-3'>
												<div className='sm:hidden min-w-1 min-h-1 max-h-10 max-w-10 hover:bg-light-4 p-2' onClick={() => setShowChatScreen(false)}>
													<img src="/assets/svg/arrow-left-svgrepo-com.svg" alt="" />
												</div>
												<div>
													<InitialsOrAvartar name={selectedChat.nameOfOtherUser} />
												</div>
												<div>
													<p className='text-md font-semibold'>{selectedChat.nameOfOtherUser}</p>
													<p>{selectedChatId}</p>
												</div>
											</div>
										</header>
										<Separator />
										<div ref={scrollAreaRef} className='overflow-scroll scroll-smooth [&::-webkit-scrollbar]:hidden [scrollbar-width:none] [-ms-overflow-style:none]'>
											<ScrollArea className='flex flex-col w-full space-y-2' type='scroll'>
												{
													selectedChat?.messages?.map((message, key) => (
														<ChatMessage key={key}
															messageType={message.type}
															nameOfCurrentUser={message.type === 'currentUser' ? selectedChat.nameOfCurrentUser : selectedChat.nameOfOtherUser}
															message={message.message}
															date={message.date}
														/>
													))

												}
											</ScrollArea>
										</div>
										<Separator />
										<div className='w-full h-fit'>
											<div className='flex flex-row justify-between items-center h-full p-2 '>
												<AutoResizeTextArea maxHeight={200} placeholder='Write a message' value={text} onChange={(e) => setText(e.target.value)} />
												<div className='flex flex-row min-h-12 min-w-12 item-center p-1'>
													<Button disabled={text.length < 1} className='rounded-full p-4 bg-main' onClick={handleSendMessage}>
														<div>
															<svg fill="#FFFFFF" width="800px" height="800px" viewBox="0 0 1920 1920" xmlns="http://www.w3.org/2000/svg">
																<path d="M568.13.012 392 176.142l783.864 783.989L392 1743.87 568.13 1920l960.118-959.87z" fillRule="evenodd" />
															</svg>
														</div>
													</Button>
												</div>
											</div>
										</div>
									</div>

								</div>

							)
						}
						{!selectedChat &&

							(
								<div className=' flex flex-row justify-center items-center h-full w-full'>
									<p className='h3-bold'>Select a Chat</p>
								</div>
							)
						}
					</section>
  )
}

export default ChatScreen