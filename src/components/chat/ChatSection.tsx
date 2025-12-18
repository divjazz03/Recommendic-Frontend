import ChatInputArea from '@/components/shared/ChatInputArea';
import { AlertCircle, ArrowLeft, MoreVertical } from 'lucide-react';
import React, { useRef, useState } from 'react'
import InitialsOrAvartar from '../shared/InitialsOrAvartar';
import { ChatType, Message, useChat } from '@/hooks/useChat';


interface ChatSectionProps {
    scrollToBottom: (value: React.MutableRefObject<HTMLDivElement | null>) => void
    selectedChat: ChatType | null | undefined,
    setSelectedChat: (value: React.SetStateAction<ChatType | null | undefined>) => void  
}

const ChatSection = (
    {  
        scrollToBottom,
        selectedChat,
        setSelectedChat
    }: ChatSectionProps
) => {
    const [message, setMessage] = useState<string>();
    const messagesEndRef = useRef<HTMLDivElement | null>(null)
    const {chats, setChats} = useChat();
    if (!selectedChat) {
        return null;
    }
    const sendMessage = () => {
            if (message && message.trim()) {
                const newMessage: Message = {
                    sender: 'me',
                    content: message,
                    sessionId: selectedChat.sessionId,
                    type: 'message',
                    delivered: false,
                    timestamp: new Date().toISOString()
                };
                setSelectedChat(prev => (
                    {
                        ...prev,
                        messages: [...prev.messages, 
                            newMessage]
                    }));
                setMessage('');
            }
        };
    return (<div className="flex-1 flex flex-col w-full overflow-y-auto h-full">
        <header className='h-16 flex justify-between items-center w-full border border-gray-200 py-1 px-2'>
            <div className='flex flex-row items-center gap-3'>
                <ArrowLeft className='lg:hidden'/>
                <InitialsOrAvartar avatarUrl={selectedChat.otherImageUrl} userName={selectedChat.otherFullName ?? 'Test Fullname'}/>
                <div>
                    <p className='font-semibold text-lg'>{selectedChat.otherFullName ?? 'Test Fullname'}</p>
                    <p className='font-thin text-xs'>{status ?? 'last seen 20min ago'}</p>
                </div>
            </div>
            <MoreVertical />
        </header>
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {selectedChat.messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : msg.sender === 'other' ? 'justify-start' : 'justify-center'}`}>
                    {msg.type === 'system' ? (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 max-w-md text-center">
                            <div className="flex items-center justify-center gap-2 text-main">
                                <AlertCircle className="w-4 h-4" />
                                <span className="text-sm">{msg.content}</span>
                            </div>
                            <span className="text-xs mt-1 block">{msg.timestamp}</span>
                        </div>
                    ) : (
                        <div key={msg.id} className={`relative max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${msg.sender === 'me'
                            ? 'bg-main text-white'
                            : 'bg-white text-gray-900 border border-gray-200'
                            }`}>
                            {msg.content.split('\n').map((value) => (<p className="text-sm">{value}</p>))}
                            <span className={`text-xs mt-1 block ${msg.sender === 'me' ? 'text-green-100' : 'text-gray-500'
                                }`}>
                                {msg.timestamp}
                            </span>
                            <div className={`absolute w-2 h-5 -bottom-[6px]  ${msg.sender === 'me' ? 'right-0 rounded-l-full bg-main' : '-left-[1px] rounded-r-full bg-white border-l border-b'}`}></div>
                        </div>
                    )}
                </div>
            ))}
            <div ref={messagesEndRef} />
        </div>

        <div className="border border-gray-200 p-2 bg-white h-fit ">
            <ChatInputArea
                message={message}
                messagesEndRef={messagesEndRef}
                scrollToBottom={scrollToBottom}
                sendMessage={sendMessage}
                setMessage={setMessage}
            />
        </div>
    </div>
)};

export default ChatSection