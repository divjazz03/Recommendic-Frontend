import ChatInputArea from '@/components/ChatInputArea';
import { AlertCircle } from 'lucide-react';
import React from 'react'
import { ChatViewProps } from './MobileView';

const ChatSection = (
    {
        message,
        messages,
        setMessage,
        messagesEndRef,
        sendMessage,
        scrollToBottom
    }: ChatViewProps
) => (
    <div className="flex-1 flex flex-col overflow-y-auto h-full">
        <div className="flex-1 overflow-y-auto p-4 border space-y-4">
            {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'doctor' ? 'justify-end' : msg.sender === 'patient' ? 'justify-start' : 'justify-center'}`}>
                    {msg.type === 'system' ? (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 max-w-md text-center">
                            <div className="flex items-center justify-center gap-2 text-main">
                                <AlertCircle className="w-4 h-4" />
                                <span className="text-sm">{msg.content}</span>
                            </div>
                            <span className="text-xs mt-1 block">{msg.timestamp}</span>
                        </div>
                    ) : (
                        <div key={msg.id} className={`relative max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${msg.sender === 'doctor'
                            ? 'bg-main text-white'
                            : 'bg-white text-gray-900 border border-gray-200'
                            }`}>
                            {msg.content.split('\n').map((value) => (<p className="text-sm">{value}</p>))}
                            <span className={`text-xs mt-1 block ${msg.sender === 'doctor' ? 'text-green-100' : 'text-gray-500'
                                }`}>
                                {msg.timestamp}
                            </span>
                            <div className={`absolute w-2 h-5 -bottom-[6px]  ${msg.sender === 'doctor' ? 'right-0 rounded-l-full bg-main' : '-left-[1px] rounded-r-full bg-white border-l border-b'}`}></div>
                        </div>
                    )}
                </div>
            ))}
            <div ref={messagesEndRef} />
        </div>

        <div className="border border-gray-200  p-2 h-fit ">
            <ChatInputArea
                message={message}
                messagesEndRef={messagesEndRef}
                scrollToBottom={scrollToBottom}
                sendMessage={sendMessage}
                setMessage={setMessage}
            />
        </div>
    </div>
);

export default ChatSection