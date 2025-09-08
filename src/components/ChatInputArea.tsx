import { Key, Paperclip, Send } from 'lucide-react';
import React, { MutableRefObject, useEffect, useRef, useState } from 'react'

interface ChatInputAreaProps {
    message: string
    sendMessage: () => void,
    messagesEndRef: MutableRefObject<HTMLDivElement|null>
    setMessage: (value: React.SetStateAction<string>) => void
    scrollToBottom?: (ref: MutableRefObject<HTMLDivElement|null>) => void
}

const ChatInputArea: React.FC<ChatInputAreaProps> = ({
    sendMessage,setMessage,messagesEndRef,scrollToBottom,message
}) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null)
    const [scrollHeight, setScrollHeight] = useState(0);

    useEffect(() => {
        const textarea = textareaRef.current;
        if (!textarea) return;
        console.log(message.split("\n").length)
        textarea.style.height = Math.max(message.split("\n").length * 31, 40) + 'px';
    }, [message])

    return (

        <div className="flex items-center gap-3 ">
            <button className="p-2 text-gray-400 hover:text-gray-600">
                <Paperclip className="w-5 h-5" />
            </button>
            <div className="flex-1 p-1 max-h-28 overflow-auto border rounded-lg">
                <textarea
                    ref={textareaRef}
                    onChange={(e) => {
                            setMessage(e.target.value)}
                        }
                    onKeyDown={(e) => {
                            if (e.shiftKey && e.key === 'Enter') {
                                //setMessage(e => e+"\n")
                                return
                            }
                            if (e.key === 'Enter') {
                                sendMessage()
                                if (scrollToBottom) scrollToBottom(messagesEndRef)
                                if (textareaRef.current) textareaRef.current.value=''
                                return
                            }
                        }}
                    placeholder={"Send a message"}
                    value={message}
                    rows={2}
                    style={{
                        resize: 'none'
                    }}
                    className='rounded-lg py-2 px-1 tracking-wider outline-none w-full'
                />
            </div>
            <button
                onClick={sendMessage}
                className="p-2 bg-main-light text-white rounded-lg hover:bg-main"
            >
                <Send className="w-5 h-5" />
            </button>
        </div>
    )
}

export default ChatInputArea