import { MessageCircle, User, FileText, Pill, Clock, CheckCircle, ExternalLink, Save, AlertCircle, Activity, Heart, Plus, Thermometer, X } from 'lucide-react';
import React, { MutableRefObject, useRef, useState } from 'react'
import { ConsultationInfoProps, MedicalInfoProps, Message, PatientData } from '../ConsultantConsultation';
import NotesView from './NotesView';
import ChatInputArea from '@/components/ChatInputArea';
import PatientView from './PatientView';
import PrescriptionView from './PrescriptionView';

const MobileView = (
    { message,
        setMessage,
        messages,
        setMessages,
        clinicalNotes,
        setClinicalNotes,
        diagnosis,
        setDiagnosis,
        prescription,
        setPrescription,
        newMedication,
        setNewMedication,
        showPrescriptionForm,
        setShowPrescriptionForm,
        addPrescription,
        videoStatus,
        consultationTime,
        patientData,
        sendMessage,
        removePrescription,
        scrollToBottom
    }: ConsultationInfoProps

) => {

    const [currentView, setCurrentView] = useState('chat');
    const messagesEndRef = useRef<HTMLDivElement | null>(null)
    const NavigationBar = () => (
        <div className="bg-white border-y border-gray-200 px-2 pt-2 ">
            <div className="flex justify-around">
                <button
                    onClick={() => setCurrentView('chat')}
                    className={`flex flex-col items-center px-3 py-2 ${currentView === 'chat' ? 'border border-transparent border-b-2 border-b-main text-main' : 'text-gray-500'
                        }`}
                >
                    <MessageCircle className="w-5 h-5" />
                    <span className="text-xs mt-1">Chat</span>
                </button>
                <button
                    onClick={() => setCurrentView('patient')}
                    className={`flex flex-col items-center px-3 py-2 ${currentView === 'patient' ? 'border border-transparent border-b-2 border-b-main text-main' : 'text-gray-500'
                        }`}
                >
                    <User className="w-5 h-5" />
                    <span className="text-xs mt-1">Patient</span>
                </button>
                <button
                    onClick={() => setCurrentView('notes')}
                    className={`flex flex-col items-center px-3 py-2 ${currentView === 'notes' ? 'border border-transparent border-b-2 border-b-main text-main' : 'text-gray-500'
                        }`}
                >
                    <FileText className="w-5 h-5" />
                    <span className="text-xs mt-1">Notes</span>
                </button>
                <button
                    onClick={() => setCurrentView('prescription')}
                    className={`flex flex-col items-center px-5 py-2 ${currentView === 'prescription' ? 'border border-transparent border-b-2 border-b-main text-main' : 'text-gray-500'
                        }`}
                >
                    <Pill className="w-5 h-5" />
                    <span className="text-xs mt-1">Rx</span>
                </button>
                <button
                    onClick={() => setCurrentView('history')}
                    className={`flex flex-col items-center px-3 py-2 ${currentView === 'history' ? 'border border-transparent border-b-2 border-b-main text-main' : 'text-gray-500'
                        }`}
                >
                    <Clock className="w-5 h-5" />
                    <span className="text-xs mt-1">History</span>
                </button>
            </div>
        </div>
    );
    const Header = () => (
        <div className="bg-white border-b border-gray-200 p-4 sticky top-0 z-10 ">
            <div className="flex items-center gap-3">
                <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
                    alt="John Smith"
                    className="w-10 h-10 rounded-full"
                />
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-gray-900 truncate">{patientData.name}</h3>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full shrink-0">
                            {patientData.age}y
                        </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span className="truncate">{consultationTime} • In Session</span>
                    </div>
                </div>
                {/* <button className="p-2 bg-main-light text-white rounded-lg">
                    <Video className="w-5 h-5" />
                </button> */}
            </div>

            {/* Video Status Banner */}
            <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-main-light" />
                    <span className="text-sm text-main">Video call active</span>
                </div>
                <button className="flex items-center gap-1 px-2 py-1 border border-main-light bg-white text-main text-xs rounded">
                    <ExternalLink className="w-3 h-3" />
                    Join
                </button>
            </div>
        </div>
    );

    const HistoryView = () => (
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {/* Previous Consultations */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h4 className="font-semibold text-gray-900 mb-4">Recent Consultations</h4>
                <div className="space-y-4">
                    <div className="border-l-4 border-green-200 pl-4">
                        <div className="flex justify-between items-start mb-1">
                            <p className="font-medium text-gray-900">6 months ago</p>
                            <span className="text-xs text-gray-500">Dr. Williams</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">Annual check-up</p>
                        <p className="text-xs text-gray-500">BP slightly elevated, advised lifestyle changes</p>
                    </div>
                    <div className="border-l-4 border-blue-200 pl-4">
                        <div className="flex justify-between items-start mb-1">
                            <p className="font-medium text-gray-900">1 year ago</p>
                            <span className="text-xs text-gray-500">Dr. Chen</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-1">Diabetes follow-up</p>
                        <p className="text-xs text-gray-500">HbA1c: 7.2%, medication adjusted</p>
                    </div>
                </div>
            </div>

            {/* Lab Results */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h4 className="font-semibold text-gray-900 mb-4">Recent Lab Results</h4>
                <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                        <span className="text-sm font-medium">Cholesterol</span>
                        <span className="text-sm text-green-700">Normal</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                        <span className="text-sm font-medium">HbA1c</span>
                        <span className="text-sm text-yellow-700">7.2% (High)</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                        <span className="text-sm font-medium">Blood Count</span>
                        <span className="text-sm text-green-700">Normal</span>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderCurrentView = () => {
        switch (currentView) {
            case 'chat':
                return <ChatView
                    message={message}
                    messagesEndRef={messagesEndRef}
                    messages={messages}
                    sendMessage={sendMessage}
                    setMessage={setMessage}
                    scrollToBottom={scrollToBottom}
                />;
            case 'patient':
                return <PatientView
                    patientData={patientData}
                />;
            case 'notes':
                return <NotesView
                    clinicalNotes={clinicalNotes}
                    diagnosis={diagnosis}
                    setClinicalNotes={setClinicalNotes}
                    setDiagnosis={setDiagnosis}
                />;
            case 'prescription':
                return <PrescriptionView
                    addPrescription={addPrescription}
                    clinicalNotes={clinicalNotes}
                    diagnosis={diagnosis}
                    newMedication={newMedication}
                    patientData={patientData}
                    prescription={prescription}
                    removePrescription={removePrescription}
                    setClinicalNotes={setClinicalNotes}
                    setDiagnosis={setDiagnosis}
                    setNewMedication={setNewMedication}
                    setPrescription={setPrescription}
                    setShowPrescriptionForm={setShowPrescriptionForm}
                    showPrescriptionForm={showPrescriptionForm}
                />;
            case 'history':
                return <HistoryView />;
            default:
                return <ChatView
                    message={message}
                    messagesEndRef={messagesEndRef}
                    messages={messages}
                    sendMessage={sendMessage}
                    scrollToBottom={scrollToBottom}
                    setMessage={setMessage} />;
        }
    };



    return (
        <div className='lg:hidden h-full'>
            <NavigationBar />
            <Header />
            <div className='overflow-auto h-full'>
                {renderCurrentView()}

            </div>
            {currentView !== 'chat' && (
                <div className="p-4 bg-white border-t border-gray-200">
                    <button className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-main-light hover:bg-main text-white rounded-lg font-medium">
                        <Save className="w-5 h-5" />
                        Save Changes
                    </button>
                </div>
            )}

        </div>
    )

}

export default MobileView



export interface ChatViewProps {
    message: string,
    setMessage: (value: React.SetStateAction<string>) => void
    messages: Message[]
    sendMessage: () => void
    scrollToBottom: (ref: MutableRefObject<HTMLDivElement>) => void
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
    <div className="flex flex-col overflow-y-auto border-2 h-full">
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-4">
            {messages && messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === 'doctor' ? 'justify-end' : 'justify-start'}`}>
                    {msg.type === 'system' ? (
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 max-w-xs text-center">
                            <div className="flex items-center justify-center gap-2 text-main-light">
                                <AlertCircle className="w-4 h-4" />
                                <span className="text-sm ">{msg.content}</span>
                            </div>
                            <span className="text-xs  mt-1 block">{msg.timestamp}</span>
                        </div>
                    ) : (
                        <div className={`max-w-xs px-4 py-2 rounded-lg ${msg.sender === 'doctor'
                            ? 'bg-main text-white'
                            : 'bg-white text-gray-900 border border-gray-200'
                            }`}>
                            {msg.content.split('\n').map((message) => (<p className="text-sm text-wrap">{message}</p>))}
                            <span className={`text-xs mt-1 block ${msg.sender === 'doctor' ? 'text-green-100' : 'text-gray-500'
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

