import ChatInputArea from '@/components/ChatInputArea';
import React, { MutableRefObject } from 'react'
import { Message } from '../ConsultantConsultation';
import { AlertCircle } from 'lucide-react';


export interface ChatViewProps {
    message: string,
    setMessage: (value: React.SetStateAction<string>) => void
    messages: Message[]
    sendMessage: () => void
    scrollToBottom?: (ref: MutableRefObject<HTMLDivElement|null>) => void
    messagesEndRef: MutableRefObject<HTMLDivElement | null>
}

const ChatView = ({
    message,
    messages,
    setMessage,
    sendMessage,
    scrollToBottom,
    messagesEndRef
}: ChatViewProps) => (
    <div className="flex flex-col overflow-y-auto h-full">
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-4">
            {messages && messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'me' ? 'justify-end' : msg.sender === 'other'? 'justify-start': 'justify-center'}`}>
                    {msg.type === 'system' ? (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 max-w-xs text-center">
                            <div className="flex items-center gap-2 text-main-light">
                                <AlertCircle className="w-4 h-4" />
                                <span className="text-sm ">{msg.content}</span>
                            </div>
                            <span className="text-xs  mt-1 block">{msg.timestamp}</span>
                        </div>
                    ) : (
                        <div className={`max-w-xs px-4 py-2 rounded-lg ${msg.sender === 'me'
                            ? 'bg-main text-white'
                            : 'bg-white text-gray-900 border border-gray-200'
                            }`}>
                            {<p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>}
                            <span className={`text-xs mt-1 block ${msg.sender === 'me' ? 'text-green-100' : 'text-gray-500'
                                }`}>
                                {msg.timestamp}
                            </span>
                        </div>
                    )}
                </div>

            ))}

            <div ref={messagesEndRef} />
        </div>

        <div className="border-t border-gray-200 bg-white p-4 border over">
            <ChatInputArea
                messagesEndRef={messagesEndRef}
                scrollToBottom={scrollToBottom}
                sendMessage={sendMessage}
                setMessage={setMessage}
                message={message}
            />
        </div>
    </div>
);

export default ChatView