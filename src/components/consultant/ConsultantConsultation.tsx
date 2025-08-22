import { Activity, AlertCircle, Calendar, CheckCircle, Clock, Edit3, ExternalLink, FileText, Heart, MessageCircle, Paperclip, Pill, Plus, Save, Send, Shield, Thermometer, User, Video, X } from 'lucide-react';
import React, { MutableRefObject, useRef, useState } from 'react'
import TextareaAutosize from 'react-textarea-autosize'
import ChatInputArea from '../ChatInputArea';


interface Message {
    id: number,
    sender: string,
    content: string,
    timestamp: string,
    type: 'system' | 'message'
}
interface Medication {
    name: string,
    dosage: string,
    frequency: string,
    duration: string
}
interface Prescription extends Medication {
    id: number,
}
interface PatientData {
    name: string
    age: number
    gender: string
    allergies: string[]
    conditions: string[]
    lastVisit: string
    insurance: string
    vitals: {
        bloodPressure: string
        heartRate: string
        temperature: string
        weight: string
    }

}
interface ConsultationInfoProps {
    message: string,
    setMessage: (value: React.SetStateAction<string>) => void
    messages: Message[]
    setMessages: (values: React.SetStateAction<Message[]>) => void
    clinicalNotes: string
    setClinicalNotes: (value: React.SetStateAction<string>) => void
    diagnosis: string
    setDiagnosis: (value: React.SetStateAction<string>) => void
    prescription: Prescription[]
    setPrescription: (value: React.SetStateAction<Prescription[]>) => void
    newMedication: { name: string, dosage: string, frequency: string, duration: string }
    setNewMedication: (value: React.SetStateAction<Medication>) => void
    showPrescriptionForm: boolean
    setShowPrescriptionForm: (value: React.SetStateAction<boolean>) => void
    videoStatus: string
    consultationTime: string
    patientData: PatientData
    sendMessage: () => void
    addPrescription: () => void
    removePrescription: (id: number) => void
    scrollToBottom: (ref: MutableRefObject<HTMLDivElement>) => void
}
interface DeskTopMedicalInfoProps extends MedicalInfoProps {
    setActiveTab: (value: React.SetStateAction<string>) => void
    activeTab: string
}
interface MedicalInfoProps {
    clinicalNotes: string,
    setClinicalNotes: (value: React.SetStateAction<string>) => void
    diagnosis: string
    setDiagnosis: (value: React.SetStateAction<string>) => void
    prescription: Prescription[]
    setPrescription: (value: React.SetStateAction<Prescription[]>) => void
    newMedication: { name: string, dosage: string, frequency: string, duration: string }
    setNewMedication: (value: React.SetStateAction<Medication>) => void
    showPrescriptionForm: boolean
    setShowPrescriptionForm: (value: React.SetStateAction<boolean>) => void
    patientData: PatientData
    addPrescription: () => void
    removePrescription: (id: number) => void
}
interface ChatViewProps {
    message: string,
    setMessage: (value: React.SetStateAction<string>) => void
    messages: Message[]
    sendMessage: () => void
    scrollToBottom: (ref: MutableRefObject<HTMLDivElement>) => void
    messagesEndRef: MutableRefObject<HTMLDivElement | null>
}
interface NoteViewProps {
    clinicalNotes: string,
    setClinicalNotes: (value: React.SetStateAction<string>) => void
    diagnosis: string
    setDiagnosis: (value: React.SetStateAction<string>) => void
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

const PrescriptionView = ({
    addPrescription,
    newMedication,
    prescription,
    removePrescription,
    setNewMedication,
    setShowPrescriptionForm,
    showPrescriptionForm
}: MedicalInfoProps) => (
    <div className="flex-1 p-4 space-y-4 bg-gray-50">
        <div className="flex items-center justify-between">
            <h4 className="font-semibold text-gray-900">Medications</h4>
            <button
                onClick={() => setShowPrescriptionForm(!showPrescriptionForm)}
                className="flex items-center gap-2 px-3 py-2 bg-main-light text-white text-sm rounded-lg"
            >
                <Plus className="w-4 h-4" />
                Add Med
            </button>
        </div>

        {showPrescriptionForm && (
            <div className="bg-white border border-gray-200 rounded-lg p-4 space-y-2">
                <h5 className="font-medium text-main">Add Medication</h5>
                <input
                    type="text"
                    placeholder="Medication name"
                    value={newMedication.name}
                    onChange={(e) => setNewMedication({ ...newMedication, name: e.target.value })}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg "
                />
                <div className="grid grid-cols-2 gap-3">
                    <input
                        type="text"
                        placeholder="Dosage"
                        value={newMedication.dosage}
                        onChange={(e) => setNewMedication({ ...newMedication, dosage: e.target.value })}
                        className="px-3 py-3 border border-gray-300 rounded-lg  "
                    />
                    <input
                        type="text"
                        placeholder="Frequency"
                        value={newMedication.frequency}
                        onChange={(e) => setNewMedication({ ...newMedication, frequency: e.target.value })}
                        className="px-3 py-3 border border-gray-300 rounded-lg  "
                    />
                </div>
                <input
                    type="text"
                    placeholder="Duration (e.g., 7 days)"
                    value={newMedication.duration}
                    onChange={(e) => setNewMedication({ ...newMedication, duration: e.target.value })}
                    className="w-full px-3 py-3 border border-gray-300 rounded-lg  "
                />
                <div className="flex gap-3">
                    <button
                        onClick={addPrescription}
                        className="flex-1 px-4 py-3 bg-main-light hover:bg-main text-white rounded-lg font-medium"
                    >
                        Add Medication
                    </button>
                    <button
                        onClick={() => setShowPrescriptionForm(false)}
                        className="px-4 py-3 border border-gray-300 text-gray-700 rounded-lg"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        )}

        <div className="space-y-3">
            {prescription.map((med) => (
                <div key={med.id} className="bg-white border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                                <Pill className="w-5 h-5 text-green-600" />
                                <span className="font-medium text-gray-900">{med.name}</span>
                            </div>
                            <p className="text-sm text-gray-600 mb-1">{med.dosage} • {med.frequency}</p>
                            <p className="text-sm text-gray-500">Duration: {med.duration}</p>
                        </div>
                        <button
                            onClick={() => removePrescription(med.id)}
                            className="p-2 text-red-400 hover:text-red-600"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            ))}

            {prescription.length === 0 && (
                <div className="text-center text-gray-500 py-12">
                    <Pill className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No medications prescribed yet</p>
                    <p className="text-sm">Tap "Add Med" to prescribe medication</p>
                </div>
            )}
        </div>
    </div>
);
const NotesView = ({
    diagnosis,
    setClinicalNotes,
    setDiagnosis,
    clinicalNotes
}: NoteViewProps) => (
    <div className="flex-1 p-4 space-y-4 bg-gray-50">
        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-3">
            <button className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
                <Heart className="w-5 h-5 text-red-500" />
                <span className="text-sm font-medium">Vitals</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
                <FileText className="w-5 h-5 text-blue-500" />
                <span className="text-sm font-medium">Templates</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
                <Activity className="w-5 h-5 text-green-500" />
                <span className="text-sm font-medium">Lab Orders</span>
            </button>
            <button className="flex items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
                <Calendar className="w-5 h-5 text-purple-500" />
                <span className="text-sm font-medium">Follow-up</span>
            </button>
        </div>

        {/* Clinical Notes */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex items-center justify-between mb-3">
                <h4 className="font-semibold text-gray-900">Clinical Notes</h4>
                <button className="p-1 text-gray-400">
                    <Edit3 className="w-4 h-4" />
                </button>
            </div>
            <textarea
                value={clinicalNotes}
                onChange={(e) => setClinicalNotes(e.target.value)}
                className="w-full h-32 px-3 py-2 text-sm border border-gray-300 rounded resize-none "
                placeholder="Enter clinical observations..."
            />
        </div>

        {/* Diagnosis */}
        <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h4 className="font-semibold text-gray-900 mb-3">Provisional Diagnosis</h4>
            <textarea
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                className="w-full h-24 px-3 py-2 text-sm border border-gray-300 rounded resize-none"
                placeholder="Enter diagnosis..."
            />
        </div>
    </div>
);

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
    const PatientView = () => (
        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {/* Allergies Alert */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <h4 className="font-semibold text-red-800">Allergies</h4>
                </div>
                <div className="space-y-1">
                    {patientData.allergies.map((allergy, index) => (
                        <div key={index} className="text-sm text-red-700">⚠️ {allergy}</div>
                    ))}
                </div>
            </div>

            {/* Vital Signs */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Vital Signs</h4>
                <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-3">
                        <Heart className="w-6 h-6 text-red-500" />
                        <div>
                            <p className="text-sm text-gray-600">Heart Rate</p>
                            <p className="font-semibold">{patientData.vitals.heartRate}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Activity className="w-6 h-6 text-green-500" />
                        <div>
                            <p className="text-sm text-gray-600">Blood Pressure</p>
                            <p className="font-semibold">{patientData.vitals.bloodPressure}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Thermometer className="w-6 h-6 text-orange-500" />
                        <div>
                            <p className="text-sm text-gray-600">Temperature</p>
                            <p className="font-semibold">{patientData.vitals.temperature}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <User className="w-6 h-6 text-gray-500" />
                        <div>
                            <p className="text-sm text-gray-600">Weight</p>
                            <p className="font-semibold">{patientData.vitals.weight}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Medical Conditions */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Medical Conditions</h4>
                <div className="space-y-2">
                    {patientData.conditions.map((condition, index) => (
                        <div key={index} className="flex items-center gap-2 p-2 bg-orange-50 rounded">
                            <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                            <span className="text-sm text-orange-800">{condition}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Patient Info */}
            <div className="bg-white rounded-lg border border-gray-200 p-4">
                <h4 className="font-semibold text-gray-900 mb-3">Patient Information</h4>
                <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                        <span className="text-gray-600">Gender:</span>
                        <span className="font-medium">{patientData.gender}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Last Visit:</span>
                        <span className="font-medium">{patientData.lastVisit}</span>
                    </div>
                    <div className="flex justify-between">
                        <span className="text-gray-600">Insurance:</span>
                        <span className="font-medium">{patientData.insurance}</span>
                    </div>
                </div>
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
                return <PatientView />;
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
                        <div key={msg.id} className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${msg.sender === 'doctor'
                            ? 'bg-main text-white'
                            : 'bg-white text-gray-900 border border-gray-200'
                            }`}>
                            {msg.content.split('\n').map((value) => (<p className="text-sm">{value}</p>))}
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
const MedicalPanel = ({
    setActiveTab,
    activeTab,
    clinicalNotes,
    setClinicalNotes,
    diagnosis,
    newMedication,
    prescription,
    setDiagnosis,
    setNewMedication,
    setShowPrescriptionForm,
    showPrescriptionForm,
    patientData,
    addPrescription,
    removePrescription

}: DeskTopMedicalInfoProps) => (
    <div className="w-96 bg-white border-l overflow-auto border-gray-200 p-4">
        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mb-4">
            <button
                onClick={() => setActiveTab('notes')}
                className={`px-3 py-2 text-sm font-medium border-b-2 ${activeTab === 'notes' ? 'border-main-light text-main-light' : 'border-transparent text-gray-500'
                    }`}
            >
                Clinical Notes
            </button>
            <button
                onClick={() => setActiveTab('prescription')}
                className={`px-3 py-2 text-sm font-medium border-b-2 ${activeTab === 'prescription' ? 'border-main-light text-main-light' : 'border-transparent text-gray-500'
                    }`}
            >
                Prescription
            </button>
            <button
                onClick={() => setActiveTab('history')}
                className={`px-3 py-2 text-sm font-medium border-b-2 ${activeTab === 'history' ? 'border-main-light text-main-light' : 'border-transparent text-gray-500'
                    }`}
            >
                History
            </button>
        </div>

        {activeTab === 'notes' && (
            <div className="space-y-4">
                <QuickActions />

                {/* Clinical Notes */}
                <div className="bg-gray-50 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                        <h5 className="text-sm font-medium text-gray-700">Clinical Notes</h5>
                        <button className="p-1 text-gray-400 hover:text-gray-600">
                            <Edit3 className="w-4 h-4" />
                        </button>
                    </div>
                    <textarea
                        value={clinicalNotes}
                        onChange={(e) => setClinicalNotes(e.target.value)}
                        className="w-full h-32 px-3 py-2 text-sm border border-gray-300 rounded resize-none  "
                        placeholder="Enter clinical observations, symptoms, examination findings..."
                    />
                </div>

                {/* Diagnosis */}
                <div className="bg-gray-50 rounded-lg p-3">
                    <h5 className="text-sm font-medium text-gray-700 mb-2">Provisional Diagnosis</h5>
                    <textarea
                        value={diagnosis}
                        onChange={(e) => setDiagnosis(e.target.value)}
                        className="w-full h-20 px-3 py-2 text-sm border border-gray-300 rounded resize-none  "
                        placeholder="Enter provisional diagnosis..."
                    />
                </div>

                {/* Vital Signs */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                    <h5 className="text-sm font-medium text-blue-700 mb-2">Current Vitals</h5>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex items-center gap-2">
                            <Heart className="w-4 h-4 text-red-500" />
                            <span>{patientData.vitals.heartRate}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Activity className="w-4 h-4 text-green-500" />
                            <span>{patientData.vitals.bloodPressure}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Thermometer className="w-4 h-4 text-orange-500" />
                            <span>{patientData.vitals.temperature}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-gray-500" />
                            <span>{patientData.vitals.weight}</span>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'prescription' && (
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h5 className="text-sm font-medium text-gray-700">Medications</h5>
                    <button
                        onClick={() => setShowPrescriptionForm(!showPrescriptionForm)}
                        className="flex items-center gap-1 px-2 py-1 bg-main-light text-white text-xs rounded hover:bg-main-light"
                    >
                        <Plus className="w-3 h-3" />
                        Add Med
                    </button>
                </div>

                {showPrescriptionForm && (
                    <div className=" bg-blue-50 rounded-lg p-3 space-y-3">
                        <input
                            type="text"
                            placeholder="Medication name"
                            value={newMedication.name}
                            onChange={(e) => setNewMedication({ ...newMedication, name: e.target.value })}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded  focus:ring-main"
                        />
                        <div className="grid grid-cols-2 gap-2">
                            <input
                                type="text"
                                placeholder="Dosage"
                                value={newMedication.dosage}
                                onChange={(e) => setNewMedication({ ...newMedication, dosage: e.target.value })}
                                className="px-3 py-2 text-sm border border-gray-300 rounded  focus:ring-main"
                            />
                            <input
                                type="text"
                                placeholder="Frequency"
                                value={newMedication.frequency}
                                onChange={(e) => setNewMedication({ ...newMedication, frequency: e.target.value })}
                                className="px-3 py-2 text-sm border border-gray-300 rounded  focus:ring-main"
                            />
                        </div>
                        <input
                            type="text"
                            placeholder="Duration (e.g., 7 days)"
                            value={newMedication.duration}
                            onChange={(e) => setNewMedication({ ...newMedication, duration: e.target.value })}
                            className="w-full px-3 py-2 text-sm border border-gray-300 rounded  focus:ring-main"
                        />
                        <div className="flex gap-2">
                            <button
                                onClick={addPrescription}
                                className="flex-1 px-3 py-2 bg-main-light text-white text-sm rounded hover:bg-main"
                            >
                                Add
                            </button>
                            <button
                                onClick={() => setShowPrescriptionForm(false)}
                                className="px-3 py-2 border border-gray-300 text-gray-700 text-sm rounded hover:bg-blue-50"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}

                <div className="space-y-2">
                    {prescription.map((med) => (
                        <div key={med.id} className="bg-white border border-gray-200 rounded-lg p-3">
                            <div className="flex items-start justify-between">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Pill className="w-4 h-4 text-green-600" />
                                        <span className="font-medium text-gray-900 text-sm">{med.name}</span>
                                    </div>
                                    <p className="text-xs text-gray-600">{med.dosage} • {med.frequency}</p>
                                    <p className="text-xs text-gray-500">Duration: {med.duration}</p>
                                </div>
                                <button
                                    onClick={() => removePrescription(med.id)}
                                    className="p-1 text-red-400 hover:text-red-600"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    ))}

                    {prescription.length === 0 && (
                        <div className="text-center text-gray-500 text-sm py-8">
                            No medications prescribed yet
                        </div>
                    )}
                </div>
            </div>
        )}

        {activeTab === 'history' && (
            <div className="space-y-4">
                {/* Medical Conditions */}
                <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <h5 className="text-sm font-medium text-red-700 mb-2">Medical Conditions</h5>
                    <div className="space-y-1">
                        {patientData.conditions.map((condition, index) => (
                            <div key={index} className="text-sm text-red-600">• {condition}</div>
                        ))}
                    </div>
                </div>

                {/* Allergies */}
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                    <h5 className="text-sm font-medium text-orange-700 mb-2">Allergies</h5>
                    <div className="space-y-1">
                        {patientData.allergies.map((allergy, index) => (
                            <div key={index} className="text-sm text-orange-600">⚠️ {allergy}</div>
                        ))}
                    </div>
                </div>

                {/* Previous Consultations */}
                <div className="bg-gray-50 rounded-lg p-3">
                    <h5 className="text-sm font-medium text-gray-700 mb-2">Recent Consultations</h5>
                    <div className="space-y-2 text-sm text-gray-600">
                        <div className="border-l-2 border-green-200 pl-3">
                            <p className="font-medium">6 months ago</p>
                            <p>Annual check-up • Dr. Williams</p>
                            <p className="text-xs">BP slightly elevated, advised lifestyle changes</p>
                        </div>
                        <div className="border-l-2 border-blue-200 pl-3">
                            <p className="font-medium">1 year ago</p>
                            <p>Diabetes follow-up • Dr. Chen</p>
                            <p className="text-xs">HbA1c: 7.2%, medication adjusted</p>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* Save Button */}
        <div className="mt-6 pt-4 border-t border-gray-200">
            <button className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-main-light text-white rounded-lg hover:bg-main transition-colors">
                <Save className="w-4 h-4" />
                Save & Complete Session
            </button>
        </div>
    </div>
);
const QuickActions = () => (
    <div className="bg-gray-50 rounded-lg p-3 mb-4">
        <h5 className="text-sm font-medium text-gray-700 mb-3">Quick Actions</h5>
        <div className="grid grid-cols-2 gap-2">
            <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-sm">
                <Heart className="w-4 h-4 text-red-500" />
                Vital Signs
            </button>
            <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-sm">
                <FileText className="w-4 h-4 text-blue-500" />
                Templates
            </button>
            <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-sm">
                <Activity className="w-4 h-4 text-green-500" />
                Lab Orders
            </button>
            <button className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-sm">
                <Calendar className="w-4 h-4 text-purple-500" />
                Follow-up
            </button>
        </div>
    </div>
);
const DesktopView = (
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
    const [activeTab, setActiveTab] = useState('notes');
    const messagesEndRef = useRef<MutableRefObject<HTMLDivElement> | null>(null)

    const PatientInfo = () => (
        <div className="bg-white border-b border-gray-200 p-4">
            <div className="flex items-center gap-4">
                <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
                    alt="John Smith"
                    className="w-12 h-12 rounded-full"
                />
                <div className="flex-1">
                    <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-gray-900">{patientData.name}</h3>
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                            {patientData.age}y, {patientData.gender}
                        </span>
                    </div>
                    <p className="text-sm text-gray-600">Last visit: {patientData.lastVisit} • {patientData.insurance}</p>
                    <div className="flex items-center gap-4 mt-1">
                        <span className="text-xs text-red-600">⚠️ Allergies: {patientData.allergies.join(', ')}</span>
                    </div>
                </div>
                <div className="text-right">
                    <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                        <span className="text-sm text-gray-600">In Session</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                        <Clock className="w-4 h-4" />
                        <span>{consultationTime}</span>
                    </div>
                </div>
            </div>
        </div>
    );

    const VideoCallSection = () => (
        <div className="border-b border-gray-200 p-2">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="bg-white ring-1 ring-gray-500 rounded-lg p-3">
                        <CheckCircle className="w-6 h-6 text-main-light" />
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-900">Video Consultation Active</h4>
                        <p className="text-sm text-gray-600">Secure Zoom meeting in progress</p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    <button className="px-3 py-2 border text-xs border-main text-main rounded-lg hover:bg-blue-100 transition-colors flex items-center gap-2">
                        <ExternalLink className="w-4 h-4" />
                        Return to Video
                    </button>
                    <button className="px-3 py-2 text-xs bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                        End Session
                    </button>
                </div>
            </div>
        </div>
    );



    return (
        <div className="hidden lg:flex flex-col h-full max-w-7xl mx-auto bg-white rounded-lg">
            <PatientInfo />

            <div className="flex flex-row h-full">
                {/* Main Content */}
                <div className="flex-1 h-full overflow-y-auto">
                    <VideoCallSection />
                    <ChatSection
                        message={message}
                        messages={messages}
                        messagesEndRef={messagesEndRef}
                        scrollToBottom={scrollToBottom}
                        sendMessage={sendMessage}
                        setMessage={setMessage}
                    />
                </div>

                {/* Medical Panel */}
                <MedicalPanel
                    activeTab={activeTab}
                    addPrescription={addPrescription}
                    clinicalNotes={clinicalNotes}
                    diagnosis={diagnosis}
                    newMedication={newMedication}
                    patientData={patientData}
                    prescription={prescription}
                    removePrescription={removePrescription}
                    setActiveTab={setActiveTab}
                    setClinicalNotes={setClinicalNotes}
                    setDiagnosis={setDiagnosis}
                    setNewMedication={setNewMedication}
                    setPrescription={setPrescription}
                    setShowPrescriptionForm={setShowPrescriptionForm}
                    showPrescriptionForm={showPrescriptionForm}
                />
            </div>

            {/* Bottom Status Bar */}
            <div className=" border-t border-gray-200 px-4 py-2 flex items-center justify-between text-sm text-gray-600">
                <div className="flex items-center gap-4">
                    <span>Session ID: #CS-2024-0189</span>
                    <span>•</span>
                    <span>Patient ID: {patientData.name.replace(' ', '').toLowerCase()}001</span>
                </div>
                <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-main-light" />
                    <span>HIPAA Compliant</span>
                </div>
            </div>
        </div>
    )

}




const ConsultantConsultation = () => {
    const [message, setMessage] = useState<string>();
    const [clinicalNotes, setClinicalNotes] = useState('Patient reports chest pain for 3 days. Pain described as sharp, intermittent...')
    const [diagnosis, setDiagnosis] = useState('');
    const [prescription, setPrescription] = useState<Prescription[]>([]);
    const [newMedication, setNewMedication] = useState<Medication>({ name: '', dosage: '', frequency: '', duration: '' });
    const [showPrescriptionForm, setShowPrescriptionForm] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        {
            id: 1,
            sender: 'system',
            content: 'Patient John Smith has joined the consultation.',
            timestamp: '2:30 PM',
            type: 'system'
        },
        {
            id: 2,
            sender: 'patient',
            content: 'Hello Doctor, I\'ve been experiencing chest pain for the past few days.',
            timestamp: '2:30 PM',
            type: 'message'
        },
        {
            id: 3,
            sender: 'doctor',
            content: 'Hello John! Can you describe the type of chest pain you\'re experiencing?',
            timestamp: '2:31 PM',
            type: 'message'
        },
        {
            id: 4,
            sender: 'patient',
            content: 'It\'s a sharp pain that comes and goes, usually when I take deep breaths.',
            timestamp: '2:32 PM',
            type: 'message'
        }
    ]);
    const [videoStatus, setVideoStatus] = useState('connected');
    const [consultationTime, setConsultationTime] = useState('12:45');
    const patientData: PatientData = {
        name: 'John Smith',
        age: 45,
        gender: 'Male',
        allergies: ['Penicillin', 'Shellfish'],
        conditions: ['Hypertension', 'Type 2 Diabetes'],
        lastVisit: '6 months ago',
        insurance: 'Blue Cross Blue Shield',
        vitals: {
            bloodPressure: '140/90',
            heartRate: '78 bpm',
            temperature: '98.6°F',
            weight: '185 lbs'
        }
    };

    const scrollToBottom = (messagesEndRef: MutableRefObject<HTMLDivElement>) => {
        messagesEndRef.current?.scrollIntoView()
    };



    const sendMessage = () => {

        if (message && message.trim()) {
            const newMessage: Message = {
                id: messages.length + 1,
                sender: 'doctor',
                content: message,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                type: 'message'
            };
            setMessages([...messages, newMessage]);
            setMessage('');
        }
    };

    const addPrescription = () => {
        if (newMedication.name && newMedication.dosage) {
            setPrescription([...prescription, { ...newMedication, id: prescription.length + 1 }])
            setNewMedication({ name: '', dosage: '', frequency: '', duration: '' });
            setShowPrescriptionForm(false);
        }
    };

    const removePrescription = (id: number) => {
        setPrescription(prescription.filter(med => med.id !== id));
    }





    return (
        <main className='h-full'>

            <MobileView
                addPrescription={addPrescription}
                clinicalNotes={clinicalNotes}
                consultationTime={consultationTime}
                diagnosis={diagnosis}
                message={message ?? ''}
                messages={messages}
                newMedication={newMedication}
                patientData={patientData}
                prescription={prescription}
                removePrescription={removePrescription}
                sendMessage={sendMessage}
                setClinicalNotes={setClinicalNotes}
                setDiagnosis={setDiagnosis}
                setMessage={setMessage}
                setMessages={setMessages}
                setNewMedication={setNewMedication}
                setPrescription={setPrescription}
                setShowPrescriptionForm={setShowPrescriptionForm}
                showPrescriptionForm={showPrescriptionForm}
                videoStatus={videoStatus}
                scrollToBottom={scrollToBottom}
            />
            <DesktopView
                addPrescription={addPrescription}
                clinicalNotes={clinicalNotes}
                consultationTime={consultationTime}
                diagnosis={diagnosis}
                message={message ?? ''}
                messages={messages}
                newMedication={newMedication}
                patientData={patientData}
                prescription={prescription}
                removePrescription={removePrescription}
                sendMessage={sendMessage}
                setClinicalNotes={setClinicalNotes}
                setDiagnosis={setDiagnosis}
                setMessage={setMessage}
                setMessages={setMessages}
                setNewMedication={setNewMedication}
                setPrescription={setPrescription}
                setShowPrescriptionForm={setShowPrescriptionForm}
                showPrescriptionForm={showPrescriptionForm}
                videoStatus={videoStatus}
                scrollToBottom={scrollToBottom}
            />

        </main>
    )
}

export default ConsultantConsultation