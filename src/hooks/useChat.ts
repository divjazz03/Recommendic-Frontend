import { DateTime } from "luxon";
import { useEffect, useState } from "react";

type ChatMessageType = "system" | "message"
type ChatMessageSender = "system" | "me" | string
export interface Message {
    id?: string
    sessionId: string
    sender: ChatMessageSender
    content: string
    timestamp: string
    type: ChatMessageType
    delivered: boolean
    read?: boolean
}
export interface ChatType {
    otherId: string
    otherImageUrl?: string
    otherFullName: string
    messages: Message[]
    lastSeen: string
    hasUnreadMessages: boolean
    sessionId: string
}

const sampleMessages: Message[] = [
    {
        id: "1",
        sender: 'system',
        sessionId: '2',
        content: 'Patient John Smith has joined the session.',
        timestamp: '2:30 PM',
        type: 'system',
        delivered: false
    },
    {
        id: '2',
        sender: 'other',
        sessionId: '2',
        content: 'Hello Doctor, I\'ve been experiencing chest pain for the past few days.',
        timestamp: '2:30 PM',
        type: 'message',
        delivered: false,
        read: true
    },
    {
        id: '3',
        sender: 'me',
        sessionId: '2',
        content: 'Hello John! Can you describe the type of chest pain you\'re experiencing?',
        timestamp: '2:31 PM',
        type: 'message',
        delivered: false,
    },
    {
        id: '4',
        sender: 'other',
        sessionId: '2',
        content: 'It\'s a sharp pain that comes and goes, usually when I take deep breaths.',
        timestamp: '2:32 PM',
        type: 'message',
        delivered: false,
        read: false
    }
]
const chatsSample: ChatType[] = [
{
        otherId: "9jsjfosiojfs",
        hasUnreadMessages: true,
        lastSeen: DateTime.now().toISO(),
        messages: sampleMessages,
        otherFullName: "Random Name",
        otherImageUrl: undefined,
        sessionId: "fsfssssfs"
    },
    {
        otherId: "9jsjfosiojff",
        hasUnreadMessages: true,
        lastSeen: DateTime.now().toISO(),
        messages: sampleMessages,
        otherFullName: "John Dame",
        otherImageUrl: undefined,
        sessionId: "fsfssssfs"
    },
    {
        otherId: "9jsjfosiojfa",
        hasUnreadMessages: true,
        lastSeen: DateTime.now().toISO(),
        messages: sampleMessages,
        otherFullName: "Beats Mane",
        otherImageUrl: undefined,
        sessionId: "fsfssssfs"
    },
    {    otherId: "9jsjfosiojfqs",
        hasUnreadMessages: true,
        lastSeen: DateTime.now().toISO(),
        messages: sampleMessages,
        otherFullName: "Hone Game",
        otherImageUrl: undefined,
        sessionId: "fsfssssfs"
    },
    {
        otherId: "9jsjfosioqff",
        hasUnreadMessages: true,
        lastSeen: DateTime.now().toISO(),
        messages: sampleMessages,
        otherFullName: "Sola Iamed",
        otherImageUrl: undefined,
        sessionId: "fsfssssfs"
    },
    {
        otherId: "9jsjfesiojfa",
        hasUnreadMessages: true,
        lastSeen: DateTime.now().toISO(),
        messages: sampleMessages,
        otherFullName: "Dame Mane",
        otherImageUrl: undefined,
        sessionId: "fsfssssfs"
    },
]
export const useChat = () => {
    
        const [chatSectionVisible, setChatSectionVisible] = useState(false);
        const [chats, setChats] = useState<ChatType[]>(chatsSample);

    useEffect(() => {
        setChats(chatsSample)
    },[chats])
    return {
        chatSectionVisible,
        setChatSectionVisible,
        chats,
        setChats
    }
}